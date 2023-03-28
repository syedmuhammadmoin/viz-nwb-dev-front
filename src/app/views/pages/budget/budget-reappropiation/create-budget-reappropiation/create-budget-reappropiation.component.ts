import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { BUDGET_REAPPROPIATION } from 'src/app/views/shared/AppRoutes';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { IBudgetLines } from '../model/IbudgetLines';
import { IBudget } from '../model/Ibudget';
import { BudgetReappropriationService } from '../service/budget-reappropriation.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-create-budget-Reappropriation',
  templateUrl: './create-budget-Reappropiation.component.html',
  styleUrls: ['./create-budget-Reappropiation.component.scss']
})
export class CreateBudgetReappropiationComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;

  showLines: boolean = false;
  // Declaring form variable
  budgetReappropriationForm: FormGroup;

  //Title Name
  title: string = 'Create Budget Reappropriation'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  budgetReapprpriationModel: IBudget = {} as IBudget;
  BudgetReapproMaster: IBudget;

  totalAmount: number;
  budgetMaster: any;

  // For Table Columns
  displayedColumns = ['level4Id', 'campusId', 'description', 'additionAmount', 'deletionAmount', 'action']

  // Getting Table by id
  @ViewChild('table', { static: false }) table: any;

  // Validation messages..
  validationMessages = {
    budgetId: {
      required: 'Budget Name is required.',
    },
    budgetReappropriationDate: {
      required: 'Date is required.',
    }
  };

  //Keys for validation messages
  formErrors = {
    budgetId: '',
    budgetReappropriationDate: ''
  };

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private budgetReappropriation: BudgetReappropriationService,
    public ngxsService: NgxsCustomService,
    public addNewButtonService: AddModalButtonService,
    public activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.budgetReappropriationForm = this.fb.group({
      budgetId: ['', [Validators.required]],
      budgetReappropriationDate: ['', [Validators.required]],
      budgetReappropriationLines: this.fb.array([
        this.addBudgetLines()
      ])
    })
    this.activatedRoute.params.subscribe((res: Params) => {
      if (res && res.id) {
        console.log(res.id)
        this.isLoading = true;
        this.title = 'Edit Budget Reappropriation'
        this.getBudgetReapproMaster(res.id);
        this.showLines = true;
        this.cdRef.markForCheck();
      }
    })

    //Get Data From Store
    this.ngxsService.getBudgetAccountsFromState()
    this.ngxsService.getCampusFromState();
    this.ngxsService.getBudgetsFromState();
  }



  public getBudgetReapproMaster(id: any) {
    this.budgetReappropriation.getBudgetReapproById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IBudget>) => {
        // for mapping, getting values from BudgetReapproMaster because of fields disablility
        this.BudgetReapproMaster = res.result;
        this.patchBudget(this.BudgetReapproMaster);
        this.budgetReapprpriationModel = res.result;
      });
  }

  onItemSelected(budgetId: number) {
    this.isLoading = true;
    this.budgetReappropriation.getBudgetReapproById(budgetId)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.showLines = true;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.budgetReappropriationForm.setControl('budgetReappropriationLines', this.patchEstimatedBudgetLines(res.result.budgetReappropriationLines));
      })
  }

  public patchBudget(BudgetReapproMaster: IBudget) {
    this.budgetReappropriationForm.patchValue({
      budgetId: BudgetReapproMaster.budgetId,
      budgetReappropriationDate: BudgetReapproMaster.budgetReappropriationDate
    });
    this.budgetReappropriationForm.setControl('budgetReappropriationLines', this.patchEstimatedBudgetLines(BudgetReapproMaster.budgetReappropriationLines));
  }

  private patchEstimatedBudgetLines(budgetReappropriationLines: IBudgetLines[] | any): FormArray {
    const formArray = new FormArray([]);
    budgetReappropriationLines.forEach((line: IBudgetLines | any) => {
      formArray.push(this.fb.group({
        level4Id: [line.level4Id, [Validators.required]],
        // campusId: [{value: line.campus , disabled: true}, [Validators.required]],
        campusId: [line.campusId, [Validators.required]],
        description: [line.description, [Validators.required]],
        additionAmount: [line.additionAmount, [Validators.required, Validators.min(0)]],
        deletionAmount: [line.deletionAmount, [Validators.required, Validators.min(0)]]
      }))
    })
    return formArray
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    // this.budgetReappropriationForm.reset();
    this.table.renderRows();
  }

  // Add Budget Lines
  addBudgetLines(): FormGroup {
    return this.fb.group({
      level4Id: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      additionAmount: ['', [Validators.required, Validators.min(0)]],
      deletionAmount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  //Add Budget Lines
  addBudgetLineClick(): void {
    const controls = this.budgetReappropriationForm.controls.budgetReappropriationLines as FormArray;
    controls.push(this.addBudgetLines());
    this.table.renderRows();
    this.cdRef.detectChanges()
  }

  //Remove Budget Line
  removeBudgetLineClick(budgetLineIndex: number): void {
    const budgetLineArray = this.budgetReappropriationForm.get('budgetReappropriationLines') as FormArray;
    budgetLineArray.removeAt(budgetLineIndex);
    budgetLineArray.markAsDirty();
    budgetLineArray.markAsTouched();
    this.table.renderRows();
    this.cdRef.detectChanges();
  }

  //Mapping form values to Budget Model
  mapFormValuesToBudgetReapproModel() {
    this.budgetReapprpriationModel.budgetId = this.budgetReappropriationForm.value.budgetId;
    this.budgetReapprpriationModel.budgetReappropriationDate = this.transformDate(this.budgetReappropriationForm.value.budgetReappropriationDate, 'yyyy-MM-dd');
    this.budgetReapprpriationModel.budgetReappropriationLines = this.budgetReappropriationForm.value.budgetReappropriationLines;
  }


  onSubmit(): void {

    if (this.budgetReappropriationForm.get('budgetReappropriationLines').invalid) {
      this.budgetReappropriationForm.get('budgetReappropriationLines').markAllAsTouched();
    }

    const controls = this.budgetReappropriationForm.controls.budgetReappropriationLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add Budget Reapprpiation lines', 'Budget Reapprpiation')
      return;
    }

    if (this.budgetReappropriationForm.invalid) {
      return;
    }

    this.mapFormValuesToBudgetReapproModel();
    this.isLoading = true

    if (this.budgetReapprpriationModel.id) {
      this.budgetReappropriation.updateBudgetReappropriation(this.budgetReapprpriationModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.toastService.success('Updated Successfully', 'Budget Reappropriation')
          this.router.navigate(['/' + BUDGET_REAPPROPIATION.ID_BASED_ROUTE('details', this.budgetReapprpriationModel.id)])
        }
        );
    } else {
      delete this.budgetReapprpriationModel.id;
      this.budgetReappropriation.createBudgetReappropriation(this.budgetReapprpriationModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res) => {
          this.toastService.success('Created Successfully', 'Budget Reappropriation')
          this.router.navigate(['/' + BUDGET_REAPPROPIATION.ID_BASED_ROUTE('details', res.result.id)])
        });

    }


  }

}
