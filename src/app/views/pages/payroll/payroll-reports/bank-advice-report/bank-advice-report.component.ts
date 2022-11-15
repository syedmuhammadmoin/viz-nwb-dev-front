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

@Component({
  selector: 'kt-bank-advice-report',
  templateUrl: './bank-advice-report.component.html',
  styleUrls: ['./bank-advice-report.component.scss']
})
export class BankAdviceReportComponent extends AppComponentBase implements OnInit {
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
        headerName: 'Employee Name', 
        field: 'employeeName',  
        cellStyle: {textAlign : 'left'}
      },
      {
        headerName: 'Bank', 
        field: 'bankName',  
        cellStyle: {textAlign : 'left'}
      },
      {
        headerName: 'Branch', 
        field: 'branchName',  
        cellStyle: {textAlign : 'left'},
      },
      {
        headerName: 'Account No',
        field: 'accountNumber',
        cellStyle: {textAlign : 'left'},
        suppressMenu: true
      },   
      {
        headerName: 'Amount',
        field: 'amount',
        suppressMenu: true,
        headerClass: 'custom_left',
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
  bankAdviceReportForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  rowData: any[] = [];

  // Declaring Model
  // Initializing bank Advice model...
  bankAdviceModel: any = {};
  // Validation Messages
  validationMessages = {
    campusId: {
      required: 'Campus is required.'
    },
    month: {
      required: 'Month is required.'
    },
    year: {
      required: 'Year is required.'
    }
  }

  // Error keys for validation messages
  formErrors = {
    campusId: '',
    month: '',
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
    this.bankAdviceReportForm = this.fb.group({
      campusId: [null ,[Validators.required]],
      month: [null ,[Validators.required]],
      year: [null ,[Validators.required]]
    });

    //Get Campuses from state
      this.ngxsService.getCampusFromState();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onSubmit() {
    if (this.bankAdviceReportForm.invalid) {
      this.logValidationErrors(this.bankAdviceReportForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapFormValueToModel();
    this.isLoading = true;
    this.payrollReportService.getBankAdviceReport(this.bankAdviceModel).pipe(
      finalize(() => {
        this.columnDefs = [
          {
            headerName: 'Employee Name', 
            field: 'employeeName',  
            cellStyle: {textAlign : 'left'}
          },
          {
            headerName: 'Bank', 
            field: 'bankName',  
            cellStyle: {textAlign : 'left'}
          },
          {
            headerName: 'Branch', 
            field: 'branchName',  
            cellStyle: {textAlign : 'left'},
          },
          {
            headerName: 'Account No',
            field: 'accountNumber',
            cellStyle: {textAlign : 'left'},
            suppressMenu: true
          },   
          {
            headerName: 'Amount',
            field: 'amount',
            suppressMenu: true,
            headerClass: 'custom_left',
            valueFormatter: (params: any) => {
              return this.valueFormatter(params.value)
            }
          }   
        ];
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    ).subscribe((res) => {
      this.rowData = res.result;
      this.recordsData = res.result;
      // for PDF
      this.disability = (!isEmpty(res.result)) ? false : true;
      if (isEmpty(res.result)) {
        this.toastService.info('No Records Found !' , 'Bank Advice Report')
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
    this.bankAdviceModel.campusId = this.bankAdviceReportForm.value.campusId?.id || null;
    this.bankAdviceModel.month = this.bankAdviceReportForm.value.month?.value || null;
    this.bankAdviceModel.year = this.bankAdviceReportForm.value.year;
  }

  printBankAdviceReport() {
    this.payrollReportService.setBankAdviceDataForPrintComponent(this.recordsData);

      this.router.navigate(['/' + APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.BANK_ADVICE + '/' + REPORT.PRINT], {
        queryParams: {
          campus: (this.bankAdviceReportForm.value.campusId?.name),
          month: JSON.stringify(this.bankAdviceReportForm.value.month?.name),
          year: (this.bankAdviceReportForm.value.year),
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
  //       text: 'Report for : ' + this.transformDate(this.bankAdviceReportForm.value.docDate, 'MMM d, y') + ' - ' + this.transformDate(this.bankAdviceReportForm.value.docDate2, 'MMM d, y'),
  //       alignment: 'center',
  //       fontSize: 12,
  //       margin: [0, 0, 0, 10]
  //     },
  //     {
  //       text: 'Business Partner : ' + (this.bankAdviceReportForm.value.businessPartnerName || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Account : ' + (this.bankAdviceReportForm.value.accountName || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Department : ' + (this.bankAdviceReportForm.value.department || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Location : ' + (this.bankAdviceReportForm.value.location || 'N/A'),
  //       fontSize: 10,
  //     },
  //     {
  //       text: 'Warehouse : ' + (this.bankAdviceReportForm.value.warehouse || 'N/A'),
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





