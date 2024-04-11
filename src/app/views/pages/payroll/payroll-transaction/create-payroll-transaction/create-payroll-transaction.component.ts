import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPayrollTransaction } from '../model/IPayrollTransaction';
import { PayrollTransactionService } from '../service/payroll-transaction.service';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { FirstDataRenderedEvent } from 'ag-grid-community';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { PAYROLL_TRANSACTION } from 'src/app/views/shared/AppRoutes';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { EmployeeState } from '../../employee/store/employee.state';
import { IPayrollTransactionLines } from '../model/IPayrollTransactionLines';

@Component({
  selector: 'kt-create-payroll-transaction',
  templateUrl: './create-payroll-transaction.component.html',
  styleUrls: ['./create-payroll-transaction.component.scss']
})

export class CreatePayrollTransactionComponent extends AppComponentBase implements OnInit {


  // For Table Columns
  displayedColumns = ['accountId', 'payrollItemId', 'payrollType', 'amount', 'action']
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
  payrollItems: any = []
  // app const imports

  months = AppConst.Months
  religion = AppConst.Religion
  payrollTypes: any;


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
  workingDays: number = 0

  payrollFilteredItems: any;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  //show toast mesasge of on campus select
  showMessage: boolean = false;


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

  };

  // error keys..
  formErrors: any = {
    employeeId: '',
    month: '',
    year: '',
    workingDays: '',
    presentDays: '',
    leaveDays: '',
    transDate: '',
    tax: '',
  };

  // constructor
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private payrollTransactionService: PayrollTransactionService,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    @Optional() public dialogRef: MatDialogRef<CreatePayrollTransactionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public _id: number,
    injector: Injector,
  ) {
    super(injector)
  }

  columnDef = [
    { headerName: 'Payroll Item', field: 'payrollItem' },
    { headerName: 'Account', field: 'account' },
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
      basicPay: [''],
      religion: [''],
      //increment: [''],
      employeeId: ['', Validators.required],
      campusId: ['', Validators.required],
      totalAllowances: ['', Validators.required],
      netSalary: ['', Validators.required],
      grossPay: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      workingDays: [0, Validators.required],
      presentDays: [0, [Validators.required]],
      leaveDays: [0, [Validators.required]],
      totalDeductions: ['', Validators.required],
      netIncrement: ['', Validators.required],
      taxDeduction: ['', Validators.required],
      basicSalary: ['', Validators.required],
      departmentId: ['', Validators.required],
      designationId: ['', Validators.required],
      payrollTransactionLines: this.fb.array([
        this.addPayrollTransactionLines()
      ])
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

    // this.getLatestEmployeeData();

    //Get Data from Store
    this.ngxsService.getPayrollItemsFromState();
    this.ngxsService.getEmployeeFromState();
    this.ngxsService.getDepartmentFromState();
    this.ngxsService.getDesignationFromState();
    this.ngxsService.getAccountPayableFromState();
    this.ngxsService.getCampusFromState();
    this.ngxsService.getAccountLevel4FromState();

    //to show message for information
    // this.toastService.info('Only Account Payable field is editable.', 'Payroll')

    this.payrollTypes = [
      { id: 0, value: 'Basic Pay' },
      { id: 1, value: 'Increment' },
      { id: 2, value: 'Deduction' },
      { id: 3, value: 'Allowances' },
      { id: 4, value: 'Assignment Allowance' },
      { id: 5, value: 'Tax Deduction' }
    ]

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
      religion: payrollTransaction.religion,
      campusId: payrollTransaction.campusId,
      grossPay: payrollTransaction.grossPay,
      netSalary: payrollTransaction.netSalary,
      totalAllowances: payrollTransaction.totalAllowances,
      totalDeductions: payrollTransaction.totalDeductions,
      netIncrement: payrollTransaction.netIncrement,
      taxDeduction: payrollTransaction.taxDeduction,
      basicSalary: payrollTransaction.basicSalary,
      departmentId: payrollTransaction.departmentId,
      designationId: payrollTransaction.designationId,

    })



    this.checkSelected(payrollTransaction)

    this.disableFields(this.payrollTransactionForm,
      "employeeId", "month", "year", "workingDays", "presentDays",
      "leaveDays", "transDate", "basicPay")
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



  // Add petty cash Entry Line
  addPayrollTransactionLine(): void {
    const controls = this.payrollTransactionForm.controls.payrollTransactionLines as FormArray;
    controls.push(this.addPayrollTransactionLines());
    this.table.renderRows();
  }

  addPayrollTransactionLines(): FormGroup {
    return this.fb.group({
      accountId: ['', Validators.required],
      payrollItemId: [0, Validators.required],
      payrollType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
    });
  }


  //Remove Payroll Line
  removePayrollTransactionEntryLine(pettyEntryLineIndex: number): void {
    const payrollEntryLine = this.payrollTransactionForm.get('payrollTransactionLines') as FormArray;
    payrollEntryLine.removeAt(pettyEntryLineIndex);
    payrollEntryLine.markAsDirty();
    payrollEntryLine.markAsTouched();
    this.table.renderRows();
    // this.totalCalculation();
  }


  //Edit Petty Cash Entry Lines
  editPayrollTransactionLines(payrollTransactionLines: IPayrollTransactionLines[]): FormArray {
    const formArray = new FormArray([]);
    payrollTransactionLines.forEach((line: IPayrollTransactionLines) => {
      formArray.push(this.fb.group({
        id: [line.id, [Validators.required]],
        payrollType: [line.payrollType, [Validators.required]],
        payrollItemId: [line.payrollItemId, [Validators.required]],
        amount: [line.amount, [Validators.required, Validators.min(0)]],
        accountId: [line.accountId, [Validators.required]],

      }))
    })
    return formArray
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
        if (!res) {
          return
        }

        this.payrollTransaction = res.result
        this.editPayrollTransaction(this.payrollTransaction)
      });
  }

  //Edit Payroll Entry 
  editPayrollTransaction(payrollTransaction: IPayrollTransaction) {
    this.payrollTransactionForm.patchValue({
      month: payrollTransaction.month,
      year: payrollTransaction.year,
      campusId: payrollTransaction.campusId,
      employeeId: payrollTransaction.employeeId,
      presentDays: payrollTransaction.presentDays,
      leaveDays: payrollTransaction.leaveDays,
      transDate: payrollTransaction.transDate,
      designationId: payrollTransaction.designationId,
      departmentId: payrollTransaction.departmentId,
      bpsName: payrollTransaction.bpsName,
      totalAllowances: payrollTransaction.totalAllowances,
      totalDeductions: payrollTransaction.totalDeductions,
      netIncrement: payrollTransaction.netIncrement,
      taxDeduction: payrollTransaction.taxDeduction,
      grossPay: payrollTransaction.grossPay,
      netSalary: payrollTransaction.netSalary,
      basicSalary: payrollTransaction.basicSalary,
      religion: payrollTransaction.religion,
      employeeType: payrollTransaction.employeeType,
    });

    // this.onCampusSelected(pettyEntry.campusId)
    this.showMessage = true;

    this.payrollTransactionForm.setControl('payrollTransactionLines', this.editPayrollTransactionLines(payrollTransaction.payrollTransactionLines));
    // this.totalCalculation();
  }

  // submit method called on submit button
  onSubmit() {
    if (this.payrollTransactionForm.get('payrollTransactionLines').invalid) {
      this.payrollTransactionForm.get('payrollTransactionLines').markAllAsTouched();
    }

    const controls = this.payrollTransactionForm.controls.payrollTransactionLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add petty cash entry lines', 'Payroll Transaction')
      return
    }

    if (this.payrollTransactionForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Payroll Transaction")
      return;
    }



    this.isLoading = true;
    this.mapPayrollTransactionValuesToPayrollModel()
    if (this.payrollId) {
      this.payrollTransactionService.createPayrollTransaction(this.payrollTransaction)
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
              this.router.navigate(['/' + PAYROLL_TRANSACTION.ID_BASED_ROUTE('details', this.payrollTransaction.id)])
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
    this.payrollTransaction.designationId = this.payrollTransactionForm.value.designationId;
    this.payrollTransaction.campusId = this.payrollTransactionForm.value.campusId;
    this.payrollTransaction.departmentId = this.payrollTransactionForm.value.departmentId;
    this.payrollTransaction.bpsName = this.payrollTransactionForm.value.bpsName;
    this.payrollTransaction.totalAllowances = this.payrollTransactionForm.value.totalAllowances;
    this.payrollTransaction.totalDeductions = this.payrollTransactionForm.value.totalDeductions;
    this.payrollTransaction.netIncrement = this.payrollTransactionForm.value.netIncrement;
    this.payrollTransaction.taxDeduction = this.payrollTransactionForm.value.taxDeduction;
    this.payrollTransaction.grossPay = this.payrollTransactionForm.value.grossPay;
    this.payrollTransaction.netSalary = this.payrollTransactionForm.value.netSalary;
    this.payrollTransaction.basicSalary = this.payrollTransactionForm.value.basicSalary;
    this.payrollTransaction.religion = this.payrollTransactionForm.value.religion;
    this.payrollTransaction.employeeType = this.payrollTransactionForm.value.employeeType;
    this.payrollTransaction.payrollTransactionLines = this.payrollTransactionForm.getRawValue().payrollTransactionLines;
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


  getLatestEmployeeData() {
    this.ngxsService.store.dispatch(new IsReloadRequired(EmployeeState, true))
  }
}
