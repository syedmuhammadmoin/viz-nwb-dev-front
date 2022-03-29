import { NgxsCustomService } from './../../../../shared/services/ngxs-service/ngxs-custom.service';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {BusinessPartnerService} from 'src/app/views/pages/profiling/business-partner/service/businessPartner.service';
import {CategoryService} from 'src/app/views/pages/profiling/category/service/category.service';
import {DepartmentService} from 'src/app/views/pages/profiling/department/service/department.service';
import {LocationService} from 'src/app/views/pages/profiling/location/service/location.service';
import {WarehouseService} from 'src/app/views/pages/profiling/warehouse/services/warehouse.service';
import {ProfitLossService} from '../service/profit-loss.service';
import {IProfitLoss} from '../model/IProfitLoss';
import { isEmpty } from 'lodash';
import {  Permissions } from 'src/app/views/shared/AppEnum';

import {map} from 'rxjs/operators';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';

@Component({
  selector: 'app-profit-N-loss',
  templateUrl: './profit-N-loss.component.html',
  styleUrls: ['./profit-N-loss.component.scss'],
  providers:[NgxsCustomService]
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
  netProfit = '0';

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
    private http: HttpClient,
    private fb: FormBuilder,
    private injector: Injector,     
    private cdRef: ChangeDetectorRef,
    private profitLossService: ProfitLossService,
    public ngxsService:NgxsCustomService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Nature',
        field: 'nature',
        rowGroup: true,
        hide: true,
      },
      {
        // headerName: 'Head',
        rowGroup: true,
        field: 'head',
        hide: true
        // filter: 'agTextColumnFilter',
      },
      {
        // headerName: 'Summary Head',
        field: 'summeryHead',
        // filter: 'agNumberColumnFilter',
        rowGroup: true,
        hide: true
      },
      {
        headerName: 'Transactional',
        field: 'transactional',
        cellStyle: {textAlign : 'left'}
       
      },
      {
        headerName: 'Total',
        field: 'balance',
        aggFunc: 'sum',
        valueFormatter: (param) => {
          return this.valueFormatter(param.value)
          // Math.sign(param.value) === -1 ? `(${Math.abs(param.value).toLocaleString()})` : param.value.toString().toLocaleString()
        }
        
      },
    ];
    this.defaultColDef = {
      width: 100,
      resizable: false,
    };
  }

  ngOnInit(): void {
    this.autoGroupColumnDef = {
      headerName: 'Nature',
      field: 'nature',
      minWidth: 300,
    };
    this.profitNLossForm = this.fb.group({
      docDate: ['', [Validators.required]],
      docDate2: ['', [Validators.required]],
      transactional: [''],
      businessPartner: [''],
      warehouse: [''],
      department: [''],
      location: [''],
      organization: ['']
    });
    
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();    
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get location from state
    //this.ngxsService.getLocationFromState();
    // get department from state
    //this.ngxsService.getDepatmentFromState();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onSubmit() {
    if (this.profitNLossForm.invalid) {
      this.logValidationErrors(this.profitNLossForm, this.formErrors, this.validationMessages);
      return;
    }
    const profitNLoss = {...this.profitNLossForm.value} as IProfitLoss
    profitNLoss.docDate = this.transformDate(this.profitNLossForm.value.docDate, 'MMM d, y')
    profitNLoss.docDate2 = this.transformDate(this.profitNLossForm.value.docDate2, 'MMM d, y')
    console.log(profitNLoss)
    this.isLoading = true;
    this.profitLossService.getProfitNLoss(profitNLoss)
      .pipe(
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
        (!isEmpty(res)) ? this.disability = false : this.disability = true;
        if (isEmpty(res)) {
          this.toastService.info('No Records Found !' , 'Profit & Loss')
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.calculateNetProfit(res);
      });
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

  reset() {
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    //for PDF
    this.disability = true;
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

  