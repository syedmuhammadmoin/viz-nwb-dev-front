import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BUDGET } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { IBudget } from '../model/IBudget';
import { IBudgetLines } from '../model/IBudgetLines';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { BudgetService } from '../service/budget.service';
import { BudgetState } from '../store/budget.state';
import { EstimatedBudgetService } from '../../estimated-budget/service/estimated-budget.service';
import { IEstimatedBudget } from '../../estimated-budget/model/IEstimatedBudget';
import { IEstimatedBudgetLines } from '../../estimated-budget/model/IEstimatedBudgetLines';

@Component({
  selector: 'kt-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})

export class CreateBudgetComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;
  // Declaring form variable
  budgetForm: FormGroup;



  //param to get from EstimatedBudget
  isFromEstimatedBudget: boolean;
  isBudget: boolean;
  //Title Name
  title: string = 'Create Estimated Budget'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  budgetModel: IBudget;
  estimatedBudgetModel: IEstimatedBudget = {} as IEstimatedBudget;

  totalAmount: number;
  budgetMaster: any;

  // For Table Columns
  displayedColumns = ['accountId', 'amount', 'action']

  // Getting Table by id
  @ViewChild('table', { static: false }) table: any;

  // Validation messages..
  validationMessages = {
    budgetName: {
      required: 'Name is required.',
    },
    from: {
      required: 'Date is required.',
    },
    to: {
      required: 'Date is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
  };

  //Keys for validation messages
  formErrors: any = {
    budgetName: '',
    from: '',
    to: '',
    campusId: ''
  };

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    public addNewButtonService: AddModalButtonService,
    private budgetService: BudgetService,
    private estimatedBudgetService: EstimatedBudgetService,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    public activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
  }
  //for save or submit
  isSubmit(val: number) {
    this.budgetModel.isSubmit = (val === 0) ? false : true;
  }

  ngOnInit(): void {
    this.budgetForm = this.fb.group({
      budgetName: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      budgetLines: this.fb.array([
        this.addBudgetLines()
      ])
    });
    this.activatedRoute.queryParams.subscribe((res: Params) => {
      const id = res.q;
      const isBudget = res.isBudget;
      const isFromEstimatedBudget = res.isFromEstimatedBudget;
      if (res && id && isBudget) {
        this.isLoading = true;
        this.title = 'Edit Budget'
        this.getBudgetMaster(id);
        this.cdRef.markForCheck();
      } else if (id && isFromEstimatedBudget) {
        this.isLoading = true;
        this.getEstimatedBudgetMaster(id);
      }
      else {
        this.budgetModel = ({} as IBudget)
      }
    })

    //Get Data From Store
    this.ngxsService.getAccountLevel4FromState()
    this.ngxsService.getBudgetAccountsFromState()
    this.ngxsService.getCampusFromState();
  }

  public getBudgetMaster(id: any) {
    this.budgetService.getBudgetById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IBudgetResponse>) => {
        // for mapping, getting values from budgetMaster because of fields disablility
        this.budgetMaster = res.result;
        this.patchBudget(this.budgetMaster);
        this.budgetModel = res.result;
        this.totalAmountCalculation()
      });
  }

  private MapIEstimatedBudgetToIBudget(source: IEstimatedBudget): IBudget {

    const  target: IBudget = {} as IBudget;
    target.budgetName = source.estimatedBudgetName;
    target.campusId = source.campusId
    target.from = source.from;
    target.to = source.to;
    target.budgetLines = source.estimatedBudgetLines;
    return target;

  }
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
        // for mapping, getting values from budgetMaster because of fields disablility
        this.budgetMaster = res.result;
        this.patchBudgetfromEstimatedBudget(this.budgetMaster);
        this.estimatedBudgetModel = res.result;
        this.budgetModel = this.MapIEstimatedBudgetToIBudget(res.result);
        this.totalAmountCalculation()
      });
  }

  public patchBudget(budgetMaster: IBudgetResponse) {
    this.budgetForm.patchValue({
      budgetName: budgetMaster.budgetName,
      from: budgetMaster.from,
      to: budgetMaster.to,
      campusId: budgetMaster.campusId
    });
    this.budgetForm.setControl('budgetLines', this.patchBudgetLines(budgetMaster.budgetLines));
  }

  private patchBudgetLines(budgetLines: IBudgetLines[]): FormArray {
    const formArray = new FormArray([]);
    budgetLines.forEach((line: IBudgetLines) => {
      formArray.push(this.fb.group({
        accountId: [line.accountId, [Validators.required]],
        amount: [line.amount, [Validators.required, Validators.min(0)]],
      }))
    })
    return formArray
  }
  public patchBudgetfromEstimatedBudget(estimatedBudgetMaster: IEstimatedBudget) {
    this.budgetForm.patchValue({
      budgetName: estimatedBudgetMaster.estimatedBudgetName,
      from: estimatedBudgetMaster.from,
      to: estimatedBudgetMaster.to,
      campusId: estimatedBudgetMaster.campusId
    });
    this.budgetForm.setControl('budgetLines', this.patchBudgetLinesfromEstimatedBudget(estimatedBudgetMaster.estimatedBudgetLines));
  }

  private patchBudgetLinesfromEstimatedBudget(budgetLines: IEstimatedBudgetLines[]): FormArray {
    const formArray = new FormArray([]);
    budgetLines.forEach((line: IEstimatedBudgetLines) => {
      formArray.push(this.fb.group({
        accountId: [line.accountId, [Validators.required]],
        amount: [line.amount, [Validators.required, Validators.min(0)]],
      }))
    })
    return formArray
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.table.renderRows();
  }

  addBudgetLineClick(): void {
    const controls = this.budgetForm.controls.budgetLines as FormArray;
    controls.push(this.addBudgetLines());
    this.table.renderRows();
    this.cdRef.detectChanges()
  }

  addBudgetLines(): FormGroup {
    return this.fb.group({
      accountId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  removeBudgetLineClick(budgetLineIndex: number): void {
    const budgetArray = this.budgetForm.get('budgetLines') as FormArray;
    budgetArray.removeAt(budgetLineIndex);
    budgetArray.markAsDirty();
    budgetArray.markAsTouched();
    this.table.renderRows();
    this.totalAmountCalculation()
    this.cdRef.detectChanges()
  }

  totalAmountCalculation() {
    this.totalAmount = 0;
    const controls = this.budgetForm.controls.budgetLines as FormArray;
    for (let index = 0; index < controls.length; index++) {
      this.totalAmount += Number(controls.at(index).get('amount').value);
    }
  }


  onSubmit(): void {
    if (this.budgetForm.get('budgetLines').invalid) {
      this.budgetForm.get('budgetLines').markAllAsTouched();
    }
    const controls = this.budgetForm.controls.budgetLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add Estimated Budget lines', 'Estimated Budget')
      return;
    }

    if (this.budgetForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Estimated Budget")
      return;
    }

    this.isLoading = true
    this.mapFormValuesToBudgetModel();

    if (this.budgetModel.id) {
      this.budgetService.updateBudget(this.budgetModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired(BudgetState, true));
          this.toastService.success('Updated Successfully', 'Estimated Budget')
          this.router.navigate(['/' + BUDGET.ID_BASED_ROUTE('details', this.budgetModel.id)])
        });
    } else {
      delete this.budgetModel.id;
      this.budgetService.createBudget(this.budgetModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res) => {
          this.ngxsService.store.dispatch(new IsReloadRequired(BudgetState, true));
          this.toastService.success('Created Successfully', 'Estimated Budget')
          this.router.navigate(['/' + BUDGET.ID_BASED_ROUTE('details', res.result.id)])
        });
    }
  }

  //Mapping form values to BudgetReappropriation Model
  mapFormValuesToBudgetModel() {
    this.budgetModel.budgetName = this.budgetForm.value.budgetName;
    this.budgetModel.from = this.transformDate(this.budgetForm.value.from, 'yyyy-MM-dd');
    this.budgetModel.to = this.transformDate(this.budgetForm.value.to, 'yyyy-MM-dd');
    this.budgetModel.campusId = this.budgetForm.value.campusId;
    this.budgetModel.budgetLines = this.budgetForm.value.budgetLines;
  }
}
