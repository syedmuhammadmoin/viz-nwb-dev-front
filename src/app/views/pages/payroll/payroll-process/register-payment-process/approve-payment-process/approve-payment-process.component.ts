import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { BehaviorSubject} from 'rxjs';

import { FirstDataRenderedEvent, GridOptions} from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ActionButton } from 'src/app/views/shared/AppEnum';
import { PayrollProcessService } from '../../service/payroll-process.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from 'src/app/views/pages/profiling/store/profiling.action';
import { DepartmentState } from '../../../department/store/department.store';


@Component({
  selector: 'kt-approve-payment-process',
  templateUrl: './approve-payment-process.component.html',
  styleUrls: ['./approve-payment-process.component.scss']
})

export class ApprovePaymentProcessComponent extends AppComponentBase implements OnInit {

  months = '' //AppConst.Months
  isLoading: any;
  approvePayrollPaymentForm: FormGroup;
  tooltipData = 'double click to edit'
  employeeGridApi: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;
  paymentList: any[] = [];
  propertyValue: any;
  overlayLoadingTemplate: any;
  propertyName: any;
  paymentRegisterList: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  columnDefs = [
    {
      headerName: 'Employee Name',
      field: 'businessPartner',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      suppressMenu: true,
    },
    {
      headerName: 'Doc #', field: 'docNo', suppressMenu: true,
    },
    {
      headerName: 'Account Payable',
      field: 'account',
      suppressMenu: true,
    },
    {
      headerName: 'Register',
      field: 'paymentRegister',
      suppressMenu: true,
    },
    {
      headerName: 'Date',
      field: 'paymentDate',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.dateHelperService.transformDate(new Date(params.value), 'dd MMM, yyyy')
      }
    },
    {
      headerName: 'Net Payment',
      field: 'netPayment',
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
  };
  actions = ActionButton;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    private payrollProcessService: PayrollProcessService,
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
    this.approvePayrollPaymentForm = this.fb.group({
      departmentId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
     // bankId: [''],
    });

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.getLatestDepartments();
    this.ngxsService.getDepartmentFromState();
    // this.getEmployeeBankFromState()
  }

  onSubmitFilters() {
    if (this.approvePayrollPaymentForm.invalid) {
      this.logValidationErrors(this.approvePayrollPaymentForm, this.formErrors, this.validationMessages)
      return
    }
    this.isLoading = true;
    this.payrollProcessService.getPayrollPaymentForApproval(this.approvePayrollPaymentForm.value)
      .subscribe((res) => {
        this.isLoading = false;
        this.paymentList = res.result;
        console.log('list: ', this.paymentList);
        this.cdRef.detectChanges();
      }, (err) => {
        this.isLoading = false;
        // this.toastService.error(`${err.error.message || 'Something went wrong.'}`, 'Fetching Error!')
        this.cdRef.detectChanges();
      });
  }

  approvePayment(actionButton: ActionButton) {
    if (this.employeeGridApi.getSelectedRows().length < 1) {
      this.toastService.error('Atleast 1 record is required to process', 'Processing Error!');
      return;
    }
    this.isLoading = true;
    const selectedTransactions = this.employeeGridApi.getSelectedRows().map(x => {
      return x.id
    })
    console.log(selectedTransactions);
    this.payrollProcessService.approvePayrollPaymentProcess({docId: selectedTransactions, action: actionButton})
      .subscribe((res) => {
        this.isLoading = false;
        this.toastService.success(`${res.message || 'Approval Processed successfully.'}`, 'Successful');
       // this.onSubmitFilters()
        this.cdRef.detectChanges();
      }, (err) => {
        this.isLoading = false;
        //this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`)
        this.cdRef.detectChanges();
      });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.employeeGridApi = params.api;
  }

  resetForm() {
    this.formDirective.resetForm();
    this.paymentList = [];
  }

  getLatestDepartments(){
    this.ngxsService.store.dispatch(new IsReloadRequired(DepartmentState , true))
  }

}



