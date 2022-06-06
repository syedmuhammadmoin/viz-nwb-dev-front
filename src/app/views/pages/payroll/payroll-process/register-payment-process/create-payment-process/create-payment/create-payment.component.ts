import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../../../shared/app-component-base';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { AppConst} from '../../../../../../shared/AppConst';
import { GridOptions} from 'ag-grid-community';
import { BehaviorSubject} from "rxjs";
import { Output, EventEmitter } from '@angular/core';
import { PayrollProcessService } from '../../../service/payroll-process.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ICashAccount } from 'src/app/views/pages/finance/cash-account/model/ICashAccount';
import { IBankAccount } from 'src/app/views/pages/finance/bank-account/model/IBankAccount';
import { MatRadioChange } from '@angular/material/radio';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IsReloadRequired } from 'src/app/views/pages/profiling/store/profiling.action';
import { DepartmentState } from '../../../../department/store/department.store';

@Component({
  selector: 'kt-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})

export class CreatePaymentComponent extends AppComponentBase implements OnInit {

  months = AppConst.Months
  filterForm: FormGroup;
  createPayrollPaymentForm: FormGroup;
  tooltipData = 'double click to edit'
  employeeGridApi: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;
  transactionList: any[] = [];
  overlayLoadingTemplate: any;
  propertyValue: any;
  propertyName: any;
  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('formDirective2') private formDirective2: NgForm;

  paymentRegisterList: BehaviorSubject<ICashAccount[] | IBankAccount[] | []> = new BehaviorSubject<ICashAccount[] | IBankAccount[] | []>([]);
  
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
    public ngxsService: NgxsCustomService
  ) {
    super(injector);
    this.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>';
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
      // paymentRegisterType: ['', Validators.required],
      paymentRegisterId: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.loadAccountList({value: 2})

    this.getLatestDepartments();
    this.ngxsService.getDepartmentFromState();
    this.ngxsService.getCampusFromState();
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
    console.log("selcted employees")
    console.log(selectedTransactions)
    selectedTransactions.forEach((x: any) => {
      bodyList.push({
        accountPayableId: x.accountPayableId,
        businessPartnerId: x.businessPartnerId,
        netSalary: x.netSalary,
        transactionId: x.transactionId
      })
    });
    body.createPayrollTransLines = bodyList;
    body.paymentDate = this.dateHelperService.transformDate(new Date(), 'yyyy-MM-dd')
    console.log('body: ', body)
    this.payrollProcessService.createPaymentProcess(body)
      .subscribe((res) => {
        this.isLoading.emit(false);
        this.toastService.success('Registered successfully', 'Payment');
        this.resetForm();
        this.cdRef.detectChanges();
      },
      (err) => {
        this.isLoading.emit(false)
      });
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.employeeGridApi = params.api;
  }

  loadAccountList($event: MatRadioChange | any, id: number = null) {
    this.createPayrollPaymentForm.patchValue({
      paymentRegister: id
    })
    if ($event.value === 1) {
      this.ngxsService.cashAccountService.getCashAccountsDropdown().subscribe((res: IApiResponse<ICashAccount[]>) => {
        this.paymentRegisterList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'chAccountId';
      this.propertyName = 'cashAccountName';
    } else {
      this.ngxsService.bankAccountService.getBankAccountsDropdown().subscribe((res: IApiResponse<IBankAccount[]>) => {
        console.log("entered")
        console.log(res.result)
        this.paymentRegisterList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'clearingAccountId';
      this.propertyName = 'accountTitle';
    }
  }

  resetForm() {
    this.formDirective.resetForm();
    this.formDirective2.resetForm();
    this.transactionList = [];
  }

  getLatestDepartments(){
    this.ngxsService.store.dispatch(new IsReloadRequired(DepartmentState , true))
  }

}





