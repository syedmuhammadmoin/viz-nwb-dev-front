import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { finalize} from 'rxjs/operators';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty} from 'lodash';
import { Router } from '@angular/router';
import { APP_ROUTES, PAYROLL_REPORT, REPORT } from 'src/app/views/shared/AppRoutes';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { PayrollReportsService } from '../service/payroll-reports.service';
import { AppConst } from 'src/app/views/shared/AppConst';

function sumFunc(params) {
  // let sum = 0;
  if (params && params.values) {
    this.balance = params?.values[params?.values?.length - 1]
  }
  return this.balance;
}



@Component({
  selector: 'kt-payroll-executive-report',
  templateUrl: './payroll-executive-report.component.html',
  styleUrls: ['./payroll-executive-report.component.scss']
})

export class PayrollExecutiveReportComponent extends AppComponentBase implements OnInit {
  // for permissions 
  public permissions = Permissions;

  // app const for month
  months = AppConst.Months

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  constructor(
    // Injecting services in constructor
    private fb: FormBuilder,   
    private payrollReportService: PayrollReportsService,
    private cdRef: ChangeDetectorRef,   
    public addButtonService: AddModalButtonService,
    private router: Router,
    public ngxsService: NgxsCustomService,
    private injector: Injector
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Payroll Item', 
        field: 'payrollItem',  
        cellStyle: {textAlign : 'left'}
      },
      {
        headerName: 'Payroll Item Type', 
        field: 'payrollType',  
        cellStyle: {textAlign : 'left'},
        valueFormatter: (params: any) => {
          return AppConst.PayrollType[params.value].value
        }
      },
      {
        headerName: 'Amount',
        field: 'amount',
        suppressMenu: true,
        valueFormatter: (params: any) => {
          return this.valueFormatter(params.value)
        }
      }   
    ];
  }

  // gridOptions: GridOptions;

  autoGroupColumnDef;
  openingBalance = 0;
  balance = 0;
  columnDefs;
  defaultColDef: any

  // data for PDF
  recordsData: any = []
  disability = true

  //Busy Loading
  isLoading: boolean;

  //Limit Date
  maxDate : Date = new Date()
  
  // Declaring FormGroup
  payrollExecutiveForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  rowData: any[] = [];

  // Declaring Model
  // Initializing payrollExecutive model...
  payrollExecutiveModel: any = {};
  // Validation Messages
  validationMessages = {
    year: {
      required: 'Year is required.'
    }
  }

  // Error keys for validation messages
  formErrors = {
    year: ''
  }
  private formSubmitAttempt = true;


  ngOnInit() {
    // AG Grid Options
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };

    //Initializing Form Group
    this.payrollExecutiveForm = this.fb.group({
      campus: [''],
      payrollItem: [''],
      month: [''],
      year: ['' ,[Validators.required]]
    });

    //Get Campuses from state
      this.ngxsService.getCampusFromState();
    //Get Product from state
    this.ngxsService.getPayrollItemsFromState();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onSubmit() {
    if (this.payrollExecutiveForm.invalid) {
      this.logValidationErrors(this.payrollExecutiveForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapFormValueToModel();
    console.log(this.payrollExecutiveModel);
    this.isLoading = true;
    this.payrollReportService.getExecutiveSummary(this.payrollExecutiveModel).pipe(
      finalize(() => {
        this.columnDefs = [
          {
            headerName: 'Payroll Item', 
            field: 'payrollItem',  
            cellStyle: {textAlign : 'left'}
          },
          {
            headerName: 'Payroll Item Type', 
            field: 'payrollType',  
            cellStyle: {textAlign : 'left'},
            valueFormatter: (params: any) => {
              return AppConst.PayrollType[params.value].value
            }
          },
          {
            headerName: 'Amount',
            field: 'amount',
            suppressMenu: true,
            valueFormatter: (params: any) => {
              return this.valueFormatter(params.value)
            }
          }   
        ];
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    ).subscribe((res) => {
      this.rowData = res.result.payrollItems;
      this.recordsData = res.result;
      // for PDF
      this.disability = (!isEmpty(res.result)) ? false : true;
      if (isEmpty(res.result)) {
        this.toastService.info('No Records Found !' , 'Payroll Executive Summary')
      }
    });
  }

  reset() {
    this.formDirective.resetForm();
    this.formSubmitAttempt = false;
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    // for PDF
    this.disability = true;
  }

  // Mapping value from form to model
  mapFormValueToModel() {
    this.payrollExecutiveModel.campus = this.payrollExecutiveForm.value.campus || '';
    this.payrollExecutiveModel.payrollItem = this.payrollExecutiveForm.value.payrollItem || '';
    this.payrollExecutiveModel.month = this.payrollExecutiveForm.value.month || '';
    this.payrollExecutiveModel.year = this.payrollExecutiveForm.value.year || '';
  }

  printPayrollExecutive() {
    this.payrollReportService.setPayrollDataForPrintComponent(this.recordsData);

      this.router.navigate(['/' + APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.EXECUTIVE + '/' + REPORT.PRINT], {
        queryParams: {
          campus: (this.payrollExecutiveForm.value.campus),
          months: JSON.stringify(this.payrollExecutiveForm.value.month),
          year: (this.payrollExecutiveForm.value.year),
        }
      })
  }

  // PDF Content
  // contentData() {
  //   const data = [
  //     {
  //       text: 'VIZALYS',
  //       bold: true,
  //       fontSize: 10,
  //       alignment: 'center',
  //       // color: 'lightblue',
  //       margin: [0, 35, 0, 10]
  //     },
  //     {
  //       text: 'GENERAL LEDGER REPORT',
  //       bold: true,
  //       decoration: 'underline',
  //       fontSize: 20,
  //       alignment: 'center',
  //       // color: 'green',
  //       margin: [0, 5, 0, 10]
  //     },
  //     {
  //       text: 'Report for : ' + this.transformDate(this.payrollExecutiveForm.value.docDate, 'MMM d, y') + ' - ' + this.transformDate(this.payrollExecutiveForm.value.docDate2, 'MMM d, y'),
  //       alignment: 'center',
  //       fontSize: 12,
  //       margin: [0, 0, 0, 10]
  //     },
  //     {
  //       text: 'Business Partner : ' + (this.payrollExecutiveForm.value.businessPartnerName || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Account : ' + (this.payrollExecutiveForm.value.accountName || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Department : ' + (this.payrollExecutiveForm.value.department || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Location : ' + (this.payrollExecutiveForm.value.location || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Warehouse : ' + (this.payrollExecutiveForm.value.warehouse || 'N/A'),
  //       fontSize: 10,
  //       margin: [0, 0, 0, 30]
  //     },
  //     {
  //       table: {
  //         widths: [70, 180, 180, 70, 70, 70],
  //         body: [
  //           [{
  //             text: 'Doc#',
  //             style: 'tableHeader',
  //             // margin: [10, 5, 10, 5]
  //           },
  //             {
  //               text: 'Account',
  //               style: 'tableHeader'
  //             },
  //             {
  //               text: 'Description',
  //               style: 'tableHeader',
  //               // margin: [36, 5, 130, 5]
  //             },
  //             {
  //               text: 'Debit',
  //               style: 'tableHeader',
  //               alignment: 'right'
  //             },
  //             {
  //               text: 'Credit',
  //               style: 'tableHeader',
  //               alignment: 'right'
  //             },
  //             {
  //               text: 'Balance',
  //               style: 'tableHeader',
  //               alignment: 'right'
  //             },
  //           ],
  //           ...this.recordsData.map((val) => {
  //             return [
  //               val.docNo,
  //               val.accountName,
  //               val.description,
  //               {text: this.valueFormatter(val.debit), alignment: 'right'},
  //               {text: this.valueFormatter(val.credit), alignment: 'right'},
  //               {text: this.valueFormatter(val.balance), alignment: 'right'}]
  //           })
  //         ],
  //       },
  //       layout: {
  //         paddingTop () {
  //           return 10
  //         },
  //         paddingLeft () {
  //           return 10
  //         },
  //         // paddingRight: function (i) { return (i === 1 || i === 2) ? 10 : 5 },
  //         paddingRight () {
  //           return 10
  //         },
  //         paddingBottom () {
  //           return 10
  //         }
  //       }
  //     }
  //   ]
  //   return data
  // }
}



