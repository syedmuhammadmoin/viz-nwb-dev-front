import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { IPayrollTransaction} from '../model/IPayrollTransaction';
import { PayrollTransactionService} from '../service/payroll-transaction.service';
import { AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IPayrollItem} from '../../payroll-item/model/IPayrollItem';
import { finalize} from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { EmployeeService } from '../../employee/service/employee.service';
import { FirstDataRenderedEvent } from 'ag-grid-community';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';

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
  payrollItems = [] as IPayrollItem[]
  // app const for month
  months = AppConst.Months
  // for permissions
  permissions = Permissions
  // form title
  title = 'Create Payroll';
  // payroll transition
  payrollTransaction: IPayrollTransaction = {} as IPayrollTransaction
  // for form
  payrollTransactionForm: FormGroup
  // loader
  isLoading: boolean;
  //store working days
  workingDays : number = 0


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
      required: 'Working days is required',
      invalidRange: 'Should be greater than present days',
    },
    presentDays: {
      required: 'Present days is required',
      max: 'Should be lesser than working days'
    },
    leaveDays: {
      required: 'Leave days is required',
      max: 'Should be lesser than working days'
    },
    transDate: {
      required: 'Transaction date is required'
    },
    tax: {
      required: 'Tax is required'
    },
    accountPayableId: {
      required: 'Account is required'
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
    // From Route Params
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.title = 'Edit Payroll';
        this.getPayroll(params.id);
      }
    });
    // edit form
    if (this._id) {
      this.title = 'Edit Payroll';
      this.getPayroll(this._id);
    }
    // create form
    this.payrollTransactionForm = this.fb.group({
        transDate: ['', Validators.required],
        tax: [0, Validators.required],
        designation: [''],
        department: [''],
        basicPay: [''],
        increment: [''],
        employeeId: ['', Validators.required],
        month: ['', Validators.required],
        year: ['', Validators.required],
        workingDays: [0, Validators.required],
        presentDays: [0, [Validators.required, (control: AbstractControl) => Validators.max(this.workingDays)(control)]],
        leaveDays: [0, [Validators.required, (control: AbstractControl) => Validators.max(this.workingDays)(control)]],
        accountPayableId: ['', Validators.required]
      },
    );

    // this.payrollTransactionForm.get('workingDays').valueChanges.subscribe((value) => {
    //     this.workingDays = value
    //      this.payrollTransactionForm.get('presentDays').updateValueAndValidity()
    //      this.payrollTransactionForm.get('leaveDays').updateValueAndValidity()
    // })
    // console.log(this.workingDays)
    this.ngxsService.getEmployeeFromState();
    //this.ngxsService.getPayableAccountsFromState();
  }

  //check present and leave days lesser than working days or not
  onChange(value) {
    this.workingDays = value
    this.payrollTransactionForm.get('presentDays').updateValueAndValidity()
    this.payrollTransactionForm.get('leaveDays').updateValueAndValidity()
  }

// submit method called on submit button
  onSubmit() {
    // if (this.payrollTransactionForm.invalid) {
    //   console.log("return")
    //   return;
    // }
    if (this.payrollTransactionForm.value.workingDays <
      (Number(this.payrollTransactionForm.value.presentDays) + Number(this.payrollTransactionForm.value.leaveDays))) {
      this.toastService.error('Present day and leave days sum must be less than working days', 'Error');
      return;
    }
    // this.isLoading = true;
    // this.payrollTransaction = {
    //   ...this.payrollTransactionForm.value,
    //   transDate: this.dateHelperService.transformDate(this.payrollTransactionForm.value.transDate, 'MM/d/y'),
    //   id: this.payrollTransaction.id,
    //   isSubmit: this.payrollTransaction.isSubmit
    // } as IPayrollTransaction

    this.mapPayrollTransactionValuesToPayrollModel()

    console.log(this.payrollTransaction)
    // if (this.payrollTransaction.id) {
    //   console.log('update: ', this.payrollTransaction);
    //   this.payrollTransactionService.updatePayrollTransaction(this.payrollTransaction)
    //     .pipe(
    //       finalize(() => this.isLoading = false))
    //     .subscribe(
    //       (res) => {
    //         this.toastService.success(res?.message, 'Updated Successfully')

    //         if (!this._id) {
    //           this.router.navigate([`/payroll/transaction/detail/${res?.result}`])
    //         } else {
    //           this.dialogRef.close();
    //         }
    //       },
    //       (err) => {
    //         // this.toastService.error(err?.error?.message)
    //         this.isLoading = false;
    //         this.cdRef.detectChanges();
    //       })
    // } else {
    //   console.log('create', this.payrollTransaction);
    //   this.payrollTransactionService.createPayrollTransaction(this.payrollTransaction)
    //     .pipe(
    //       finalize(() => this.isLoading = false))
    //     .subscribe(
    //       (res) => {
    //         this.toastService.success(res?.message, 'Created Successfully');
    //         if (!this._id) {
    //           this.router.navigate([`/payroll/transaction/detail/${res?.result}`])
    //         } else {
    //           this.dialogRef.close();
    //         }
    //       },
    //       (err) => {
    //         this.isLoading = false;
    //         // this.toastService.error(err?.error?.message, 'Error!')
    //         this.cdRef.detectChanges();
    //       }
    //     )
    // }
  }

  mapPayrollTransactionValuesToPayrollModel() {
    this.payrollTransaction.month = this.payrollTransactionForm.value.month
    this.payrollTransaction.year = this.payrollTransactionForm.value.year
    this.payrollTransaction.employeeId = this.payrollTransactionForm.value.employeeId
    this.payrollTransaction.workingDays = this.payrollTransactionForm.value.workingDays
    this.payrollTransaction.presentDays = this.payrollTransactionForm.value.presentDays
    this.payrollTransaction.leaveDays = this.payrollTransactionForm.value.leaveDays
    this.payrollTransaction.transDate = this.dateHelperService.transformDate(this.payrollTransactionForm.value.transDate, 'MM/d/y')
    this.payrollTransaction.isSubmit = this.payrollTransaction.isSubmit
    this.payrollTransaction.tax = 0
    this.payrollTransaction.accountPayableId = this.payrollTransactionForm.value.accountPayableId
  }

  //for save or submit
  isSubmit(val: number) {
    this.payrollTransaction.isSubmit = (val === 0) ? false : true;
  }

  // reset payroll transition form
  reset() {
    this.payrollTransactionForm.reset();
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
      tax: payrollTransaction.tax,
      accountPayableId: payrollTransaction.accountPayableId
    })
    this.getEmployee(payrollTransaction.employeeId)
  }

  checkSelected(employee) {
    this.payrollTransactionForm.patchValue({
      designation: employee.designationName,
      department: employee.departmentName,
      basicPay: employee.basicPay,
      increment: employee.increment,
    })
    this.payrollItems = employee.employeeLines;
    this.calculateSalary(employee);
    this.cdRef.detectChanges();
  }

// for salary calculation
  calculateSalary(employee: any) {
    // const employee = this.employees.find(x => x.id === employeeId);
    console.log('calculating...: ', employee)
    const workingDays = this.payrollTransactionForm.value.workingDays || 1
    const presentDays = this.payrollTransactionForm.value.presentDays || 1
    const tax = this.payrollTransactionForm.value.tax || 0
    this.basicSalary = Number(employee.totalBasicPay);
    this.grossSalary = Number(employee.grossPay);
    this.netSalaryBeforeTax = ((+employee.netPay / +workingDays) * +presentDays);
    this.netSalary = Number(this.netSalaryBeforeTax) - Number(tax)
    // console.log(
    //   `basic: ${this.basicSalary},
    //    gross: ${this.grossSalary},
    //     netBT: ${this.netSalaryBeforeTax},
    //      net: ${this.netSalary}`)
    this.cdRef.detectChanges();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  // getting employee data by id
  getEmployee(id: number) {
    console.log("called")
    this.employeeService.getEmployeeById(id).subscribe((res) => {
      this.employee = res.result
      this.checkSelected(this.employee)
    })
  }

// getting payroll by id
  private getPayroll(id: any) {
    this.isLoading = true;
    this.payrollTransactionService.getPayrollTransactionById(id).subscribe((res) => {
      console.log('payroll model: ', res);
      this.payrollTransaction = res.result;
      this.patchPayroll(this.payrollTransaction);
      this.isLoading = false;
      this.cdRef.detectChanges()
    });
  }

  // getting month
  getMonth(val) {
    if (this.payrollTransactionForm.value.year != '') {
      const numberOfDays = this.getNumberOfDays(val.value, this.payrollTransactionForm.value.year);
      this.onChange(numberOfDays)
      this.payrollTransactionForm.patchValue({
        workingDays: numberOfDays
      })
    }
  }

  // getting year
  getYear(val) {
    if (this.payrollTransactionForm.value.month != '') {
      const numberOfDays = this.getNumberOfDays(this.payrollTransactionForm.value.month, val.value);
      this.onChange(numberOfDays)
      this.payrollTransactionForm.patchValue({
        workingDays: numberOfDays
      })
    }
  }

  // getting number of days
  getNumberOfDays(month, year): number {
    return new Date(year, month, 0).getDate();
  };
}





