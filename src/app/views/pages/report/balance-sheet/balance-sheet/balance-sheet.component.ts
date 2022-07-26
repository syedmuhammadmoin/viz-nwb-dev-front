import { NgxsCustomService } from './../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, ViewChild} from '@angular/core';
import { Injector} from '@angular/core';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { finalize, map} from 'rxjs/operators';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { BusinessPartnerService} from '../../../profiling/business-partner/service/businessPartner.service';
import { CategoryService} from '../../../profiling/category/service/category.service';
import { BalanceSheetService} from '../service/balance-sheet.service';
import { isEmpty } from 'lodash';
import { GridOptions } from 'ag-grid-community';
import { IBalanceSheet} from "../model/IBalanceSheet";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { APP_ROUTES, REPORT } from 'src/app/views/shared/AppRoutes';
import { Router } from '@angular/router';


@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent extends AppComponentBase implements OnInit {

 // for permissions 
  public permissions = Permissions;

  rowData: any[] = [];
  columnDefs: any;
  gridOptions: GridOptions;
  gridApi: any;
  gridColumnApi: any;
  defaultColDef;
  autoGroupColumnDef: any;
  balanceSheetForm: FormGroup;
  equityNLiability = '0';
  asset = '0';

  //Busy Loading
  isLoading: boolean;
  // data for PDF
  recordsData: any = [];
  disability: boolean = true;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation Messages
  validationMessages = {
    docDate: {
      required: 'Date is required'
    },   
  }

  // Error keys for validation messages
  formErrors = {
    docDate: '',    
  }

  constructor(
    // injecting services
    injector: Injector,
    private fb: FormBuilder,    
    private balanceSheetService: BalanceSheetService,   
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public ngxsService:NgxsCustomService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Nature',
        field: 'nature',
        rowGroup: true,
        hide: true
      },
      // {
      //   // headerName: 'Head',
      //   rowGroup: true,
      //   field: 'head',
      //   hide: true        
      // },
      // {
      //   // headerName: 'Summary Head',
      //   field: 'summeryHead',       
      //   rowGroup: true,
      //   hide: true
      // },
      {
        // headerName: 'Transactional',
        field: 'transactional',
        cellStyle: {textAlign : 'left'}
       
      },
      {
        headerName: 'Total',
        field: 'balance',
        aggFunc: 'sum',
        suppressMenu: true,
        valueFormatter: (param) => {
          return this.valueFormatter(param.value)
          // Math.sign(param.value) === -1 ? `(${Math.abs(param.value).toLocaleString()})` : (param.value).toLocaleString()
        }
      
      },
    ];
  }
// ng oninit 
  ngOnInit() {
    //creating balance sheet form
    this.balanceSheetForm = this.fb.group({
      docDate: ['', [Validators.required]],
      // businessPartner: [''],
      // department: [''],
      // warehouse: [''],
      // location: [''],
      // organization: [''],
      campusName: [''],
      //accountName: [''],
    });
  
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();    
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Campuses
    this.ngxsService.getCampusFromState()
    // get location from state
    //this.ngxsService.getLocationFromState();
    // get department from state
    //this.ngxsService.getDepatmentFromState();

    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };
   
    this.autoGroupColumnDef = {
      menuTabs: ["filterMenuTab"],
      filterValueGetter: (params) => params.data.nature
    }
  }
  // to auto size of column
  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
// called when form is submit by clicking on submit button
  onSubmit() {
    if (this.balanceSheetForm.invalid) {
      this.logValidationErrors(this.balanceSheetForm, this.formErrors, this.validationMessages);
      return;
    }
    const balanceSheetModel = {...this.balanceSheetForm.value} as IBalanceSheet
    balanceSheetModel.docDate = this.formatDate(this.balanceSheetForm.value.docDate)
    this.isLoading = true;
    console.log(balanceSheetModel)
    this.balanceSheetService.getBalanceSheetReport(balanceSheetModel)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         }),
        map((x: any) => {
          return x.result.map((item: any) => {
            // item.balance = item.nature === 'EXPENSES' ? item.debit - item.credit : item.credit - item.debit;
            return item;
          })
        })
      )
      .subscribe((res: IBalanceSheet[]) => {
        this.rowData = res;
        this.recordsData = res;
        //for PDF
        this.disability = (!isEmpty(res)) ? false : true;
        if (isEmpty(res)) {
          this.toastService.info('No Records Found !' , 'Balance Sheet')
        }
        this.cdRef.detectChanges();
        this.calculateNetProfit(res);
      });
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

  calculateNetProfit(res: any[]) {
    console.table(res);
    this.asset = res.filter(x => x.nature.toLowerCase() === 'assets').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
    const liablity = res.filter(x => x.nature.toLowerCase() === 'liability').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    const equity = res.filter(x => x.nature.toLowerCase() === 'equity').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    this.equityNLiability = Math.sign((equity) + (liablity)) === -1
      ? `(${Math.abs((equity) + (liablity)).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })})`
      : ((equity) + (liablity)).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
    console.log((equity) + (liablity));
  }

  reset() {
    this.formDirective.resetForm();
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    //for PDF
    this.disability = true;
  }

  printBalanceSheet(data: any) {

    this.balanceSheetService.setBalanceSheetDataForPrintComponent(data);
      this.router.navigate(['/' + APP_ROUTES.REPORT + '/' + REPORT.BALANCE_SHEET + '/' + REPORT.PRINT], {
        queryParams: {
          date: this.dateHelperService.transformDate(this. balanceSheetForm.value.docDate, 'MMM d, y'),
          campus: (this. balanceSheetForm.value.campusName || 'All'),
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
        margin: [0, 35, 0, 10]
      },
      {
        text: 'BALANCE SHEET REPORT',
        bold: true,
        decoration: 'underline',
        fontSize: 20,
        alignment: 'center',
        // color: 'green',
        margin: [0, 5, 0, 10]
      },
      {
        // text: 'Report for : ' + this.transformDate(this.balanceSheetForm.value.docDate, 'MMM d, y') + ' - ' + this.transformDate(this.balanceSheetForm.value.docDate2, 'MMM d, y'),
        text: 'Report for : ' + this.transformDate(this.balanceSheetForm.value.docDate, 'MMM d, y'),
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Account : ' + (this.balanceSheetForm.value.transactional || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Department : ' + (this.balanceSheetForm.value.department || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Location : ' + (this.balanceSheetForm.value.location || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Warehouse : ' + (this.balanceSheetForm.value.warehouse || 'N/A'),
        fontSize: 10,
        margin: [0, 0, 0, 30]
      },
      {
        table: {
          body: [
            [{
              text: 'Nature',
              style: 'tableHeader1',
            },
            {
              text: 'Head',
              style: 'tableHeader1',
            },
            {
              text: 'Summery Head',
              style: 'tableHeader1',
              margin: [42, 5, 42, 5]
            },
            {
              text: 'Transactional',
              style: 'tableHeader1'
            },
            {
              text: 'Total',
              style: 'tableHeader1',
              margin: [30, 5, 30, 5]
            },
            ],
            ...this.recordsData.map((val) => {
              return [val.nature, val.head, val.summeryHead, val.transactional, this.valueFormatter(val.balance)]
            })
          ],
        },
        layout: {
          paddingTop () { return 10 },
          paddingLeft () { return 10 },
          paddingRight () { return 10 },
          paddingBottom () { return 10 }
        }
      },
      {
        columns: [
          {
            width: 540,
            text: 'Total Asset: ' + this.asset,
            margin: [0,15,0,0]
          },
          {
            text: 'Total Equity & Liability: ' + this.equityNLiability,
            margin: [0,15,0,0]
          }

        ]
      }
    ]
    return data
  }

}
