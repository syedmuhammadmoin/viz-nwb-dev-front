import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { IPayrollTransaction} from '../model/IPayrollTransaction';
import { PayrollTransactionService} from '../service/payroll-transaction.service';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { IPayrollItem} from '../../payroll-item/model/IPayrollItem';
import { finalize, take} from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { EmployeeService } from '../../employee/service/employee.service';
import { FirstDataRenderedEvent } from 'ag-grid-community';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { PAYROLL_TRANSACTION } from 'src/app/views/shared/AppRoutes';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { EmployeeState } from '../../employee/store/employee.state';

@Component({
  selector: 'kt-create-payroll-transaction',
  templateUrl: './create-payroll-transaction.component.html',
  styleUrls: ['./create-payroll-transaction.component.scss']
})

export class CreatePayrollTransactionComponent extends AppComponentBase implements OnInit {

  // for bisic salary
  basicSalary: number;
  // for gross salary
  grossSalary: number;
  // net before tax
  netSalaryBeforeTax: number;
  // for totel salary
  netSalary: number;
  // for getting employee
  employee = {} as any;
  // for getting payroll item
  payrollItems : any = []
  // app const for month
  months = AppConst.Months
  // for permissions
  permissions = Permissions
  // form title
  title = 'Create Payroll';
  // payroll transition
  payrollTransaction: IPayrollTransaction = {} as IPayrollTransaction
  // for form
  payrollTransactionForm: FormGroup;

  //id
  payrollId: number;
  // loader
  isLoading: boolean;
  //store working days
  workingDays : number = 0

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;


  // Validation messages..
  validationMessages = {
    employeeId: {
      required: 'Employee is required.',
    },
    month: {
      required: 'Month is required.',
    },
    year: {
      required: 'Year is required.',
    },
    workingDays: {
      required: 'Working days is required.',
      invalidRange: 'Should be greater than present days.',
    },
    presentDays: {
      required: 'Present days is required.',
    },
    leaveDays: {
      required: 'Leave days is required.',
    },
    transDate: {
      required: 'Transaction date is required.'
    },
    tax: {
      required: 'Tax is required.'
    },
    accountPayableId: {
      required: 'Account is required.'
    }
  };

  // error keys..
  formErrors = {
    employeeId: '',
    month: '',
    year: '',
    workingDays: '',
    presentDays: '',
    leaveDays: '',
    transDate: '',
    tax: '',
    accountPayableId: ''
  };

// constructor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private payrollTransactionService: PayrollTransactionService,
    private employeeService: EmployeeService,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    @Optional() public dialogRef: MatDialogRef<CreatePayrollTransactionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public _id: number,
    injector: Injector,
  ) {
    super(injector)
  }

  columnDef = [
    {headerName: 'Payroll Item', field: 'payrollItem'},
    {headerName: 'Account', field: 'account'},
    {
      headerName: 'Amount', field: 'amount', valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    }
  ]

  ngOnInit() {
    // create form
    this.payrollTransactionForm = this.fb.group({
        transDate: ['', Validators.required],
        designation: [''],
        department: [''],
        basicPay: [''],
        //increment: [''],
        employeeId: ['', Validators.required],
        month: ['', Validators.required],
        year: ['', Validators.required],
        workingDays: [0, Validators.required],
        presentDays: [0, [Validators.required]],
        leaveDays: [0, [Validators.required]],
        accountPayableId: ['', Validators.required]
      },
    );

    // From Route Params
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.isLoading = true;
        this.payrollId = params.id;
        this.title = 'Edit Payroll';
        this.getPayroll(params.id);
      }
    });
    //edit payroll form by create payroll process form
    if (this._id) {
      this.isLoading = true;
      this.payrollId = this._id;
      this.title = 'Edit Payroll';
      this.getPayroll(this._id);
    }

    this.getLatestEmployeeData();

    //Get Data from Store
    this.ngxsService.getEmployeeFromState();
    this.ngxsService.getAccountPayableFromState();

    //to show message for information
    this.toastService.info('Only Account Payable field is editable.', 'Payroll')
  }

// patch paroll transition
  patchPayroll(payrollTransaction) {
    this.payrollTransactionForm.patchValue({
      employeeId: payrollTransaction.employeeId,
      month: payrollTransaction.month,
      year: payrollTransaction.year,
      workingDays: payrollTransaction.workingDays,
      presentDays: payrollTransaction.presentDays,
      leaveDays: payrollTransaction.leaveDays,
      transDate: payrollTransaction.transDate,
      accountPayableId: payrollTransaction.accountPayableId
    })

    this.checkSelected(payrollTransaction)

    this.disableFields(this.payrollTransactionForm , 
      "employeeId", "month", "year", "workingDays", "presentDays",
       "leaveDays", "transDate", "designation" ,"department" ,"basicPay")
  }

  checkSelected(employee) {
    this.payrollTransactionForm.patchValue({
      designation: employee.designation,
      department: employee.department,
      basicPay: employee.basicSalary,
    })
    this.payrollItems = employee?.payrollTransactionLines;
    this.calculateSalary(employee);
    this.cdRef.detectChanges();
  }

// for salary calculation
  calculateSalary(employee: any) {
    const workingDays = this.payrollTransactionForm.value.workingDays || 1
    const presentDays = this.payrollTransactionForm.value.presentDays || 1
    const tax = this.payrollTransactionForm.value.tax || 0
    this.basicSalary = Number(employee.totalBasicPay);
    this.grossSalary = Number(employee.grossPay);
    this.netSalaryBeforeTax = ((+employee.netPay / +workingDays) * +presentDays);
    this.netSalary = Number(this.netSalaryBeforeTax) - Number(tax)
    this.cdRef.detectChanges();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

// getting payroll by id
  private getPayroll(id: any) {
    this.payrollTransactionService.getPayrollTransactionById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.patchPayroll(res.result);
      this.cdRef.detectChanges()
    });
  }

  // submit method called on submit button
  onSubmit() {
  
    if (this.payrollTransactionForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapPayrollTransactionValuesToPayrollModel()
    if (this.payrollId) {
      this.payrollTransactionService.updatePayrollTransaction(this.payrollTransaction)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res) => {
            this.toastService.success('Submitted Successfully', "Payroll")

            if (!this._id) {
              this.router.navigate(['/' + PAYROLL_TRANSACTION.ID_BASED_ROUTE('details' , this.payrollTransaction.id)])
            } else {
              this.dialogRef.close();
            }
          })
    } 
  }

  mapPayrollTransactionValuesToPayrollModel() {
    this.payrollTransaction.id = this.payrollId;
    this.payrollTransaction.month = this.payrollTransactionForm.getRawValue().month;
    this.payrollTransaction.year = this.payrollTransactionForm.getRawValue().year;
    this.payrollTransaction.employeeId = this.payrollTransactionForm.getRawValue().employeeId;
    this.payrollTransaction.workingDays = this.payrollTransactionForm.getRawValue().workingDays;
    this.payrollTransaction.presentDays = this.payrollTransactionForm.getRawValue().presentDays;
    this.payrollTransaction.leaveDays = this.payrollTransactionForm.getRawValue().leaveDays;
    this.payrollTransaction.transDate = this.dateHelperService.transformDate(this.payrollTransactionForm.getRawValue().transDate, 'yyyy-MM-dd');
    this.payrollTransaction.isSubmit = this.payrollTransaction.isSubmit;
    this.payrollTransaction.accountPayableId = this.payrollTransactionForm.value.accountPayableId;
  }

  //for save or submit
  isSubmit(val: number) {
    this.payrollTransaction.isSubmit = (val === 0) ? false : true;
  }

  // reset payroll transition form
  reset() {
    this.formDirective.resetForm();
    this.payrollItems = []
  }

  // getting month
  getMonth(val) {
    if (this.payrollTransactionForm.value.year != '') {
      const numberOfDays = this.getNumberOfDays(val.value, this.payrollTransactionForm.value.year);
      this.payrollTransactionForm.patchValue({
        workingDays: numberOfDays
      })
    }
  }

  // getting year
  getYear(val) {
    if (this.payrollTransactionForm.value.month != '') {
      const numberOfDays = this.getNumberOfDays(this.payrollTransactionForm.value.month, val.value);
      this.payrollTransactionForm.patchValue({
        workingDays: numberOfDays
      })
    }
  }

  // getting number of days
  getNumberOfDays(month, year): number {
    return new Date(year, month, 0).getDate();
  };

  getLatestEmployeeData() {
    this.ngxsService.store.dispatch(new IsReloadRequired(EmployeeState , true))
  }
}





