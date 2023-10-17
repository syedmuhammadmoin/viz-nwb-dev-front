import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GridApi, GridOptions } from 'ag-grid-community';
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
  selector: 'kt-payroll-trans-detail-report',
  templateUrl: './payroll-trans-detail-report.component.html',
  styleUrls: ['./payroll-trans-detail-report.component.scss']
})

export class PayrollTransDetailReportComponent extends AppComponentBase implements OnInit {

  public permissions: Permissions;
  transactionDetailReportForm: FormGroup;
  transactionDetailModel: any;
  employeeTypeList = AppConst.EmployeeType;
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
  formErrors = {
    fromDate: '',
    toDate: '',
    year: '',
};

  isLoading = false;
  //response: IPaginationResponse<any>;

  // ag grid
  columnDefs = [
    { headerName: 'Employee Name ', field: 'employee', menuTabs: ["filterMenuTab"], suppressMenu: true, tooltipField: 'employee' },
    { headerName: 'Department ', field: 'department', menuTabs: ["filterMenuTab"], suppressMenu: true, tooltipField: 'employee' },
    { headerName: 'Designation ', field: 'designation', menuTabs: ["filterMenuTab"], suppressMenu: true, tooltipField: 'employee' },
    { headerName: 'Campus ', field: 'campus', menuTabs: ["filterMenuTab"], suppressMenu: true, tooltipField: 'employee' },
  ];

  rowData: any = [];
  frameworkComponents: any;
  gridOptions: GridOptions;
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
      resizable: true,
    }

    this.transactionDetailReportForm = this.fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      employeeId: [''],
      department: [''],
      designation: [''],
      campus: [''],
      month: [''],
      year: ['', Validators.required],

    });
    // Initializing generalLedger model...
    this.transactionDetailModel = {
      fromDate: null,
      toDate: null,
      month: null,
      year: null,
      employeeId: '',
      designation: '',
      department: '',
      campus: '',
    }
      this.transactionDetailReportForm.get('fromDate').valueChanges.subscribe((value) => {
      this.dateCondition = this.transactionDetailReportForm.get('toDate').value < this.transactionDetailReportForm.get('fromDate').value
    })

    this.getLatestEmployeeData();

    //Get Data from Store
    this.ngxsService.getDepartmentFromState();
    this.ngxsService.getDesignationFromState();
    this.ngxsService.getEmployeeFromState();
    this.ngxsService.getCampusFromState();
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

    if (this.transactionDetailReportForm.invalid) {
      this.logValidationErrors(this.transactionDetailReportForm, this.formErrors, this.validationMessages)
      return;
    }

    this.mapFormValueToModel();
    this.isLoading = true
    this.payrollReportService.getTransDetailReport(this.transactionDetailModel)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     ).subscribe((res) => {
      let newColumnDef = [];
      this.rowData = res.result || [];

      Object.keys(this.rowData[0])
        .forEach((x) => {
          if (["employee", "department", "campus", "designation"].includes(x) == false) {
            newColumnDef.push(
              {
                headerName: x.toUpperCase(),
                field: x,
                menuTabs: ['filterMenuTab'],
                filter: true,
                tooltipField: 'employee',
                valueFormatter: (params) => {
                  return this.valueFormatter(params.value)
                }
              }
            )
          }
        })
      newColumnDef = [...this.columnDefs, ...newColumnDef];
      this.gridApi.setColumnDefs(newColumnDef);
      if (isEmpty(res.result)) {
        this.toastService.info('No Records Found !' , 'Payroll Transaction')
      }

      // for PDF
      this.disability = (!isEmpty(res.result)) ? false : true;
      this.cdRef.detectChanges()
    });
  }

  // Mapping value from form to model
  mapFormValueToModel() {
    console.log(this.transactionDetailReportForm.value.campus)
    this.transactionDetailModel.fromDate = this.dateHelperService.transformDate(new Date(this.transactionDetailReportForm.value.fromDate), 'MMM d, y') || '';
    this.transactionDetailModel.toDate = this.dateHelperService.transformDate(new Date(this.transactionDetailReportForm.value.toDate), 'MMM d, y') || '';
    this.transactionDetailModel.employeeId = this.transactionDetailReportForm.value.employeeId || '';
    this.transactionDetailModel.department = this.transactionDetailReportForm.value.department || '';
    this.transactionDetailModel.designation = this.transactionDetailReportForm.value.designation || '';
    this.transactionDetailModel.month = this.transactionDetailReportForm.value.month || '';
    this.transactionDetailModel.year = this.transactionDetailReportForm.value.year || '';
    this.transactionDetailModel.campus = this.transactionDetailReportForm.value.campus || '';
  }

  getLatestEmployeeData() {
    this.ngxsService.store.dispatch(new IsReloadRequired(EmployeeState , true))
  }
}
