import { ChangeDetectorRef, Component,  Injector, OnInit, ViewChild} from '@angular/core';
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
import { isEmpty } from 'lodash';
import { finalize, take } from 'rxjs/operators';
import { IPayment } from 'src/app/views/pages/finance/payment/model/IPayment';
import { IPaymentProcess } from '../../../model/IPaymentProcess';
import { CampusState } from 'src/app/views/pages/profiling/campus/store/campus.state';

@Component({
  selector: 'kt-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})

export class CreatePaymentComponent extends AppComponentBase implements OnInit {

  months = AppConst.Months
  filterForm: FormGroup;
  createPayrollPaymentForm: FormGroup;
  tooltipData = 'click to select employee'
  employeeGridApi: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;
  transactionList: any[] = [];
  overlayLoadingTemplate: any;
  propertyValue: any;
  propertyName: any;
  departmentsList: any = new BehaviorSubject<any>([])
  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('formDirective2') private formDirective2: NgForm;

  bankAccountList: BehaviorSubject<ICashAccount[] | IBankAccount[] | []> = new BehaviorSubject<ICashAccount[] | IBankAccount[] | []>([]);
  
  @Output() isLoading = new EventEmitter<boolean>();

  columnDefs = [
    {
      headerName: 'Employee Name',
      field: 'employee',
      tooltipField: 'cnic',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      suppressMenu: true,
    },
    {
      headerName: 'CNIC', field: 'cnic',
      tooltipField: 'cnic',
      suppressMenu: true,
    },
    {
      headerName: 'Designation', field: 'designation',
      tooltipField: 'cnic',
      suppressMenu: true,
    },
    {
      headerName: 'Campus',
      field: 'campus',
      tooltipField: 'cnic',
      suppressMenu: true,
    },
    {
      headerName: 'Department',
      field: 'department',
      tooltipField: 'cnic',
      suppressMenu: true,
    },
    {
      headerName: 'Working Days',
      // editable: true,
      field: 'workingDays',
      tooltipField: 'cnic',
      suppressMenu: true,
    },
    {
      headerName: 'Present Days',
      // editable: true,
      field: 'presentDays',
      tooltipField: 'cnic',
      suppressMenu: true,
    },
    {
      headerName: 'Net Salary',
      field: 'netSalary',
      tooltipField: 'cnic',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      suppressMenu: true,
    },
  ];

  formErrors = {
    departmentId: '',
    month: '',
    year: '',
    accountPayableId: '',
    campusId: '',
    bankAccount: '',
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
    bankAccount: {
      required: 'Bank Account is required.'
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
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      departmentId: ['', Validators.required],
      campusId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      bankId: [''],
    });

    this.createPayrollPaymentForm = this.fb.group({
      bankAccount: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
    }
    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.loadAccountList({value: 2})

    this.getLatestCampuses();

    //Get Data from Store
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
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading.emit(false);
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.transactionList = res.result;
        if (isEmpty(res.result)) {
          this.toastService.info('No Records Found !' , 'Payroll Payment')
        }
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
    const bodyList = [] //as ICreatePayrollTransLines[]
    console.log("selcted employees")
    console.log(selectedTransactions)
    selectedTransactions.forEach((x: any) => {
      bodyList.push({
        accountPayableId: x.accountPayableId,
        businessPartnerId: x.businessPartnerId,
        campusId: x.campusId,
        netSalary: x.netSalary,
        ledgerId: x.ledgerId
      })
    });

    const body = {} as IPaymentProcess;
    body.paymentDate = this.dateHelperService.transformDate(new Date(), 'yyyy-MM-dd')
    body.paymentRegisterType = 2;
    body.paymentRegisterId = this.createPayrollPaymentForm.value.bankAccount;
    body.description = this.createPayrollPaymentForm.value.description;
    body.createPayrollTransLines = bodyList;

    console.log(body)
    this.payrollProcessService.createPaymentProcess(body)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading.emit(false);
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.toastService.success('Registered successfully', 'Payroll Payment');
        if(res.result) {
          this.transactionList = res.result;
        }
        else {
          this.resetForm();
        }
        this.cdRef.detectChanges();
      })
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
        this.bankAccountList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'chAccountId';
      this.propertyName = 'cashAccountName';
    } else {
      this.ngxsService.bankAccountService.getBankAccountsDropdown().subscribe((res: IApiResponse<IBankAccount[]>) => {
        console.log("entered")
        console.log(res.result)
        this.bankAccountList.next(res.result)
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

  onCampusSelected(campusId : number) {
    this.ngxsService.departmentService.getDepartmentByCampusId(campusId).subscribe(res => {
      this.departmentsList.next(res.result || [])
    })
     this.filterForm.get('departmentId').setValue(null)
     this.cdRef.detectChanges()
  }

  checkCampus(){
    if(this.filterForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Payment Process")
    }
  }

  getLatestCampuses(){
    this.ngxsService.store.dispatch(new IsReloadRequired(CampusState , true))
  }

}





