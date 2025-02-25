import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ESTIMATED_BUDGET } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { BudgetService } from '../../current-budget/service/budget.service';
import { IEstimatedBudget } from '../model/IEstimatedBudget';
import { IEstimatedBudgetLines } from '../model/IEstimatedBudgetLines';
import { EstimatedBudgetService } from '../service/estimated-budget.service';


@Component({
  selector: 'kt-create-estimated-budget',
  templateUrl: './create-estimated-budget.component.html',
  styleUrls: ['./create-estimated-budget.component.scss']
})

export class CreateEstimatedBudgetComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;
  totalAmount: number;
  // Declaring form variable
  estimatedBudgetForm: FormGroup;

  

  //Title Name
  title: string = 'Create Anticipated Budget'

  estimatedBudgetModel: IEstimatedBudget = {} as IEstimatedBudget;
  estimatedBudgetMaster: IEstimatedBudget;

  showLines: boolean = false;


  // For Table Columns
  displayedColumns = ['accountId', 'amount', 'calculationType', 'value', 'estimatedValue', 'action']
  // Getting Table by id
  @ViewChild('table', { static: false }) table: any;
  // Validation messages..
  validationMessages = {
    budgetId: {
      required: 'Budget is required.',
    },
    estimatedBudgetName: {
      required: 'Budget Name is required.',
    },
  };
  // error keys..
  formErrors: any = {
    budgetId: '',
    estimatedBudgetName: ''
  };

  // constructor
  constructor(
    private fb: FormBuilder,
    public addNewButtonService: AddModalButtonService,
    private estimatedBudgetService: EstimatedBudgetService,
    private budgetService: BudgetService,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    public activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.estimatedBudgetForm = this.fb.group({
      budgetId: ['', [Validators.required]],
      estimatedBudgetName: ['', [Validators.required]],
      estimatedBudgetLines: this.fb.array([])
    });
    this.activatedRoute.params.subscribe((res: Params) => {
      if (res && res.id) {
        this.isLoading = true;
        this.title = 'Edit Anticipated Budget'
        this.getEstimatedBudgetMaster(res.id);
        this.showLines = true;
        this.cdRef.markForCheck();
      }
    })

    //Get Data from Store
    this.ngxsService.getAccountLevel4FromState()
    this.ngxsService.getBudgetsFromState()
  }

  //For Dropdown
  calculationType = [
    { id: 0, value: 'Percentage' },
    { id: 1, value: 'FixedAmount' }
  ]

  public getEstimatedBudgetMaster(id: any) {
    this.estimatedBudgetService.getEstimatedBudgetById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IEstimatedBudget>) => {
        // for mapping, getting values from estimatedBudgetMaster because of fields disablility
        this.estimatedBudgetMaster = res.result;
        this.patchBudget(this.estimatedBudgetMaster);
        this.estimatedBudgetModel = res.result;
      });
  }
  //for save or submit
  isSubmit(val: number) {
    this.estimatedBudgetModel.isSubmit = (val === 0) ? false : true;
  }
  addNewLineClick(): void {
    const controls = this.estimatedBudgetForm.controls.estimatedBudgetLines as FormArray;
    controls.push(this.addBudgetLines());
    this.table.renderRows();
    this.cdRef.detectChanges()
  }
  addBudgetLines(): FormGroup {
    return this.fb.group({
      accountId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      calculationType: ['', [Validators.required]],
      value: ['', [Validators.required, Validators.min(0)]],
      estimatedValue: ['']

    });
  }
  removeLineClick(budgetLineIndex: number): void {
    const budgetArray = this.estimatedBudgetForm.get('estimatedBudgetLines') as FormArray;
    budgetArray.removeAt(budgetLineIndex);
    budgetArray.markAsDirty();
    budgetArray.markAsTouched();
    this.table.renderRows();
    this.totalAmountCalculation()
    this.cdRef.detectChanges()
  }

  totalAmountCalculation() {
    this.totalAmount = 0;
    const controls = this.estimatedBudgetForm.controls.estimatedBudgetLines as FormArray;
    for (let index = 0; index < controls.length; index++) {
      this.totalAmount += Number(controls.at(index).get('amount').value);
    }
  }

  onItemSelected(budgetId: number) {
    this.isLoading = true;
    this.budgetService.getBudgetById(budgetId)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.showLines = true;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.estimatedBudgetForm.setControl('estimatedBudgetLines', this.patchEstimatedBudgetLines(res.result.budgetLines));
      })
  }

  onChangeEvent(index: number) {
    const arrayControl = this.estimatedBudgetForm.get('estimatedBudgetLines') as FormArray;
    const amount = (arrayControl.at(index).get('amount').value) !== null ? +arrayControl.at(index).get('amount').value : null;
    const calculationType = (arrayControl.at(index).get('calculationType').value) !== null ? +arrayControl.at(index).get('calculationType').value : null;
    const insertedValue = (arrayControl.at(index).get('value').value) !== null ? +arrayControl.at(index).get('value').value : null;

    //calculating estimated Value
    const estimatedValue = (calculationType === 0) ? ((amount * insertedValue / 100) + (amount)) : (amount + insertedValue)
    arrayControl.at(index).get('estimatedValue').setValue(estimatedValue);
  }

  public patchBudget(estimatedBudgetMaster: IEstimatedBudget) {
    this.estimatedBudgetForm.patchValue({
      budgetId: estimatedBudgetMaster.budgetId,
      estimatedBudgetName: estimatedBudgetMaster.estimatedBudgetName
    });
    this.estimatedBudgetForm.setControl('estimatedBudgetLines', this.patchEstimatedBudgetLines(estimatedBudgetMaster.estimatedBudgetLines));
  }

  private patchEstimatedBudgetLines(estimatedBudgetLines: IEstimatedBudgetLines[] | any): FormArray {
    const formArray = new FormArray([]);
    estimatedBudgetLines.forEach((line: IEstimatedBudgetLines | any) => {
      formArray.push(this.fb.group({
        accountId: [{ value: line.accountId, disabled: true }, [Validators.required]],
        amount: [{ value: line.incurredAmount, disabled: true }, [Validators.required]],
        calculationType: [line.calculationType, [Validators.required]],
        value: [line.value, [Validators.required, Validators.min(0)]],
        estimatedValue: [line.estimatedValue]
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.estimatedBudgetForm.get('estimatedBudgetLines').invalid) {
      this.estimatedBudgetForm.get('estimatedBudgetLines').markAllAsTouched();
    }
    const controls = this.estimatedBudgetForm.controls.estimatedBudgetLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please Select Anticipated Budget', 'Anticipated Budget')
      return;
    }

    if (this.estimatedBudgetForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Anticipated Budget")
      return;
    }

    this.isLoading = true
    this.mapFormValuesToEstimatedBudgetModel();

    if (this.estimatedBudgetModel.id) {
      this.estimatedBudgetService.updateEstimatedBudget(this.estimatedBudgetModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.toastService.success('Updated Successfully', 'Anticipated Budget')
          this.router.navigate(['/' + ESTIMATED_BUDGET.ID_BASED_ROUTE('details', this.estimatedBudgetModel.id)])
        }
        );
    } else {
      delete this.estimatedBudgetModel.id;
      this.estimatedBudgetService.createEstimatedBudget(this.estimatedBudgetModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res) => {
          this.toastService.success('Created Successfully', 'Anticipated Budget')
          this.router.navigate(['/' + ESTIMATED_BUDGET.ID_BASED_ROUTE('details', res.result.id)])
        }
        );
    }
  }

  //Mapping form values to Budget model
  mapFormValuesToEstimatedBudgetModel() {
    this.estimatedBudgetModel.budgetId = this.estimatedBudgetForm.value.budgetId;
    this.estimatedBudgetModel.estimatedBudgetName = this.estimatedBudgetForm.value.estimatedBudgetName;
    // using getRawValue here to get disabled field
    this.estimatedBudgetModel.estimatedBudgetLines = this.estimatedBudgetForm.getRawValue().estimatedBudgetLines;
  }
}
