import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../../../shared/app-component-base';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AppConst} from '../../../../../../shared/AppConst';
import { GridOptions} from 'ag-grid-community';
import { BehaviorSubject} from "rxjs";
import { Output, EventEmitter } from '@angular/core';
import { PayrollProcessService } from '../../../service/payroll-process.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';

@Component({
  selector: 'kt-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})

export class CreatePaymentComponent extends AppComponentBase implements OnInit {

  months = '' //AppConst.Months
  filterForm: FormGroup;
  createPayrollPaymentForm: FormGroup;
  tooltipData = 'double click to edit'
  employeeGridApi: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;
  transactionList: any[] = [];
  propertyValue: any;
  propertyName: any;
  paymentRegisterList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  @Output() isLoading = new EventEmitter<boolean>();

  columnDefs = [
    {
      headerName: 'Employee Name',
      field: 'employee',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      filter:true,
    },
    {
      headerName: 'CNIC', field: 'cnic',
      filter:true,
    },
    {
      headerName: 'Designation', field: 'designation',
      filter:true,
    },
    {
      headerName: 'Department',
      field: 'department',
      filter:true,
    },
    {
      headerName: 'Working Days',
      // editable: true,
      field: 'workingDays',
      tooltipField: 'workingDays',
    },
    {
      headerName: 'Present Days',
      // editable: true,
      field: 'presentDays',
      tooltipField: 'presentDays'
    },
/*    {
      headerName: 'Tax',
      field: 'tax',
      tooltipField: 'tax'
    },*/
    {
      headerName: 'Net Salary',
      field: 'netSalary',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      filter:true,
    },
  ];

  formErrors = {
    departmentId: '',
    month: '',
    year: '',
    accountPayableId: '',
    campusId: '',
    paymentRegisterId: '',
    description: '',
  };
  validationMessages = {
    departmentId: {
      required: 'Department is required.'
    },
    month: {
      required: 'Month is required.'
    },
    year: {
      required: 'Year is required.'
    },
    accountPayableId: {
      required: 'Account Payable is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
    paymentRegisterId: {
      required: 'Payment Register is required.'
    },
    description: {
      required: 'Description is required.'
    },
  };

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private payrollProcessService: PayrollProcessService,
    private ngxsService: NgxsCustomService
  ) {
    super(injector);
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }

    ) as GridOptions);
    // this.getDepartmentFromState();
    // this.getCampusesFromState();
    // this.getEmployeeBankFromState()
  }

  ngOnInit(): void {
    console.log(this.isLoading)
    this.filterForm = this.fb.group({
      departmentId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      bankId: [''],
    });

    this.createPayrollPaymentForm = this.fb.group({
      campusId: ['', Validators.required],
      paymentRegisterType: ['', Validators.required],
      paymentRegisterId: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  }

  onSubmitFilters() {
    if (this.filterForm.invalid) {
      this.logValidationErrors(this.filterForm, this.formErrors, this.validationMessages)
      return
    }

    this.isLoading.emit(true);
    this.payrollProcessService.getPayrollTransactions(this.filterForm.value)
      .subscribe((res) => {
        this.isLoading.emit(false);
        this.transactionList = res.result;
        this.cdRef.detectChanges();
      });
  }

  createPayment() {
    if (this.createPayrollPaymentForm.invalid) {
      this.logValidationErrors(this.createPayrollPaymentForm, this.formErrors, this.validationMessages)
      return
    }
    if (this.employeeGridApi.getSelectedRows().length < 1) {
      this.toastService.error('Atleast 1 record is required to process', 'Processing Error!');
      return;
    }
    this.isLoading.emit(true);
    const selectedTransactions = this.employeeGridApi.getSelectedRows()
    const body = {...this.createPayrollPaymentForm.value} //as IPaymentProcess
    const bodyList = [] //as ICreatePayrollTransLines[]
    selectedTransactions.forEach((x: any) => {
      bodyList.push({
        accountPayableId: x.accountPayableId,
        businessPartnerId: x.businessPartnerId,
        netSalary: x.netSalary,
        transactionId: x.transactionId
      })
    });
    body.createPayrollTransLines = bodyList;
    body.paymentDate = this.dateHelperService.transformDate(new Date(), 'dd MMM, yyyy')
    console.log('body: ', body)
    this.payrollProcessService.createPaymentProcess(body)
      .subscribe((res) => {
        this.isLoading.emit(false);
        this.toastService.success(`${res.message || 'Payment registered successfully.'}`, 'Successful');
        this.resetForm();
        this.cdRef.detectChanges();
      });
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.employeeGridApi = params.api;
  }

  loadAccountList($event: any, id = null) {
    console.log(id);
    this.createPayrollPaymentForm.patchValue({
      paymentRegister: id
    })
    if ($event.value === 1) {
      this.ngxsService.cashAccountService.getCashAccountsDropdown().subscribe(res => {
        this.paymentRegisterList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'chAccountId';
      this.propertyName = 'cashAccountName';
    } else {
      this.ngxsService.bankAccountService.getBankAccountsDropdown().subscribe(res => {
        this.paymentRegisterList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'clearingAccountId';
      this.propertyName = 'accountTitle';
    }
  }

  resetForm() {
    this.filterForm.reset();
    this.createPayrollPaymentForm.reset();
    this.logValidationErrors(this.filterForm, this.formErrors, this.validationMessages)
    this.logValidationErrors(this.createPayrollPaymentForm, this.formErrors, this.validationMessages)
    this.transactionList = [];
  }

}





