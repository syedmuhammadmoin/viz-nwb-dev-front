import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { FirstDataRenderedEvent, RowNode} from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { ActionButton, DocumentStatus } from 'src/app/views/shared/AppEnum';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { CampusState } from '../../../profiling/campus/store/campus.state';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { PayrollProcessService } from '../service/payroll-process.service';

@Component({
  selector: 'kt-approve-payroll-process',
  templateUrl: './approve-payroll-process.component.html',
  styleUrls: ['./approve-payroll-process.component.scss']
})

export class ApprovePayrollProcessComponent extends AppComponentBase implements OnInit {

  actions = ActionButton;
  months = AppConst.Months;
  approvePayrollProcessForm: FormGroup;
  defaultColDef: any;
  gridOptions: any;
  isLoading: boolean;
  payrollTransactions: any[] = [];
  overlayLoadingTemplate: any;
  isDisabled: any;
  rowSelection = 'multiple';
  departmentsList: any = new BehaviorSubject<any>([])
  pinnedBottomRowData: any = [];

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
  private gridApi: any;

  columnDefs = [
    {
      headerName: 'Employee',
      field: 'employee',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Transaction Date',
      field: 'transDate',
      suppressHeaderMenuButton: true,
      cellRenderer: (params) => {
        return this.dateHelperService.transformDate(params.value, 'MMM d, y');
      }
    },
    {
      headerName: 'CNIC',
      field: 'cnic',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Designation',
      field: 'designation',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Campus',
      field: 'campus',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Department',
      field: 'department',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Working Days',
      field: 'workingDays',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Present Days',
      field: 'presentDays',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Absent Days',
      field: 'absentDays',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Net Salary',
      field: 'netSalary',
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
    }
  };

  formErrors: any = {
    departmentId: '',
    campusId: '',
    month: '',
    year: ''
  };

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private payrollProcessService: PayrollProcessService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>';
  }

  ngOnInit(): void {
    this.approvePayrollProcessForm = this.fb.group({
      departmentId: ['',Validators.required],
      campusId: ['',Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required]
    })

    this.gridOptions = {
      paginationPageSizeSelector: false
    }

    this.getLatestCampuses();
    this.ngxsService.getDepartmentFromState();
    this.ngxsService.getCampusFromState();
  }

  onSubmit() {
    if (this.approvePayrollProcessForm.invalid) {
      this.logValidationErrors(this.approvePayrollProcessForm, this.formErrors, this.validationMessages)
      return
    }
    this.isLoading = true
    const body = {
      departmentId: this.approvePayrollProcessForm.value.departmentId,
      campusId: this.approvePayrollProcessForm.value.campusId,
      month: this.approvePayrollProcessForm.value.month,
      year: this.approvePayrollProcessForm.value.year,
    }

    this.payrollProcessService.GetApprovePayrollProcess(body)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         }),
        map((res: any) => {
          if (isEmpty(res.result)) {
            this.toastService.info('No Records Found !' , 'Payroll Process')
          }
          return res.result.map((response: any) => {
            return response
          });
        })
      )
      .subscribe((res) => {
        this.payrollTransactions = res
        setTimeout(() => {
          const pinnedBottomData = this.generatePinnedBottomData();
          this.pinnedBottomRowData = [pinnedBottomData];
          this.cdRef.detectChanges();
        }, 500)
      })
  }

// first time rendering
  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.api.sizeColumnsToFit();
  }

// methd called on grid ready
  onGridReady(params) {
    this.gridApi = params.api;
  }

// approve the process or submit the process
  submitOrApproveProcess(actionButton?: ActionButton) {
    if (this.gridApi.getSelectedRows().length < 1) {
      this.toastService.error('Atleast 1 record is required to process the payroll', 'Processing Error!')
      return;
    }

    if (this.gridApi.getSelectedRows().some(x => x.status === DocumentStatus.Rejected)) {
      this.toastService.error('Cannot process REJECTED transactions', 'Processing Error!')
      return;
    }
    this.isLoading = true;
    const idsToSent = this.gridApi.getSelectedRows().map(x => {
      return x.id
    })
    const body = {docId: idsToSent, action: actionButton}

    this.payrollProcessService.submitApprovalPayrollProcess(body)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        if(actionButton === 0) {
          this.toastService.success(`${'Payroll approval process completed successfully'}`, 'Successful')
        }
        else if(actionButton === 1) {
          this.toastService.success(`${'Payroll rejection process completed successfully'}`, 'Successful')
        }
        this.resetForm();
        this.cdRef.detectChanges();
      })
  }

  resetForm() {
    this.formDirective.resetForm();
    this.payrollTransactions = [];
    this.pinnedBottomRowData = [];
  }

  generatePinnedBottomData() {
    // generate a row-data with null values
    const result = {};

    this.gridApi.getAllGridColumns().forEach(item => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(result);
  }

  calculatePinnedBottomData(target: any) {
    // list of columns fo aggregation
    const columnsWithAggregation = ['tax', 'netSalary']
    columnsWithAggregation.forEach(element => {
      this.gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
        if (rowNode.data[element])
        target[element] += Number(rowNode.data[element].toFixed(2));
      });
      if (target[element]) {
        target[element] = target[element]
      }
    })
    target.employee = 'Total'
    return target;
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.departmentService.getDepartmentByCampusId(campusId).subscribe(res => {
      this.departmentsList.next(res.result || [])
    })
     this.approvePayrollProcessForm.get('departmentId').setValue(null)
     this.cdRef.detectChanges()
  }

  checkCampus(){
    if(this.approvePayrollProcessForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Payroll Process")
    }
  }

  getLatestCampuses(){
    this.ngxsService.store.dispatch(new IsReloadRequired(CampusState , true))
  }
}


