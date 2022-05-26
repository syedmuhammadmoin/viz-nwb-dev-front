import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { PayrollTransactionService } from '../../payroll-transaction/service/payroll-transaction.service';
import { GridApi, GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DesignationService } from '../../designation/service/designation.service';
import { CampusService } from '../../../profiling/campus/service/campus.service';
import { PayrollItemService } from '../../payroll-item/service/payroll-item.service';
import { finalize } from 'rxjs/operators';
import { isEmpty} from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { EmployeeService } from '../../employee/service/employee.service';
import { DepartmentService } from '../../department/service/department.service';
import { PayrollReportsService } from '../service/payroll-reports.service';

@Component({
  selector: 'kt-payroll-trans-report',
  templateUrl: './payroll-trans-report.component.html',
  styleUrls: ['./payroll-trans-report.component.scss']
})

export class PayrollTransReportComponent extends AppComponentBase implements OnInit {

  public permissions: Permissions;
  payrollTransitionReportForm: FormGroup;
  payrollTransitionModel: any;
  employeeTypeList = AppConst.EmployeeType;
  // employee types
  //employeeType = AppConst.EmployeeType;
  dateCondition : boolean
  // data for PDF
  recordsData: any = []
  disability = true
  totals = {};

  // Limit Date
  maxDate = new Date();

  // app const for month
  months = AppConst.Months
 // Validation messages..
  validationMessages = {
    dateFrom: {
      required: 'Date is required.',
    },
    dateTo: {
     required: 'Date is required.',
    },
    year: {
      required: 'Year is required.',
    }
};
 // error keys..
  formErrors = {
    dateFrom: '',
    dateTo: '',
    year: '',
};

  isLoading = false;
  //response: IPaginationResponse<any>;

  // ag grid
  columnDefs = [
    { headerName: 'Employee Title ', field: 'employeeTitle', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee' },
    { headerName: 'Employee Name ', field: 'employee', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee' },
    { headerName: 'CNIC ', field: 'cnic', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee' },
    {
      headerName: 'Transaction Date', field: 'transDate', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee',
      cellRenderer: (params: any) => {
        const date = params?.data?.transDate != null ? params?.data?.transDate : null;
        return date == null ? null : this.dateHelperService.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Month ',
      field: 'month',
      menuTabs: ["filterMenuTab"],
      filter: true,
      tooltipField: 'employee',
      valueFormatter: (parmas) => {
        console.log({parmas});
        return this.months.find(x => x.value === parmas.value).name
      }
    },
    {headerName: 'Year ', field: 'year', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee'},
    {
      headerName: 'Last Updated', field: 'modifiedDate', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee',
      cellRenderer: (params: any) => {
        const date = params?.data?.modifiedDate != null ? params?.data?.modifiedDate : null;
        return date == null ? null : this.dateHelperService.transformDate(date, 'MMM d, y');
      }
    },
    { headerName: 'BPS ', field: 'bps', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee' },
    { headerName: 'Department ', field: 'department', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee' },
    { headerName: 'Designation ', field: 'designation', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee' },
    { headerName: 'Campus ', field: 'campus', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'employee' },
    {
      headerName: 'Basic Pay ',
      field: 'basicSalary',
      filter: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Allowance',
      field: 'totalAllowances',
      filter: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Gross Pay',
      field: 'grossSalary',
      filter: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Deductions',
      field: 'totalDeductions',
      filter: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Tax',
      field: 'taxDeduction',
      filter: true,
      tooltipField: 'employee',
      valueFormatter: (params) => {
        return params.value ? this.valueFormatter(params.value) : null;
      }
    },
    {
      headerName: 'Net Pay',
      field: 'netSalary',
      filter: true,
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
  frameworkComponents: any;
  gridOptions: GridOptions;
  tooltipData = 'double click to view details'
  defaultColDef: any
  private paginationPageSize = 10;
  private gridApi: GridApi;

  constructor(
    injector: Injector,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    public employeeService: EmployeeService,
    public departmentService: DepartmentService,
    public designationService: DesignationService,
    public bpsService: PayrollItemService,
    public campusService: CampusService,
    public payrollReportService: PayrollReportsService
   // public PrintPayrollTransactionService: PrintPayrollTransactionReportService
  ) {
    super(injector);
    this.gridOptions = (({ context: { componentParent: this } }) as GridOptions);
    //this.employeeTypeList = Object.keys(this.employeeType).filter(f => !isNaN(Number(f)));
  }

  get PaginationPageSize(): number {
    return this.paginationPageSize;
  }

  get gridAPI(): GridApi {
    return this.gridApi;
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
  //ag grid ends

  onRowDoubleClicked(event: any) {

  }

  ngOnInit(): void {
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      resizable: true,
    }

    this.payrollTransitionReportForm = this.fb.group({
      dateFrom: ['', [Validators.required]],
      dateTo: ['', [Validators.required]],
      employeeName: [''],
      department: [''],
      designation: [''],
      employeeType: [''],
      campus: [''],
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
      employeeType: '',
      designation: '',
      department: '',
      campus: '',
      bps: '',
      IsBankAdvice: false
    }
    this.payrollTransitionReportForm.get('dateFrom').valueChanges.subscribe((value) => {
      this.dateCondition = this.payrollTransitionReportForm.get('dateTo').value < this.payrollTransitionReportForm.get('dateFrom').value
      // this.invoiceForm.get('dueDate').enable()
    })

  }

  // method to create or edit payroll
  addOrEditPayroll(id?: any) {
    if (id) {
      this.router.navigate([`/payroll/transaction/detail/${id}`])
    } else {
      this.router.navigate(['/payroll/transaction/create'])
    }
  }
  // handling dueDate logic


  reset() {
    this.rowData = [];
    // for PDF
    this.disability = true;
  }

  onSubmit() {

    if (this.payrollTransitionReportForm.invalid) {
      this.logValidationErrors(this.payrollTransitionReportForm, this.formErrors, this.validationMessages)
      this.payrollTransitionReportForm.markAsTouched();
      return;
    }

    this.mapFormValueToModel();
    console.log('model', this.payrollTransitionModel);
    this.isLoading = true
    this.payrollReportService.getPayrollsReport(this.payrollTransitionModel).pipe(
      finalize(() => {
        this.cdRef.detectChanges();
      })
    ).subscribe((res) => {
      this.recordsData = res.result || [];
      this.rowData = res.result;
      console.log(res.result, " result")
      this.totals = this.calculateTotal(this.recordsData, 'basicSalary', 'totalAllowances', 'grossSalary', 'totalDeductions', 'netSalary')
      this.isLoading = false;
      // for PDF
      (!isEmpty(res.result)) ? this.disability = false : this.disability = true;
    });
  }

  // Mapping value from form to model
  mapFormValueToModel() {
    console.log()
    this.payrollTransitionModel.fromDate = this.dateHelperService.transformDate(new Date(this.payrollTransitionReportForm.value.dateFrom), 'MMM d, y') || '';
    this.payrollTransitionModel.toDate = this.dateHelperService.transformDate(new Date(this.payrollTransitionReportForm.value.dateTo), 'MMM d, y') || '';
    this.payrollTransitionModel.employeeId = this.payrollTransitionReportForm.value.employeeName || '';
    this.payrollTransitionModel.employeeType = this.payrollTransitionReportForm.value.employeeType || '';
    this.payrollTransitionModel.department = this.payrollTransitionReportForm.value.department || '';
    this.payrollTransitionModel.designation = this.payrollTransitionReportForm.value.designation || '';
    this.payrollTransitionModel.campus = this.payrollTransitionReportForm.value.campus || '';
    this.payrollTransitionModel.month = this.payrollTransitionReportForm.value.month || '';
    this.payrollTransitionModel.year = this.payrollTransitionReportForm.value.year || '';
    this.payrollTransitionModel.bps = this.payrollTransitionReportForm.value.bps || '';
  }

  // PDF Content
  contentData() {
    // const data = [
    //   {
    //     text: 'UNIVERSITY OF SINDH',
    //     bold: true,
    //     fontSize: 10,
    //     alignment: 'center',
    //     // color: 'lightblue',
    //     margin: [0, 35, 0, 10]
    //   },
    //   {
    //     text: 'PAYROLL TRANSACTION REPORT',
    //     bold: true,
    //     decoration: 'underline',
    //     fontSize: 20,
    //     alignment: 'center',
    //     // color: 'green',
    //     margin: [0, 5, 0, 10]
    //   },
    //   {
    //     text: 'Report for Month : ' + ((this.payrollTransitionReportForm.value.month) ? AppConst.Months[this.payrollTransitionReportForm.value.month - 1].name : '-') + ' & Year : ' + this.payrollTransitionReportForm.value.year,
    //     alignment: 'center',
    //     fontSize: 12,
    //     margin: [0, 0, 0, 10]
    //   },
    //   {
    //     text: 'Employee : ' + (this.payrollTransitionReportForm.value.employeeName || 'All'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Department : ' + (this.payrollTransitionReportForm.value.department || 'All'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Campus : ' + (this.payrollTransitionReportForm.value.campus || 'All'),
    //     fontSize: 10,
    //     margin: [0, 0, 0, 30]
    //   },
    //   {
    //     table: {
    //       headerRows: 1,
    //       widths: [23, 39, 39, 39, 30, 44, 43, 38, 39, 39, 39, 42, 39],
    //       body: [
    //         [
    //           {
    //             text: 'S.No',
    //             style: 'tableHeader',
    //             fontSize: 8,
    //             alignment: 'center'
    //           },
    //           {
    //           text: 'Employee Title',
    //           style: 'tableHeader',
    //           fontSize:8
    //           // margin: [10, 5, 10, 5]
    //           },
    //           {
    //             text: 'Employee Name',
    //             style: 'tableHeader',
    //             fontSize:8
    //           },
    //           {
    //             text: 'CNIC',
    //             style: 'tableHeader',
    //             // margin: [36, 5, 130, 5]
    //             fontSize:8
    //           },
    //           {
    //             text: 'BPS',
    //             style: 'tableHeader',
    //             fontSize: 8
    //            // alignment: 'center',

    //           },
    //           {
    //             text: 'Department',
    //             style: 'tableHeader',
    //             fontSize: 8
    //            // alignment: 'center',

    //           },
    //           {
    //             text: 'Designation',
    //             style: 'tableHeader',
    //             fontSize: 8
    //             //alignment: 'center',

    //           },
    //           {
    //             text: 'Campus',
    //             style: 'tableHeader',
    //             fontSize: 8
    //             //alignment: 'center',

    //           },
    //           {
    //             text: 'Basic Pay',
    //             style: 'tableHeader',
    //             fontSize: 8,
    //             alignment: 'center',

    //           },
    //           {
    //             text: 'Allowance',
    //             style: 'tableHeader',
    //             fontSize: 8,
    //             alignment: 'center',

    //           },
    //           {
    //             text: 'Gross Pay',
    //             style: 'tableHeader',
    //             fontSize: 8,
    //             alignment: 'center',

    //           },
    //           {
    //             text: 'Deductions',
    //             style: 'tableHeader',
    //             fontSize: 8,
    //             alignment: 'center',

    //           },
    //           {
    //             text: 'Net Pay',
    //             style: 'tableHeader',
    //             fontSize: 8,
    //             alignment: 'center',

    //           },

    //         ],
    //         ...this.recordsData.map((val, index) => {
    //           return [
    //             { text: index + 1, fontSize: 7, alignment: 'center' },
    //             { text: val.employeeTitle, fontSize: 7 },
    //             { text: val.employee, fontSize: 7 },
    //             { text: val.cnic, fontSize: 5 },
    //             { text: val.bps , fontSize: 7 },
    //             { text: val.department, fontSize: 7 },
    //             { text: val.designation, fontSize: 7 },
    //             { text: val.campus, fontSize: 7 },
    //             { text: this.valueFormatter(val.basicSalary), fontSize: 7,  alignment: 'center' },
    //             { text: this.valueFormatter(val.totalAllowances), fontSize: 7,  alignment: 'center' },
    //             { text: this.valueFormatter(val.grossSalary), fontSize: 7,  alignment: 'center' },
    //             { text: this.valueFormatter(val.totalDeductions), fontSize: 7,  alignment: 'center' },
    //             { text: this.valueFormatter(val.netSalary) , fontSize: 7,  alignment: 'center' }
    //           ]
    //         })
    //       ],
    //     },
    //     layout: {
    //       paddingTop() {
    //         return 10
    //       },
    //       paddingLeft() {
    //         return 10
    //       },
    //       // paddingRight: function (i) { return (i === 1 || i === 2) ? 10 : 5 },
    //       paddingRight() {
    //         return 10
    //       },
    //       paddingBottom() {
    //         return 10
    //       }
    //     },
    //   },
    //   {
    //     table: {
    //       headerRows: 1,
    //       widths: [433, 43, 43, 43, 43, 43],
    //       body: [
    //         [
    //           {
    //             text: 'Total (Rs)',
    //             fontSize: 9
    //           },
    //           {
    //             text: this.valueFormatter(this.totals['basicSalary']),
    //             alignment: 'center',
    //             fontSize: 8
    //           },
    //           {
    //             text: this.valueFormatter(this.totals['totalAllowances']),
    //             alignment: 'center',
    //             fontSize: 8
    //           },
    //           {
    //             text: this.valueFormatter(this.totals['grossSalary']),
    //             alignment: 'center',
    //             fontSize: 8
    //           },
    //           {
    //             text: this.valueFormatter(this.totals['totalDeductions']),
    //             alignment: 'center',
    //             fontSize: 8
    //           },
    //           {
    //             text: this.valueFormatter(this.totals['netSalary']),
    //             alignment: 'center',
    //             fontSize: 8
    //           }
    //         ],
    //       ],
    //     },
    //     layout: {
    //       //hLineWidth: function () { return 0; },
    //       hLineWidth: function (i) {
    //         return (i === 1) ? 1 : 0;
    //       },
    //       vLineWidth: function () {
    //         return 0;
    //       },
    //       paddingTop: function () {
    //         return 10
    //       },
    //       paddingLeft: function () {
    //         return 10
    //       },
    //       paddingRight: function () {
    //         return 10
    //       },
    //       paddingBottom: function () {
    //         return 10
    //       },
    //     }
    //   }
    // ]
    // return data
  }

  calculateTotal(res: any, ...keys): {} {
    const objectToReturn = {}
    keys.forEach((key) => {
      res.map((item) => {
        if (objectToReturn[key]) {
          objectToReturn[key] += item[key]
        } else {
          objectToReturn[key] = item[key]
        }
      })
    })
    return objectToReturn
  }


  printPayrollTransactions(rowData: any) {
    // console.log('usama', rowData);
    // this.payrollReportService.setData(rowData);
    // this.router.navigate(['/payroll/transaction-report/print'], {
    //   queryParams: {
    //     fromDate: this.dateHelperService.transformDate(new Date(this.payrollTransitionReportForm.value.dateFrom), 'MMM d, y') || '',
    //     toDate: this.dateHelperService.transformDate(new Date(this.payrollTransitionReportForm.value.dateTo), 'MMM d, y') || '',
    //     employeeName: this.payrollTransitionReportForm.value.employeeName || 'All',
    //     employeeType: this.payrollTransitionReportForm.value.employeeType || 'All',
    //     department: this.payrollTransitionReportForm.value.department || 'All',
    //     designation: this.payrollTransitionReportForm.value.designation || 'All',
    //     campus: this.payrollTransitionReportForm.value.campus || 'All',
    //     month: this.payrollTransitionReportForm.value.month || 'All',
    //     year: this.payrollTransitionReportForm.value.year || 'All',
    //     bps: this.payrollTransitionReportForm.value.bps || 'All',
    //   }})
 }
}






