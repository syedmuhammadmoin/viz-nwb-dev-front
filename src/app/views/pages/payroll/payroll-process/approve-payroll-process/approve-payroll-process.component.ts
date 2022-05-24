import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { FirstDataRenderedEvent, RowNode} from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ActionButton, DocumentStatus } from 'src/app/views/shared/AppEnum';
import { PayrollProcessService } from '../service/payroll-process.service';

@Component({
  selector: 'kt-approve-payroll-process',
  templateUrl: './approve-payroll-process.component.html',
  styleUrls: ['./approve-payroll-process.component.scss']
})

export class ApprovePayrollProcessComponent extends AppComponentBase implements OnInit {

  actions = ActionButton;
  months = []//AppConst.Months;
  approvePayrollProcessForm: FormGroup;
  defaultColDef: any;
  gridOptions: any;
  gridColumnApi: any
  isLoading: boolean;
  payrollTransactions: any[] = [];
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
    { viewValue: 'Islam' },
    { viewValue: 'Christian' },
    { viewValue: 'Hinduism' },
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
    //private transactionProcessService: PayrollTransactionProcessService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.approvePayrollProcessForm = this.fb.group({
      departmentId: ['',Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      religion: ['']
      // accountPayableId: [null]
    })
    //this.getDepartmentFromState();
  }

  onSubmit() {
    console.log(this.approvePayrollProcessForm)
    // if (this.approvePayrollProcessForm.invalid) {
    //   this.logValidationErrors(this.approvePayrollProcessForm, this.formErrors, this.validationMessages)
    //   return
    // }
    // this.isLoading = true
    // this.payrollProcessService.GetApprovePayrollProcess(this.approvePayrollProcessForm.value)
    //   .pipe(map((res: any) => {
    //     return res.result.map((response: any) => {
    //       return response
    //     });
    //   }))
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.payrollTransactions = res
    //     this.isLoading = false
    //     this.cdRef.detectChanges();
    //     setTimeout(() => {
    //       const pinnedBottomData = this.generatePinnedBottomData();
    //       this.gridApi.setPinnedBottomRowData([pinnedBottomData]);
    //     }, 500)
    //   }, (err) => {
    //     this.isLoading = false;
    //     this.cdRef.detectChanges();
    //     // this.toastService.error(`${err?.error?.message || 'Something went wrong please try again later'}`)
    //   })
  }

// first time rendering
  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.api.sizeColumnsToFit();
  }

// for resting form
  reset() {
    this.approvePayrollProcessForm.reset();
    this.payrollTransactions = []
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
        this.toastService.success(`${res.message || 'Proceeded Successfully!'}`, 'Successful')
        this.onSubmit();
        this.isLoading = false;
        this.cdRef.detectChanges();

      }, (err) => {
        //this.toastService.error(`${err?.error?.message || 'Something went wrong please try again later'}`, 'Error')
        this.isLoading = false;
        this.cdRef.detectChanges();
      })

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
}


