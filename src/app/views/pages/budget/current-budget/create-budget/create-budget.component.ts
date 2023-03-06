import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { finalize, take} from 'rxjs/operators';
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

@Component({
  selector: 'kt-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})

export class CreateBudgetComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;
  // Declaring form variable
  budgetForm: FormGroup;

  //Title Name
  title: string = 'Create Estimated Budget'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  budgetModel: IBudget;
  totalAmount: number;
  budgetMaster: any;

  // For Table Columns
  displayedColumns = ['accountId', 'amount', 'action']

  // Getting Table by id
  @ViewChild('table', {static: false}) table: any;

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
  formErrors = {
    budgetName: '',
    from: '',
    to: '',
    campusId: ''
  };

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    public addNewButtonService: AddModalButtonService,
    private router: Router,
    private budgetService: BudgetService,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    public activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
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
    this.activatedRoute.params.subscribe((res: Params) => {
      if (res && res.id) {
        this.isLoading = true;
        this.title = 'Edit Estimated Budget'
        this.getBudgetMaster(res.id);
        this.cdRef.markForCheck();
      } else {
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
        this.router.navigate(['/' + BUDGET.ID_BASED_ROUTE('details' , this.budgetModel.id)])
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
          this.router.navigate(['/' + BUDGET.ID_BASED_ROUTE('details' , res.result.id)])
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

