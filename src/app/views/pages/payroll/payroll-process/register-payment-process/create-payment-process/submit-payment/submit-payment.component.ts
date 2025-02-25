import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../../../shared/app-component-base';
import { AppConst} from '../../../../../../shared/AppConst';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { BehaviorSubject} from 'rxjs';
import { GridOptions} from 'ag-grid-community';
import { MatDialog} from '@angular/material/dialog';
import { DocType } from '../../../../../../shared/AppEnum';
import { Output, EventEmitter } from '@angular/core';
import { PayrollProcessService } from '../../../service/payroll-process.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from 'src/app/views/pages/profiling/store/profiling.action';
import { isEmpty } from 'lodash';
import { finalize, take } from 'rxjs/operators';
import { CampusState } from 'src/app/views/pages/profiling/campus/store/campus.state';

@Component({
  selector: 'kt-submit-payment',
  templateUrl: './submit-payment.component.html',
  styleUrls: ['./submit-payment.component.scss']
})

export class SubmitPaymentComponent extends AppComponentBase implements OnInit {

  docType = DocType
  months = AppConst.Months
  submitPayrollPaymentForm: FormGroup;
  tooltipData = 'double click to edit'
  employeeGridApi: any;
  
  gridOptions: any;
  defaultColDef: any;
  paymentList: any[] = [];
  propertyValue: any;
  propertyName: any;
  overlayLoadingTemplate: any;
  paymentRegisterList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  @Output() isLoading = new EventEmitter<boolean>();
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
      headerName: 'Doc #', 
      field: 'docNo', 
      suppressHeaderMenuButton: true,
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

  formErrors: any = {
    departmentId: '',
    campusId: '',
    month: '',
    year: '',
  };

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    private payrollProcessService: PayrollProcessService,
    public dialog: MatDialog,
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
    this.submitPayrollPaymentForm = this.fb.group({
      departmentId: ['', Validators.required],
      campusId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      bankId: [''],
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
    if (this.submitPayrollPaymentForm.invalid) {
      this.logValidationErrors(this.submitPayrollPaymentForm, this.formErrors, this.validationMessages)
      return
    }
    this.isLoading.emit(true);
    this.payrollProcessService.getPayrollPayment(this.submitPayrollPaymentForm.value)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading.emit(false);
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.paymentList = res.result;
        if (isEmpty(res.result)) {
          this.toastService.info('No Records Found !' , 'Payroll Payment')
        }
        this.cdRef.detectChanges();
      })
    }

  createPayment() {
    if (this.employeeGridApi.getSelectedRows().length < 1) {
      this.toastService.error('Atleast 1 record is required to process', 'Processing Error!');
      return;
    }
    this.isLoading.emit(true);
    const selectedTransactions = this.employeeGridApi.getSelectedRows().map(x => {
      return x.id
    })

    this.payrollProcessService.submitPaymentProcess(selectedTransactions)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading.emit(false);
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.toastService.success(`${res.message || 'Payment submitted successfully.'}`, 'Successful');
        this.resetForm();
        this.cdRef.detectChanges();
      })
  }

  onFirstDataRendered(params: any) {
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
     this.submitPayrollPaymentForm.get('departmentId').setValue(null)
     this.cdRef.detectChanges()
  }

  checkCampus(){
    if(this.submitPayrollPaymentForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Payment Process")
    }
  }

  getLatestCampuses(){
    this.ngxsService.store.dispatch(new IsReloadRequired(CampusState , true))
  }
}



