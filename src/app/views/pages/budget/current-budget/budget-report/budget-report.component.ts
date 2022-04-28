import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BusinessPartnerService} from 'src/app/views/pages/profiling/business-partner/service/businessPartner.service';
import { CategoryService} from 'src/app/views/pages/profiling/category/service/category.service';
import { GridOptions, ValueFormatterParams} from 'ag-grid-community';
import { finalize} from 'rxjs/operators';
import { DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { DepartmentService} from 'src/app/views/pages/profiling/department/service/department.service';
import { LocationService} from 'src/app/views/pages/profiling/location/service/location.service';
import { WarehouseService} from 'src/app/views/pages/profiling/warehouse/services/warehouse.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { isEmpty} from 'lodash';
import { AppConst } from 'src/app/views/shared/AppConst';
import { BudgetService } from '../service/budget.service';
import { IBudgetReport } from '../model/IBudgetReport';

@Component({
  selector: 'kt-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss']
})

export class BudgetReportComponent  extends AppComponentBase implements OnInit {

  // for permissions 
  public permissions = Permissions;

  constructor(
    // Injecting services in constructor
    private fb: FormBuilder,   
    private _budgetService: BudgetService,
    private cdRef: ChangeDetectorRef,   
    public ngxsService: NgxsCustomService,
    private injector: Injector
  ) {
    super(injector);

    this.defaultColDef = {
      resizable: true,
    };
    this.columnDefs = [
      {headerName: 'Account Name', field: 'accountName', sortable: true, filter: true, rowGroup: true, hide: true},
      {headerName: 'Date', field: 'docDate', sortable: true, filter: true},
      {headerName: 'Document No', field: 'docNo', sortable: true, filter: true},
      {
        headerName: 'Document Type', 
        field: 'docType', 
        sortable: true, 
        filter: true,
        valueFormatter: (params: ValueFormatterParams) => {
          return DocType[params.value]
        } 
      },
      {headerName: 'Description', field: 'description', filter: true},
      {headerName: 'Debit', field: 'debit', sortable: true, filter: true},
      {headerName: 'Credit', field: 'credit', sortable: true, filter: true},
      {headerName: 'Balance', colId: 'balance'}
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
  budgetReportForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  rowData: IBudgetReport[] = [];

  // Declaring Model
  // Initializing budgetReport model...
  budgetReportModel: IBudgetReport = {} as IBudgetReport
  // Validation Messages
  validationMessages = {
    docDate: {
      required: 'Start Date is required.'
    },
    docDate2: {
      required: 'End Date is required.'
    }
  }

  // Error keys for validation messages
  formErrors = {
    docDate: '',
    docDate2: ''
  }
  private formSubmitAttempt = true;

  onRowDoubleClicked($event: any) {
  }

  ngOnInit() {
    // AG Grid Options
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.suppressAggFuncInHeader = true;
   

    this.autoGroupColumnDef = {
      headerName: 'Account',
      minWidth: 300,
      cellRendererParams: {
        suppressCount: true,
        checkbox: false,
      },
    }

    // initializing formGroup
    this.budgetReportForm = this.fb.group({
      docDate: ['', [Validators.required]],
      docDate2: ['', [Validators.required]],
      accountName: [''],
      businessPartnerName: [''],
      // organization: [''],
      // department: [''],
      warehouseName: [''],
      campusName : ['']
      //location: ['']
    });

     // get customer from state
     this.ngxsService.getBusinessPartnerFromState();   
     // get Ware house location from state
     this.ngxsService.getWarehouseFromState();    
     // get Accounts of level 4 from state
     this.ngxsService.getAccountLevel4FromState()
      // get Campuses from state
     this.ngxsService.getCampusFromState()
     // get location from state
     //this.ngxsService.getLocationFromState();
     // get department from state
     //this.ngxsService.getDepatmentFromState();

   

  }

  onSubmit() {
    if (this.budgetReportForm.invalid) {
      this.logValidationErrors(this.budgetReportForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapFormValueToModel();
    // console.log(this.budgetReportModel);
    this.isLoading = true;
    this._budgetService.getBudgetReport(this.budgetReportModel).pipe(
      finalize(() => {
        this.columnDefs = [
          {headerName: 'Account Name', field: 'accountName', sortable: true, filter: true, rowGroup: true, hide: true},
          {
            headerName: 'Date', field: 'docDate', sortable: true, filter: true, cellStyle: {textAlign : 'left'},
            cellRenderer: (params: any) => {
              // console.log(params);
              const date = params?.data?.docDate != null ? params?.data?.docDate : null;
              return date == null ? null : this.transformDate(date, 'MMM d, y');
            }
          },
          {headerName: 'Document No', field: 'docNo', sortable: true, filter: true, cellStyle: {textAlign : 'left'}},
          {
            headerName: 'Document Type', 
            field: 'docType', 
            sortable: true, 
            filter: true, 
            cellStyle: {textAlign : 'left'},
            valueFormatter: (params: ValueFormatterParams) => {
              return DocType[params.value]
              // return (params.value || params.value === 0) ? AppConst.Documents.find(x => x.id === params.value).value : null
            } 

          },
          {headerName: 'Description', field: 'description', filter: true, cellStyle: {textAlign : 'left'}},
          // {
          //   headerName: 'Balance',
          //   field: 'balance',
          //   aggFunc: sumFunc.bind(this),
          //   colId: 'balance',
          //   valueFormatter: (params) => {
          //     return this.valueFormatter(params.value)
          //   }
          // }
        ];
        this.cdRef.detectChanges();
      })
    ).subscribe((res) => {
      this.rowData = res.result;
      this.recordsData = res.result;
      // for PDF
      (!isEmpty(res.result)) ? this.disability = false : this.disability = true;
      if (isEmpty(res.result)) {
        this.toastService.info('No Records Found !' , 'Budget Report')
      }
      this.isLoading = false;
      
    });
  }

  reset() {
    this.formSubmitAttempt = false;
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    // for PDF
    this.disability = true;
  }

  // Mapping value from form to model
  mapFormValueToModel() {
    // this.budgetReportModel.docDate = this.formatDate(this.budgetReportForm.value.docDate) || '';
    // this.budgetReportModel.docDate2 = this.formatDate(this.budgetReportForm.value.docDate2) || '';
    // this.budgetReportModel.accountName = this.budgetReportForm.value.accountName || '';
    // this.budgetReportModel.businessPartnerName = this.budgetReportForm.value.businessPartnerName || '';
    // this.budgetReportModel.warehouseName = this.budgetReportForm.value.warehouseName || '';
    // this.budgetReportModel.campusName = this.budgetReportForm.value.campusName || '';
    // this.budgetReportModel.location = this.budgetReportForm.value.location || '';
    // this.budgetReportModel.department = this.budgetReportForm.value.department || '';
    // this.budgetReportModel.warehouse = this.budgetReportForm.value.warehouse || '';
    // this.budgetReportModel.organization = this.budgetReportForm.value.organization || '';
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  // PDF Content
  contentData() {
    // const data = [
    //   {
    //     text: 'VIZALYS',
    //     bold: true,
    //     fontSize: 10,
    //     alignment: 'center',
    //     // color: 'lightblue',
    //     margin: [0, 35, 0, 10]
    //   },
    //   {
    //     text: 'GENERAL LEDGER REPORT',
    //     bold: true,
    //     decoration: 'underline',
    //     fontSize: 20,
    //     alignment: 'center',
    //     // color: 'green',
    //     margin: [0, 5, 0, 10]
    //   },
    //   {
    //     text: 'Report for : ' + this.transformDate(this.budgetReportForm.value.docDate, 'MMM d, y') + ' - ' + this.transformDate(this.budgetReportForm.value.docDate2, 'MMM d, y'),
    //     alignment: 'center',
    //     fontSize: 12,
    //     margin: [0, 0, 0, 10]
    //   },
    //   {
    //     text: 'Business Partner : ' + (this.budgetReportForm.value.businessPartnerName || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Account : ' + (this.budgetReportForm.value.accountName || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Department : ' + (this.budgetReportForm.value.department || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Location : ' + (this.budgetReportForm.value.location || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Warehouse : ' + (this.budgetReportForm.value.warehouse || 'N/A'),
    //     fontSize: 10,
    //     margin: [0, 0, 0, 30]
    //   },
    //   {
    //     table: {
    //       widths: [70, 180, 180, 70, 70, 70],
    //       body: [
    //         [{
    //           text: 'Doc#',
    //           style: 'tableHeader',
    //           // margin: [10, 5, 10, 5]
    //         },
    //           {
    //             text: 'Account',
    //             style: 'tableHeader'
    //           },
    //           {
    //             text: 'Description',
    //             style: 'tableHeader',
    //             // margin: [36, 5, 130, 5]
    //           },
    //           {
    //             text: 'Debit',
    //             style: 'tableHeader',
    //             alignment: 'right'
    //           },
    //           {
    //             text: 'Credit',
    //             style: 'tableHeader',
    //             alignment: 'right'
    //           },
    //           {
    //             text: 'Balance',
    //             style: 'tableHeader',
    //             alignment: 'right'
    //           },
    //         ],
    //         ...this.recordsData.map((val) => {
    //           return [
    //             val.docNo,
    //             val.accountName,
    //             val.description,
    //             {text: this.valueFormatter(val.debit), alignment: 'right'},
    //             {text: this.valueFormatter(val.credit), alignment: 'right'},
    //             {text: this.valueFormatter(val.balance), alignment: 'right'}]
    //         })
    //       ],
    //     },
    //     layout: {
    //       paddingTop () {
    //         return 10
    //       },
    //       paddingLeft () {
    //         return 10
    //       },
    //       // paddingRight: function (i) { return (i === 1 || i === 2) ? 10 : 5 },
    //       paddingRight () {
    //         return 10
    //       },
    //       paddingBottom () {
    //         return 10
    //       }
    //     }
    //   }
    // ]
    // return data
  }
}



