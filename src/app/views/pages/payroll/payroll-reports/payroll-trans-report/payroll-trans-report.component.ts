import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GridApi, GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DesignationService } from '../../designation/service/designation.service';
import { PayrollItemService } from '../../payroll-item/service/payroll-item.service';
import { finalize, take } from 'rxjs/operators';
import { isEmpty} from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { EmployeeService } from '../../employee/service/employee.service';
import { DepartmentService } from '../../department/service/department.service';
import { PayrollReportsService } from '../service/payroll-reports.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { PAYROLL_TRANSACTION } from 'src/app/views/shared/AppRoutes';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { EmployeeState } from '../../employee/store/employee.state';

@Component({
  selector: 'kt-payroll-trans-report',
  templateUrl: './payroll-trans-report.component.html',
  styleUrls: ['./payroll-trans-report.component.scss']
})

export class PayrollTransReportComponent extends AppComponentBase implements OnInit {

  public permissions: Permissions;
  transactionReportForm: FormGroup;
  payrollTransitionModel: any;
  employeeTypeList = AppConst.EmployeeType;
  // employee types
  //employeeType = AppConst.EmployeeType;
  dateCondition : boolean
  // data for PDF
  recordsData: any = []
  disability = true
  totals = {};
  gridApi: GridApi

  // Limit Date
  maxDate = new Date();

  // app const for month
  months = AppConst.Months
 // Validation messages..
  validationMessages = {
    fromDate: {
      required: 'Date is required.',
    },
    toDate: {
     required: 'Date is required.',
    },
    year: {
      required: 'Year is required.',
    }
};
 // error keys..
  formErrors: any = {
    fromDate: '',
    toDate: '',
    year: '',
};

  isLoading = false;
  //response: IPaginationResponse<any>;

  // ag grid
  columnDefs = [
    { headerName: 'Employee Name ', field: 'employee', menuTabs: ["filterMenuTab"], suppressHeaderMenuButton: true, tooltipField: 'employee' },
    { headerName: 'CNIC ', field: 'cnic', menuTabs: ["filterMenuTab"], suppressHeaderMenuButton: true, tooltipField: 'employee' },
    {
      headerName: 'Transaction Date', field: 'transDate', menuTabs: ["filterMenuTab"], suppressHeaderMenuButton: true, tooltipField: 'employee',
      cellRenderer: (params: any) => {
        const date = params?.data?.transDate != null ? params?.data?.transDate : null;
        return date == null ? null : this.dateHelperService.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Month ',
      field: 'month',
      menuTabs: ["filterMenuTab"],
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (parmas) => {
        console.log({parmas});
        return this.months.find(x => x.value === parmas.value).name
      }
    },
    {headerName: 'Year ', field: 'year', menuTabs: ["filterMenuTab"], suppressHeaderMenuButton: true, tooltipField: 'employee'},
    { headerName: 'BPS ', field: 'bpsName', menuTabs: ["filterMenuTab"], suppressHeaderMenuButton: true, tooltipField: 'employee' },
    { headerName: 'Department ', field: 'department', menuTabs: ["filterMenuTab"], suppressHeaderMenuButton: true, tooltipField: 'employee' },
    { headerName: 'Designation ', field: 'designation', menuTabs: ["filterMenuTab"], suppressHeaderMenuButton: true, tooltipField: 'employee' },
    {
      headerName: 'Basic Pay ',
      field: 'basicSalary',
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Allowance',
      field: 'totalAllowances',
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Gross Pay',
      field: 'grossPay',
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Deductions',
      field: 'totalDeductions',
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Tax Deduction',
      field: 'taxDeduction',
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return params.value ? this.valueFormatter(params.value) : null;
      }
    },
    {
      headerName: 'Net Pay',
      field: 'netSalary',
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      tooltipField: 'employee',
      filter: "agTextColumnFilter",
      menuTabs: ["filterMenuTab"],
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
    },
  ];

  rowData: any = [];
  
  gridOptions: any;;
  tooltipData = 'double click to view details'
  defaultColDef: any

  constructor(
    injector: Injector,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public employeeService: EmployeeService,
    public departmentService: DepartmentService,
    public designationService: DesignationService,
    public ngxsService: NgxsCustomService,
    public bpsService: PayrollItemService,
    public payrollReportService: PayrollReportsService
  ) {
    super(injector);
    this.gridOptions = (({ context: { componentParent: this } }) as GridOptions);
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      sortable: false,
      resizable: true,
    }

    this.transactionReportForm = this.fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      employeeId: [''],
      department: [''],
      designation: [''],
      bps: [''],
      month: [''],
      year: ['', Validators.required],

    });
    // Initializing generalLedger model...
    this.payrollTransitionModel = {
      fromDate: null,
      toDate: null,
      month: null,
      year: null,
      employeeId: '',
      designation: '',
      department: '',
      bps: '',
      IsBankAdvice: false
    }
      this.transactionReportForm.get('fromDate').valueChanges.subscribe((value) => {
      this.dateCondition = this.transactionReportForm.get('toDate').value < this.transactionReportForm.get('fromDate').value
    })

    this.getLatestEmployeeData();

    //Get Data from Store
    this.ngxsService.getEmployeeFromState();
    this.ngxsService.getDepartmentFromState();
    this.ngxsService.getDesignationFromState();
    this.ngxsService.getBasicPayFromState();

  }

  // method to create or edit payroll
  addOrEditPayroll(id?: any) {
    if (id) {
      this.router.navigate(['/' + PAYROLL_TRANSACTION.ID_BASED_ROUTE('details', id)])
    } else {
      this.router.navigate(['/' + PAYROLL_TRANSACTION.CREATE])
    }
  }


  reset() {
    this.rowData = [];
    // for PDF
    this.disability = true;
  }

  onSubmit() {

    if (this.transactionReportForm.invalid) {
      this.logValidationErrors(this.transactionReportForm, this.formErrors, this.validationMessages)
      return;
    }

    this.mapFormValueToModel();
    this.isLoading = true
    this.payrollReportService.getPayrollsReport(this.payrollTransitionModel)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     ).subscribe((res) => {
      this.recordsData = res.result || [];
      this.rowData = res.result || [];
      if (isEmpty(res.result)) {
        this.toastService.info('No Records Found !' , 'Payroll Transaction')
      }

      this.totals = this.calculateTotal(this.recordsData, 'basicSalary', 'totalAllowances', 'grossSalary', 'totalDeductions', 'netSalary');
      // for PDF
      this.disability = (!isEmpty(res.result)) ? false : true;
      this.cdRef.detectChanges()
    });
  }

  // Mapping value from form to model
  mapFormValueToModel() {
    this.payrollTransitionModel.fromDate = this.dateHelperService.transformDate(new Date(this.transactionReportForm.value.fromDate), 'MMM d, y') || '';
    this.payrollTransitionModel.toDate = this.dateHelperService.transformDate(new Date(this.transactionReportForm.value.toDate), 'MMM d, y') || '';
    this.payrollTransitionModel.employeeId = this.transactionReportForm.value.employeeId || '';
    this.payrollTransitionModel.department = this.transactionReportForm.value.department || '';
    this.payrollTransitionModel.designation = this.transactionReportForm.value.designation || '';
    this.payrollTransitionModel.month = this.transactionReportForm.value.month || '';
    this.payrollTransitionModel.year = this.transactionReportForm.value.year || '';
    this.payrollTransitionModel.bps = this.transactionReportForm.value.bps || '';
  }

  getLatestEmployeeData() {
    this.ngxsService.store.dispatch(new IsReloadRequired(EmployeeState , true))
  }
}
