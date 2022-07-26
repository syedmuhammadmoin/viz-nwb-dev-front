import { NgxsCustomService } from './../../../../shared/services/ngxs-service/ngxs-custom.service';
import { HttpClient} from '@angular/common/http';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { ProfitLossService} from '../service/profit-loss.service';
import { IProfitLoss} from '../model/IProfitLoss';
import { isEmpty } from 'lodash';
import { Permissions } from 'src/app/views/shared/AppEnum';
import  {finalize, map } from 'rxjs/operators';
import { FirstDataRenderedEvent, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { APP_ROUTES, REPORT } from 'src/app/views/shared/AppRoutes';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profit-N-loss',
  templateUrl: './profit-N-loss.component.html',
  styleUrls: ['./profit-N-loss.component.scss']
})

export class ProfitNLossComponent extends AppComponentBase implements OnInit {
  
 // for permissions 
 public permissions = Permissions;
  rowData: any[] = [];
  columnDefs: any;
  gridOptions: any;
  gridApi: any;
  gridColumnApi: any;
  defaultColDef;
  autoGroupColumnDef: any;
  profitNLossForm: FormGroup;
  profitNLossModel: IProfitLoss = {} as IProfitLoss
  netProfit = '0';

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //data for PDF
  recordsData: any = []
  disability: boolean = true
  
  //Busy Loading
  isLoading: boolean;

  //Limit Date
  maxDate: Date = new Date()

  // Validation Messages
  validationMessages = {
    docDate: {
      required: 'From Date is required'
    },
    docDate2: {
      required: 'To Date is required'
    }
  }

  // Error keys for validation messages
  formErrors = {
    docDate: '',
    docDate2: ''
  }

  constructor(
    private fb: FormBuilder,  
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private profitLossService: ProfitLossService,
    public ngxsService:NgxsCustomService,
    injector: Injector,   
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Nature',
        field: 'nature',
        rowGroup: true,
        hide: true,
      },
      // {
      //   // headerName: 'Head',
      //   rowGroup: true,
      //   field: 'head',
      //   hide: true
      //   // filter: 'agTextColumnFilter',
      // },
      // {
      //   // headerName: 'Summary Head',
      //   field: 'summeryHead',
      //   // filter: 'agNumberColumnFilter',
      //   rowGroup: true,
      //   hide: true
      // },
      {
        headerName: 'Transactional',
        field: 'transactional',
        cellStyle: {textAlign : 'left'}
       
      },
      {
        headerName: 'Total',
        field: 'balance',
        aggFunc: 'sum',
        suppressMenu: true,
        valueFormatter: (param: ValueFormatterParams) => {
          return this.valueFormatter(param.value)
          // Math.sign(param.value) === -1 ? `(${Math.abs(param.value).toLocaleString()})` : param.value.toString().toLocaleString()
        }
        
      },
    ];
  }

  ngOnInit(): void {
    // this.autoGroupColumnDef = {
    //   headerName: 'Nature',
    //   field: 'nature',
    //   minWidth: 300,
    // };
    this.profitNLossForm = this.fb.group({
      docDate: ['', [Validators.required]],
      docDate2: ['', [Validators.required]],
      accountName: [''],
      businessPartner: [''],
      warehouse: [''],
      campus: ['']
    });
    
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();    
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Campuses of level 4 from state
    this.ngxsService.getCampusFromState()
    // get business Partners of level 4 from state
    this.ngxsService.getBusinessPartnerFromState()
    // get location from state
    //this.ngxsService.getLocationFromState();
    // get department from state
    //this.ngxsService.getDepatmentFromState();
    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };
   
    this.autoGroupColumnDef = {
      headerName: 'Nature',
      menuTabs: ["filterMenuTab"],
      filterValueGetter: (params) => params.data.nature
    }
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onSubmit() {
    if (this.profitNLossForm.invalid) {
      this.logValidationErrors(this.profitNLossForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapProfitNLossValuesToModel();
    console.log(this.profitNLossModel)
    this.isLoading = true;
    this.profitLossService.getProfitNLoss(this.profitNLossModel)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         }),
        map((x: any) => {
          console.log(x.result)
          return x.result.map((item: any) => {
            // item.balance = item.nature === 'EXPENSES' ? item.debit - item.credit : item.credit - item.debit;
            return item;
          })
        })
      )
      .subscribe((res: any) => {
        console.log(res);
        this.rowData = res;
        this.recordsData = res;
        // for PDF
        this.disability = (!isEmpty(res)) ? false : true;
        if (isEmpty(res)) {
          this.toastService.info('No Records Found !' , 'Income & Expenditure')
        }
        this.cdRef.detectChanges();
        this.calculateNetProfit(res);
      });
  }

  mapProfitNLossValuesToModel () {
    this.profitNLossModel.docDate = this.formatDate(this.profitNLossForm.value.docDate)
    this.profitNLossModel.docDate2 = this.formatDate(this.profitNLossForm.value.docDate2)
    this.profitNLossModel.businessPartner = this.profitNLossForm.value.businessPartner || '';
    this.profitNLossModel.campus = this.profitNLossForm.value.campus || '';
    this.profitNLossModel.accountName = this.profitNLossForm.value.accountName || '';
    this.profitNLossModel.warehouse = this.profitNLossForm.value.warehouse || '';
  }

  calculateNetProfit(res: any[]) {
    console.table(res);
    const revenue = res.filter(x => x.nature.toLowerCase() === 'income').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    const expense = res.filter(x => x.nature.toLowerCase() === 'expenses').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    this.netProfit = `(${Math.abs((revenue) - (expense)).toLocaleString()})`
    console.log((revenue) - (expense));
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

  reset() {
    this.formDirective.resetForm();
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    //for PDF
    this.disability = true;
  }

  printProfitNLoss(data: any) {

    this.profitLossService.setProfitNLossDataForPrintComponent(data);

      this.router.navigate(['/' + APP_ROUTES.REPORT + '/' + REPORT.PROFIT_N_LOSS + '/' + REPORT.PRINT], {
        queryParams: {
          from: this.dateHelperService.transformDate(this.profitNLossForm.value.docDate, 'MMM d, y'),
          to: this.dateHelperService.transformDate(this.profitNLossForm.value.docDate2, 'MMM d, y'),
          account: (this.profitNLossForm.value.accountName || 'All'),
          businessPartner: (this.profitNLossForm.value.businessPartner || 'All'),
          campus: (this.profitNLossForm.value.campus || 'All'),
          store: (this.profitNLossForm.value.warehouse || 'All'),
        }
      })
  }

  //PDF Content
  contentData() {
    const data = [
      {
        text: 'VIZALYS',
        bold: true,
        fontSize: 10,
        alignment: 'center',
        //color: 'lightblue',
        margin: [0, 35, 0, 10]
      },
      {
        text: 'PROFIT & LOSS REPORT',
        bold: true,
        decoration: "underline",
        fontSize: 20,
        alignment: 'center',
        //color: 'green',
        margin: [0, 5, 0, 10]
      },
      {
        text: 'Report for : ' + this.transformDate(this.profitNLossForm.value.docDate, 'MMM d, y') + ' - ' + this.transformDate(this.profitNLossForm.value.docDate2, 'MMM d, y'),
        alignment: 'center',
        fontSize: 12,
      },
      {
        text: 'Account : ' + (this.profitNLossForm.value.transactional || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Location : ' + (this.profitNLossForm.value.location || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Warehouse : ' + (this.profitNLossForm.value.warehouse || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Department : ' + (this.profitNLossForm.value.department || 'N/A'),
        fontSize: 10,
        margin: [0, 0, 0, 30]
      },
      {
        table: {
          widths: [132,132,132,132,132],
          body: [
            [
            {
              text: 'Nature',
                style: 'tableHeader3'
            },
            {
              text: 'Head',
              style: 'tableHeader3'
            },
            {
              text: 'Summery Head',
              style: 'tableHeader3'
            },
            {
              text: 'Transactional',
              style: 'tableHeader3'
            },
            {
              text: 'Balance',
              style: 'tableHeader3',
              alignment: 'right'
            }
            ],
            ...this.recordsData.map((val) => {
              return [val.nature, val.head, val.summeryHead, val.transactional, { text: this.valueFormatter(val.balance), alignment: 'right' }]
            })
          ],
        },
        layout: {
          paddingTop: function () { return 10 },
          paddingLeft: function () { return 10 },
          paddingRight: function () { return 10},
          paddingBottom: function () { return 10 }
        }
      },
      {
        text: 'Net Profit : ' + this.netProfit,
        alignment: 'right',
        fontSize: 12,
        margin: [0, 10, 0, 0],
       // decoration: 'underline',
        bold: true,
        //lineHeight: 2,
      }
    ]
    return data
  }
  };

  