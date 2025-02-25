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
import { isEmpty } from 'lodash';
import { AppConst } from 'src/app/views/shared/AppConst';
import { finalize, take } from 'rxjs/operators';
import { CampusState } from 'src/app/views/pages/profiling/campus/store/campus.state';


@Component({
  selector: 'kt-approve-payment-process',
  templateUrl: './approve-payment-process.component.html',
  styleUrls: ['./approve-payment-process.component.scss']
})

export class ApprovePaymentProcessComponent extends AppComponentBase implements OnInit {

  months = AppConst.Months
  isLoading: any;
  approvePayrollPaymentForm: FormGroup;
  tooltipData = 'double click to edit'
  employeeGridApi: any;
  
  gridOptions: any;
  defaultColDef: any;
  paymentList: any[] = [];
  propertyValue: any;
  overlayLoadingTemplate: any;
  propertyName: any;
  paymentRegisterList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  departmentsList: any = new BehaviorSubject<any>([])

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  columnDefs = [
    {
      headerName: 'Employee Name',
      field: 'businessPartnerName',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Doc #', field: 'docNo', suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Account Payable',
      field: 'accountName',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Register',
      field: 'paymentRegisterName',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Date',
      field: 'paymentDate',
      suppressHeaderMenuButton: true,
      valueFormatter: (params) => {
        return this.dateHelperService.transformDate(new Date(params.value), 'dd MMM, yyyy')
      }
    },
    {
      headerName: 'Net Payment',
      field: 'netPayment',
      suppressHeaderMenuButton: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      suppressHeaderMenuButton: true,
    },
  ];

  formErrors: any = {
    departmentId: '',
    campusId: '',
    month: '',
    year: '',
  };

  validationMessages = {
    departmentId: {
      required: 'Department is required.'
    },
    campusId: {
      required: 'Campus is required.'
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
      campusId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
     // bankId: [''],
    });

    this.gridOptions = {
      paginationPageSizeSelector: false
    }

    this.defaultColDef = {
      sortable: false,
      tooltipComponent: 'customTooltip'
    }
    

    this.getLatestCampuses();

    //Get Data from Store
    this.ngxsService.getDepartmentFromState();
    this.ngxsService.getCampusFromState();
  }

  onSubmitFilters() {
    if (this.approvePayrollPaymentForm.invalid) {
      this.logValidationErrors(this.approvePayrollPaymentForm, this.formErrors, this.validationMessages)
      return
    }
    this.isLoading = true;
    this.payrollProcessService.getPayrollPaymentForApproval(this.approvePayrollPaymentForm.value)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.paymentList = res.result;
        if (isEmpty(res.result)) {
          this.toastService.info('No Records Found !' , 'Payroll Payment')
        }
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
    this.payrollProcessService.approvePayrollPaymentProcess({docId: selectedTransactions, action: actionButton})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        if(actionButton === 0) {
          this.toastService.success(`${'Payroll payment approval process completed successfully'}`, 'Successful')
        }
        else if(actionButton === 1) {
          this.toastService.success(`${'Payroll payment rejection process completed successfully'}`, 'Successful')
        }
        this.resetForm();
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

  onCampusSelected(campusId : number) {
    this.ngxsService.departmentService.getDepartmentByCampusId(campusId).subscribe(res => {
      this.departmentsList.next(res.result || [])
    })
     this.approvePayrollPaymentForm.get('departmentId').setValue(null)
     this.cdRef.detectChanges()
  }

  checkCampus(){
    if(this.approvePayrollPaymentForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Payroll Payment Process")
    }
  }

  getLatestCampuses(){
    this.ngxsService.store.dispatch(new IsReloadRequired(CampusState , true))
  }
}



