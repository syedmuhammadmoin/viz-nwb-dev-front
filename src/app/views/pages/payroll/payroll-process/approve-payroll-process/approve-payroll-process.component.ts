import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { FirstDataRenderedEvent, RowNode} from 'ag-grid-community';
import { map } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { ActionButton, DocumentStatus } from 'src/app/views/shared/AppEnum';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { DepartmentState } from '../../department/store/department.store';
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
  gridColumnApi: any
  isLoading: boolean;
  payrollTransactions: any[] = [];
  overlayLoadingTemplate: any;
  isDisabled: any;
  rowSelection = 'multiple';
  private gridApi: any;

  columnDefs = [
    {
      headerName: 'Employee',
      field: 'employee',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      filter: true,
    },
    {
      headerName: 'Transaction Date',
      field: 'transDate',
      filter: true,
      cellRenderer: (params) => {
        return this.dateHelperService.transformDate(params.value, 'MMM d, y');
      }
    },
    {
      headerName: 'CNIC',
      field: 'cnic',
      filter: true,
    },
    {
      headerName: 'Designation',
      field: 'designation',
      filter: true,
    },
    {
      headerName: 'Department',
      field: 'department',
      filter: true,
    },
    {
      headerName: 'Working Days',
      field: 'workingDays'
    },
    {
      headerName: 'Present Days',
      field: 'presentDays'
    },
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
      filter: true,
    },
  ];

  validationMessages = {
    departmentId: {
      required: 'Department is required'
    },
    month: {
      required: 'Month is required'
    },
    year: {
      required: 'Year is required'
    }
  };

  formErrors = {
    departmentId: '',
    month: '',
    year: ''
  };

  
  
  

  religionList = [
    { id: 0, value: 'Islam' },
    { id: 1, value: 'Christian' },
    { id: 2, value: 'Hinduism' },
  ]

  // editPayrollTransaction(event: any) {
  //   const dialogRef = this.dialog.open(CreatePayrollTransactionComponent, {
  //     width: '100%',
  //     data: event?.data?.id
  //   });
  //   // Recalling getBankAccounts function on dialog close
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.onSubmit();
  //   });
  // }


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
      month: ['', Validators.required],
      year: ['', Validators.required],
      religion: ['']
      // accountPayableId: [null]
    })

    this.getLatestDepartments();
    this.ngxsService.getDepartmentFromState();
  }

  onSubmit() {
    if (this.approvePayrollProcessForm.invalid) {
      this.logValidationErrors(this.approvePayrollProcessForm, this.formErrors, this.validationMessages)
      return
    }
    this.isLoading = true
    const body = {
      departmentId: this.approvePayrollProcessForm.value.departmentId ,
      month: this.approvePayrollProcessForm.value.month,
      year: this.approvePayrollProcessForm.value.year,
    }

    this.payrollProcessService.GetApprovePayrollProcess(body)
      .pipe(map((res: any) => {
        return res.result.map((response: any) => {
          return response
        });
      }))
      .subscribe((res) => {
        this.payrollTransactions = res
        this.isLoading = false
        this.cdRef.detectChanges();
        setTimeout(() => {
          const pinnedBottomData = this.generatePinnedBottomData();
          this.gridApi.setPinnedBottomRowData([pinnedBottomData]);
        }, 500)
      }, (err) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        // this.toastService.error(`${err?.error?.message || 'Something went wrong please try again later'}`)
      })
  }

// first time rendering
  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.api.sizeColumnsToFit();
  }

// methd called on grid ready
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
      .subscribe((res) => {
        if(actionButton === 0) {
          this.toastService.success(`${'Payroll approve process completed successfully'}`, 'Successful')
        }
        else if(actionButton === 1) {
          this.toastService.success(`${'Payroll rejected process completed successfully'}`, 'Successful')
        }
        this.resetForm();
        this.isLoading = false;
        this.cdRef.detectChanges();

      }, (err) => {
        //this.toastService.error(`${err?.error?.message || 'Something went wrong please try again later'}`, 'Error')
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
  }

  resetForm() {
    // this.createcreatePayrollProcessForm.reset();
    this.approvePayrollProcessForm.reset();
    this.payrollTransactions = []
    this.gridApi.setPinnedBottomRowData([])
    this.logValidationErrors(this.approvePayrollProcessForm, this.formErrors , this.validationMessages)
  }

  generatePinnedBottomData() {
    // generate a row-data with null values
    const result = {};

    this.gridColumnApi.getAllGridColumns().forEach(item => {
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
    // console.log(target);
    return target;
  }

  getLatestDepartments(){
    this.ngxsService.store.dispatch(new IsReloadRequired(DepartmentState , true))
  }
}


