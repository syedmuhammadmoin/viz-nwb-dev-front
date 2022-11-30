import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { BusinessPartnerService} from 'src/app/views/pages/profiling/business-partner/service/businessPartner.service';
import { CategoryService} from 'src/app/views/pages/profiling/category/service/category.service';
import { GeneralLedgerService} from '../service/general-ledger.service';
import { GridOptions, ValueFormatterParams} from 'ag-grid-community';
import { IGeneralLedger} from '../model/IGeneralLedger';
import { finalize} from 'rxjs/operators';
import { DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty} from 'lodash';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Router } from '@angular/router';
import { APP_ROUTES, REPORT } from 'src/app/views/shared/AppRoutes';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';


function sumFunc(params) {
  // let sum = 0;
  if (params && params.values) {
    this.balance = params?.values[params?.values?.length - 1]
  }
  return this.balance;
}

function debitSum(params) {
  let debitSum = 0;
  params.values.forEach((value) => {
    // console.log(+value);
    if (value) {
      debitSum += +value;
    }
  });
  const netDebitSum = debitSum;
  // Math.sign(this.openingBalance) === (1 || 0) ? (debitSum - this.openingBalance) : debitSum;
  return netDebitSum !== 0 ? netDebitSum : 0;
  // Math.sign(netResult) != -1 ? netResult : netResult.toString().replace(/ *\([^)]*\) */g,'');
}

function creditSum(params) {
  let result = 0;
  params.values.forEach((value) => {
    if (typeof value === 'number') {
      result += value;
    }
  });
  const netResult = result;
  // Math.sign(this.openingBalance) === -1 ? (result + (this.openingBalance)) : result;
  return netResult !== 0 ?  netResult : 0 ;
  // Math.sign(netResult) != -1 ? netResult : netResult.toString().replace(/ *\([^)]*\) */g,'');
}


@Component({
  selector: 'kt-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.scss']
})
export class GeneralLedgerComponent extends AppComponentBase implements OnInit {
  // for permissions 
  public permissions = Permissions;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean


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
  
  // Declaring FormGroup
  generalLedgerForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  rowData: IGeneralLedger[] = [];

  // Declaring Model
  // Initializing generalLedger model...
  generalLedgerModel: IGeneralLedger = {} as IGeneralLedger
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

  constructor(
    // Injecting services in constructor
    private fb: FormBuilder,   
    private generalLedgerService: GeneralLedgerService,
    private cdRef: ChangeDetectorRef,   
    public addButtonService: AddModalButtonService,
    private router: Router,
    public ngxsService: NgxsCustomService,
    private injector: Injector
  ) {
    super(injector);
    this.columnDefs = [
      { 
        headerName: 'Account Name', 
        field: 'accountName', 
        rowGroup: true, 
        hide: true,
      },
      {
        headerName: 'Business Partner', 
        field: 'businessPartnerName', 
        cellStyle: {textAlign : 'left'}
      },
      {
        headerName: 'Date', 
        field: 'docDate', 
        cellStyle: {textAlign : 'left'},
        cellRenderer: (params: any) => {
          const date = params?.data?.docDate != null ? params?.data?.docDate : null;
          return date == null ? null : this.transformDate(date, 'MMM d, y');
        }
      },
      {
        headerName: 'Document No', 
        field: 'docNo', 
        cellStyle: {textAlign : 'left'}
      },
      {
        headerName: 'Document Type', 
        field: 'docType', 
        suppressMenu: true,
        cellStyle: {textAlign : 'left'},
        valueFormatter: (params: ValueFormatterParams) => {
          return DocType[params.value]
          // return (params.value || params.value === 0) ? AppConst.Documents.find(x => x.id === params.value).value : null
        } 
      },
      {
        headerName: 'Description', 
        field: 'description', 
        cellStyle: {textAlign : 'left'},
        suppressMenu: true,
      },
      {
        headerName: 'Debit',
        field: 'debit',
        suppressMenu: true,
        aggFunc: debitSum.bind(this),
        valueFormatter: (params) => {
          return this.valueFormatter(params.value, '+ve')
        }
      },
      {
        headerName: 'Credit',
        field: 'credit',
        suppressMenu: true,
        aggFunc: creditSum.bind(this),
        valueFormatter: (params) => {
          return this.valueFormatter(params.value, '-ve')
        }
      },
      {
        headerName: 'Balance',
        field: 'balance',
        aggFunc: sumFunc.bind(this),
        colId: 'balance',
        suppressMenu: true,
        valueFormatter: (params) => {
          return this.valueFormatter(params.value)
        }
      }   
    ];
  }

  onRowDoubleClicked($event: any) {
  }

  ngOnInit() {
    // AG Grid Options
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.suppressAggFuncInHeader = true;

    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };
   
    this.autoGroupColumnDef = {
      headerName: 'Account',
      menuTabs: ["filterMenuTab"],
      minWidth: 300,
      filterValueGetter: (params) => params.data.accountName,
      cellRendererParams: {
        suppressCount: true,
        checkbox: false,
      },
    }

    // initializing formGroup
    this.generalLedgerForm = this.fb.group({
      docDate: ['', [Validators.required]],
      docDate2: ['', [Validators.required]],
      accountName: [null],
      businessPartnerId: [null],
      // organization: [''],
      // department: [''],
      warehouseName: [null],
      campusName : [null]
      //location: ['']
    });

    

  
    //get all business partner and employee 
    this.ngxsService.getAllBusinessPartnerFromState();
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

     //handling dueDate logic
    this.generalLedgerForm.get('docDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.generalLedgerForm.get('docDate2').value < this.generalLedgerForm.get('docDate').value
    })
  }

  onSubmit() {
    if (this.generalLedgerForm.invalid) {
      this.logValidationErrors(this.generalLedgerForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapFormValueToModel();
    // console.log(this.generalLedgerModel);
    this.isLoading = true;
    this.generalLedgerService.getLedger(this.generalLedgerModel).pipe(
      finalize(() => {
        this.columnDefs = [
          {
            headerName: 'Account Name', 
            field: 'accountName', 
            rowGroup: true, 
            hide: true
          },
          {
            headerName: 'Business Partner', 
            field: 'businessPartnerName', 
            cellStyle: {textAlign : 'left'}
          },
          {
            headerName: 'Date', field: 'docDate',cellStyle: {textAlign : 'left'},
            cellRenderer: (params: any) => {
              // console.log(params);
              const date = params?.data?.docDate != null ? params?.data?.docDate : null;
              return date == null ? null : this.transformDate(date, 'MMM d, y');
            }
          },
          {
            headerName: 'Document No', 
            field: 'docNo', 
            cellStyle: {textAlign : 'left'}
          },
          {
            headerName: 'Document Type', 
            field: 'docType',  
            suppressMenu: true,
            cellStyle: {textAlign : 'left'},
            valueFormatter: (params: ValueFormatterParams) => {
              return DocType[params.value]
              // return (params.value || params.value === 0) ? AppConst.Documents.find(x => x.id === params.value).value : null
            } 
          },

          // },
          {headerName: 'Description', field: 'description', suppressMenu: true, cellStyle: {textAlign : 'left'}},
          {
            headerName: 'Debit',
            field: 'debit',
            suppressMenu: true,
            aggFunc: debitSum.bind(this),
            valueFormatter: (params) => {
              return this.valueFormatter(params.value, '+ve')
            }
          },
          {
            headerName: 'Credit',
            field: 'credit',
            suppressMenu: true,
            aggFunc: creditSum.bind(this),
            valueFormatter: (params) => {
              return this.valueFormatter(params.value, '-ve')
            }
          },
          {
            headerName: 'Balance',
            field: 'balance',
            aggFunc: sumFunc.bind(this),
            colId: 'balance',
            suppressMenu: true,
            valueFormatter: (params) => {
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
        this.toastService.info('No Records Found !' , 'General Ledger')
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
    this.generalLedgerModel.docDate = this.formatDate(this.generalLedgerForm.value.docDate);
    this.generalLedgerModel.docDate2 = this.formatDate(this.generalLedgerForm.value.docDate2);
    this.generalLedgerModel.accountId = this.generalLedgerForm.value.accountName || null;
    this.generalLedgerModel.businessPartnerId = this.generalLedgerForm.value.businessPartnerId?.id || null;
    this.generalLedgerModel.warehouseId = this.generalLedgerForm.value.warehouseName || null;
    this.generalLedgerModel.campusId = this.generalLedgerForm.value.campusName || null;
    // this.generalLedgerModel.location = this.generalLedgerForm.value.location || '';
    // this.generalLedgerModel.department = this.generalLedgerForm.value.department || '';
    // this.generalLedgerModel.warehouse = this.generalLedgerForm.value.warehouse || '';
    // this.generalLedgerModel.organization = this.generalLedgerForm.value.organization || '';
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
    //params.api.sizeColumnsToFit();
  }

  printGeneralLedger(data: any) {

    this.generalLedgerService.setLedgerDataForPrintComponent(data);

      this.router.navigate(['/' + APP_ROUTES.REPORT + '/' + REPORT.GENERAL_LEDGER + '/' + REPORT.PRINT], {
        queryParams: {
          from: this.dateHelperService.transformDate(this.generalLedgerForm.value.docDate, 'MMM d, y'),
          to: this.dateHelperService.transformDate(this.generalLedgerForm.value.docDate2, 'MMM d, y'),
          account: (this.generalLedgerForm.value.accountName || 'All'),
          businessPartner: (this.generalLedgerForm.value.businessPartnerId?.name || 'All'),
          campus: (this.generalLedgerForm.value.campusName || 'All'),
          store: (this.generalLedgerForm.value.warehouseName || 'All'),
        }
      })
  }

  // PDF Content
  contentData() {
    const data = [
      {
        text: 'VIZALYS',
        bold: true,
        fontSize: 10,
        alignment: 'center',
        // color: 'lightblue',
        margin: [0, 35, 0, 10]
      },
      {
        text: 'GENERAL LEDGER REPORT',
        bold: true,
        decoration: 'underline',
        fontSize: 20,
        alignment: 'center',
        // color: 'green',
        margin: [0, 5, 0, 10]
      },
      {
        text: 'Report for : ' + this.transformDate(this.generalLedgerForm.value.docDate, 'MMM d, y') + ' - ' + this.transformDate(this.generalLedgerForm.value.docDate2, 'MMM d, y'),
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Business Partner : ' + (this.generalLedgerForm.value.businessPartnerName || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Account : ' + (this.generalLedgerForm.value.accountName || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Department : ' + (this.generalLedgerForm.value.department || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Location : ' + (this.generalLedgerForm.value.location || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Warehouse : ' + (this.generalLedgerForm.value.warehouse || 'N/A'),
        fontSize: 10,
        margin: [0, 0, 0, 30]
      },
      {
        table: {
          widths: [70, 180, 180, 70, 70, 70],
          body: [
            [{
              text: 'Doc#',
              style: 'tableHeader',
              // margin: [10, 5, 10, 5]
            },
              {
                text: 'Account',
                style: 'tableHeader'
              },
              {
                text: 'Description',
                style: 'tableHeader',
                // margin: [36, 5, 130, 5]
              },
              {
                text: 'Debit',
                style: 'tableHeader',
                alignment: 'right'
              },
              {
                text: 'Credit',
                style: 'tableHeader',
                alignment: 'right'
              },
              {
                text: 'Balance',
                style: 'tableHeader',
                alignment: 'right'
              },
            ],
            ...this.recordsData.map((val) => {
              return [
                val.docNo,
                val.accountName,
                val.description,
                {text: this.valueFormatter(val.debit), alignment: 'right'},
                {text: this.valueFormatter(val.credit), alignment: 'right'},
                {text: this.valueFormatter(val.balance), alignment: 'right'}]
            })
          ],
        },
        layout: {
          paddingTop () {
            return 10
          },
          paddingLeft () {
            return 10
          },
          // paddingRight: function (i) { return (i === 1 || i === 2) ? 10 : 5 },
          paddingRight () {
            return 10
          },
          paddingBottom () {
            return 10
          }
        }
      }
    ]
    return data
  }
}
