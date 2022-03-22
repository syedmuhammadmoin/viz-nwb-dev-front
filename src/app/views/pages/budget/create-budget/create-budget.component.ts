import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';

import { finalize, take} from 'rxjs/operators';

import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { IBudget } from '../model/IBudget';
import { BudgetService } from '../service/budget.service';

@Component({
  selector: 'kt-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})

export class CreateBudgetComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;
  // Declaring form variable
  budgetForm: FormGroup;

  // Limit Date
  maxDate = new Date();
  dateCondition: boolean;

  //Title Name
  titleName: string = 'Create Budget'

  // For Table Columns
  displayedColumns = ['accountId', 'amount', 'action']
  // Getting Table by id
  @ViewChild('table', {static: false}) table: any;
  // Validation messages..
  validationMessages = {
    budgetName: {
      required: 'Budget is required.',
    },
    from: {
      required: 'Date is required.',
    },
    to: {
      required: 'Date is required.',
    },
  };
  // error keys..
  formErrors = {
    budgetName: '',
    from: '',
    to: '',
  };
  budgetModel: IBudget;
  totalAmount: number;
  budgetMaster: any;

  // constructor
  constructor(
    private fb: FormBuilder,
    public addNewButtonService: AddModalButtonService,
    private router: Router,
    private budgetService: BudgetService,
    private cdr: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {
    // this.addNewButtonService.getCampusTypes();
    // creating form
    this.budgetForm = this.fb.group({
      budgetName: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      budgetLines: this.fb.array([
        this.addBudgetLines()
      ])
    });
    this.activatedRoute.params.subscribe((res) => {
      if (res && res.id) {
        console.log('called by id', res)
        this.isLoading = true;
        this.titleName = 'Edit Budget'
        this.getBudgetMaster(res.id);
        this.cdr.markForCheck();
      } else {

        this.budgetModel = ({} as IBudget)
      }
    })
    // this.getBudgetAccountsFromState();
    // this.budgetForm.get('from').valueChanges.subscribe((value) => {
    //   this.dateCondition = this.budgetForm.get('to').value < this.budgetForm.get('from').value
    //   // this.invoiceForm.get('dueDate').enable()
    // })
  }

  public getBudgetMaster(id: any) {
     this.budgetService.getBudgetById(id).subscribe((res) => {
      // for mapping, getting values from budgetMaster because of fields disablility
      this.budgetMaster = res.result;
      this.patchBudget(this.budgetMaster);
      this.budgetModel = res.result;
      console.log('budget master', this.budgetModel);
      this.totalAmountCalculation()
      this.isLoading = false;
    });
  }

  public patchBudget(budgetMaster: any) {
    this.budgetForm.patchValue({
      budgetName: budgetMaster.budgetName,
      from: budgetMaster.from,
      to: budgetMaster.to,
    });
    this.budgetForm.setControl('budgetLines', this.patchBudgetLines(budgetMaster.budgetLines));
  }

  // Form Reset
  reset() {
    const budgetLineArray = this.budgetForm.get('budgetLines') as FormArray;
    budgetLineArray.clear();
    this.table.renderRows();
  }

  // to add bill line
  addBudgetLineClick(): void {
    const controls = this.budgetForm.controls.budgetLines as FormArray;
    controls.push(this.addBudgetLines());
    this.table.renderRows();
    this.cdr.detectChanges()
  }

  addBudgetLines(): FormGroup {
    return this.fb.group({
      accountId: ['', [Validators.required]],
      amount: ['', [Validators.required,]],
    });
  }

  // to remove budget line
  removeBudgetLineClick(budgetLineIndex: number): void {
    const budgetArray = this.budgetForm.get('budgetLines') as FormArray;
    budgetArray.removeAt(budgetLineIndex);
    budgetArray.markAsDirty();
    budgetArray.markAsTouched();
    this.table.renderRows();
    this.totalAmountCalculation()
    this.cdr.detectChanges()
  }

  // total amount calculation
  totalAmountCalculation() {
    this.totalAmount = 0;
    const controls = this.budgetForm.controls.budgetLines as FormArray;
    for (let index = 0; index < controls.length; index++) {
      this.totalAmount += Number(controls.at(index).get('amount').value);
    }
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.budgetForm.get('budgetLines').invalid) {
      this.budgetForm.get('budgetLines').markAllAsTouched();
    }
    const controls = this.budgetForm.controls.budgetLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add Budget lines', 'Error')
      return;
    }
    if (this.budgetForm.invalid) {
      return;
    }
    console.log('form', this.budgetForm)
    this.mapFormValuesToBudgetModel();
    console.log(this.budgetModel)
    this.isLoading = true
    if (this.budgetModel.id) {
      console.log('entered here', this.budgetModel.id)
      this.budgetService.updateBudget(this.budgetModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false)).subscribe((res) => {
          this.toastService.success('Updated Successfully', 'Budget')
          this.router.navigate(['budget/detail/' + this.budgetModel.id])
        },
        (err) => {
          //this.toastService.error('Something went wrong, please try again later.', 'Error Updating')
          console.log(err)
        }
      );
    } else {

      delete this.budgetModel.id;
      this.budgetService.createBudget(this.budgetModel).pipe(
        take(1),
        finalize(() => this.isLoading = false)).subscribe(
        () => {
          this.toastService.success('Created Successfully', 'Budget')
          this.router.navigate(['budget/list'])
        },
        (err: any) => {
          //this.toastService.error('Something went wrong, please try again later.', 'Error Creating')
          console.log(err)
        }
      );
    }
  }

  // Mapping form value to budget model
  mapFormValuesToBudgetModel() {
    this.budgetModel.budgetName = this.budgetForm.value.budgetName;
    this.budgetModel.from = this.dateHelperService.transformDate(this.budgetForm.value.from, 'yyyy-MM-dd');
    this.budgetModel.to = this.dateHelperService.transformDate(this.budgetForm.value.to, 'yyyy-MM-dd');
    console.log(this.budgetModel);
    this.budgetModel.budgetLines = this.budgetForm.value.budgetLines;
  }

  private patchBudgetLines(budgetLines: any): FormArray {
    const formArray = new FormArray([]);
    budgetLines.forEach((line: any) => {
      formArray.push(this.fb.group({
        accountId: [line.accountId, [Validators.required]],
        amount: [line.amount, [Validators.required,]],
      }))
    })
    return formArray
  }
}

