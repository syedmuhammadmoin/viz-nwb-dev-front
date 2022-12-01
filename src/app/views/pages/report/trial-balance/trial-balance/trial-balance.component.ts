import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { ITrialBalance } from '../model/ITrialBalance';
import { GridReadyEvent, RowNode, ValueFormatterParams } from 'ag-grid-community';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { TrialBalanceService } from '../service/trial-balance.service';
import { isEmpty } from 'lodash';
import { finalize, map } from 'rxjs/operators';
import { APP_ROUTES, REPORT } from 'src/app/views/shared/AppRoutes';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent extends AppComponentBase implements OnInit {
  // for permissions 
  public permissions = Permissions;

  rowData: any = [];
  columnDefs: any;
  gridOptions: any;
  gridApi: any;
  gridColumnApi: any;
  defaultColDef;
  autoGroupColumnDef: any;
  trialBalanceForm: FormGroup;
  trialBalanceModel = {} as ITrialBalance
  // totals = {} as any
  totals : any = {}

  //data for PDF
  recordsData: any = []
  disability: boolean = true
  credit: number = 0;
  debit: number = 0;
  creditOB: number = 0;
  debitOB: number = 0;
  creditCB: number = 0;
  debitCB: number = 0;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //Busy Loading
  isLoading: boolean;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

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

  constructor(
    private fb: FormBuilder,
    injector: Injector,   
    private trialBalanceService: TrialBalanceService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public ngxsService:NgxsCustomService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Account',
        field: 'accountName',
        cellStyle: {textAlign : 'left'},
        filter: 'agTextColumnFilter',
        menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
        // width: 300
      },
      {
        headerName: 'Opening Balance',
        children: [
          {
            headerName: 'Debit',
            field: 'debitOB',
            //filter: 'agNumberColumnFilter',
            suppressMenu: true,
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            },
            cellClass: 'my__margin'
          },
          {
            headerName: 'Credit',
            field: 'creditOB',
            //filter: 'agNumberColumnFilter',
            suppressMenu: true,
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '-ve')
            }
          },
        ],
      },
      {
        headerName: 'Active Period',
        headerClass: 'align-center',
        children: [
          {
            headerName: 'Debit',
            field: 'debit',
            suppressMenu: true,
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            }
          },
          {
            headerName: 'Credit',
            field: 'credit',
            //filter: 'agNumberColumnFilter',
            suppressMenu: true,
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '-ve')
            }
          },
        ],
      },
      {
        headerName: 'Closing Balance',
        children: [
          {
            headerName: 'Debit',
            field: 'debitCB',
            suppressMenu: true,
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            }
          },
          {
            headerName: 'Credit',
            field: 'creditCB',
            //aggFunc: 'sum',
            //filter: 'agNumberColumnFilter',
            suppressMenu: true,
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '-ve')
            }
          },
        ],
      },
    ];
  }

  ngOnInit(): void {
    this.autoGroupColumnDef = {
      // minWidth: 300,
      cellRendererParams: {
        suppressCount: true,
        checkbox: false,
      },
    }
    this.trialBalanceForm = this.fb.group({
      docDate: ['', [Validators.required]],
      docDate2: ['', [Validators.required]],
      accountId: [null],
      campusId: [null]
    });
     // get Ware house location from state
    this.ngxsService.getWarehouseFromState();    
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Campuses of level 4 from state
    this.ngxsService.getCampusFromState()
    // get location from state
    //this.ngxsService.getLocationFromState();
    // get department from state
    //this.ngxsService.getDepatmentFromState();

    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };
   
    // this.autoGroupColumnDef = {
    //   headerName: 'Account',
    //   menuTabs: ["filterMenuTab"],
    //   minWidth: 300,
    //   filterValueGetter: (params) => params.data.accountName,
    //   cellRendererParams: {
    //     suppressCount: true,
    //     checkbox: false,
    //   },
    // }

     //handling dueDate logic
     this.trialBalanceForm.get('docDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.trialBalanceForm.get('docDate2').value < this.trialBalanceForm.get('docDate').value
    })
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;    
  }

  onSubmit() {
    if (this.trialBalanceForm.invalid) {
      this.logValidationErrors(this.trialBalanceForm, this.formErrors, this.validationMessages);
      return;
    }

    
    
    this.isLoading = true;
    this.mapFormValueToModel();
    this.trialBalanceService.getTrialBalance(this.trialBalanceModel)
    .pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       }),
      map((res: any) => {
      return res.result.map((response: ITrialBalance) => {
        return response
      });
    })).subscribe((result: ITrialBalance[]) => {
      this.rowData = result;
      this.recordsData = result;
      //this.totals = this.calculateTotal(result, 'creditCB', 'debitCB', 'creditOB', 'debitOB', 'credit', 'debit')
    
      //for PDF
      this.disability = (!isEmpty(result)) ? false : true;
      if (isEmpty(result)) {
        this.toastService.info('No Records Found !' , 'Trial Balance')
      }
      this.cdRef.detectChanges();
      setTimeout(() => {
        const pinnedBottomData = this.generatePinnedBottomData();
        this.gridApi.setPinnedBottomRowData([pinnedBottomData]);
      }, 500)
    });
  }

  // Mapping value from form to model
  mapFormValueToModel() {
    this.trialBalanceModel.docDate = this.formatDate(this.trialBalanceForm.value.docDate);
    this.trialBalanceModel.docDate2 = this.formatDate(this.trialBalanceForm.value.docDate2);
    this.trialBalanceModel.accountId = this.trialBalanceForm.value.accountId?.id || null;
    this.trialBalanceModel.campusId = this.trialBalanceForm.value.campusId?.id || null;
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


  generatePinnedBottomData() {
    // generate a row-data with null values
    const result = {};

    this.gridColumnApi.getAllGridColumns().forEach(item => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(result);
  }

  calculatePinnedBottomData(target: any) {
    // list of columns fo aggregation
    const columnsWithAggregation = ['debitOB', 'creditOB', 'debit', 'credit', 'debitCB', 'creditCB']
    columnsWithAggregation.forEach(element => {
     // console.log('element', element);
      this.gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
        if (rowNode.data[element])
          //console.log('forEach if: ', rowNode.data[element]);
        target[element] += Number(rowNode.data[element].toFixed(2));

        //for PDF
        switch (element) {
          case "debitOB":
            this.debitOB = target[element];
            break;
          case "creditOB":
            this.creditOB = target[element];
            break;
          case "debit":
            this.debit = target[element];
            break;
          case "credit":
            this.credit = target[element];
            break;
          case "debitCB":
            this.debitCB = target[element];
            break;
          case "creditCB":
            this.creditCB = target[element];
            break;
        }
      });
      if (target[element]) {
        //console.log('if: ', target[element]);
        target[element] = target[element]
        // .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    })
    target.accountName = 'Total'
    // console.log(target);
    return target;
  }

  calculateTotal(res: ITrialBalance[], ...keys) : any {
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
    //console.log(objectToReturn)
    return objectToReturn
  }

  reset() {
    this.formDirective.resetForm();
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    //for PDF
    this.disability = true;
  }

  printTrialBalance(data: any) {

    this.trialBalanceService.setTrialBalanceDataForPrintComponent(data);

      this.router.navigate(['/' + APP_ROUTES.REPORT + '/' + REPORT.TRIAL_BALANCE + '/' + REPORT.PRINT], {
        queryParams: {
          from: this.dateHelperService.transformDate(this.trialBalanceForm.value.docDate, 'MMM d, y'),
          to: this.dateHelperService.transformDate(this.trialBalanceForm.value.docDate2, 'MMM d, y'),
          account: (this.trialBalanceForm.value.accountId?.name || 'All'),
          campus: (this.trialBalanceForm.value.campusId?.name || 'All'),
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
        margin: [0, 35, 0, 10]
      },
      {
        text: 'TRIAL BALANCE REPORT',
        bold: true,
        decoration: "underline",
        fontSize: 20,
        alignment: 'center',
        margin: [0, 5, 0, 10]
      },
      {
        text: 'Report for : ' + this.transformDate(this.trialBalanceForm.value.docDate, 'MMM d, y') + ' - ' + this.transformDate(this.trialBalanceForm.value.docDate2, 'MMM d, y'),
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Account : ' + (this.trialBalanceForm.value.accountName || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Department : ' + (this.trialBalanceForm.value.department || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Location : ' + (this.trialBalanceForm.value.location || 'N/A'),
        fontSize: 10,
      },
      {
        text: 'Warehouse : ' + (this.trialBalanceForm.value.warehouse || 'N/A'),
        fontSize: 10,
        margin: [0, 0, 0, 30]
      },
      {
        margin: [0, 0, 0, 8],
        table: {
          widths: [200, 75, 75, 75, 75, 75, 75],
          body: [
            [
              {
                text: 'Account',
                alignment: 'center',
                style: 'tableHeader2',
                margin: [0, 20, 20, 0],
                rowSpan: 2,
              },
              {
                text: 'Opening Balance',
                style: 'tableHeader2',
                colSpan: 2,
                alignment: 'center'
              },
              {},
              {
                text: 'Active Period',
                style: 'tableHeader2',
                colSpan: 2,
                alignment: 'center'
              },
              {},
              {
                text: 'Closing Balance',
                style: 'tableHeader2',
                colSpan: 2,
                alignment: 'center'
              },
              {}
            ],
            [
              {},
              {
                text: 'Debit',
                alignment: 'right'
              },
              {
                text: 'Credit',
                alignment: 'right'
              },
              {
                text: 'Debit',
                alignment: 'right'
              },
              {
                text: 'Credit',
                alignment: 'right'
              },
              {
                text: 'Debit',
                alignment: 'right'
              },
              {
                text: 'Credit',
                alignment: 'right'
              }
            ],
            ...this.recordsData.map((val) => {
              return [
                val.accountName,
                { text: this.valueFormatter(val.debitOB, '+ve'), alignment: 'right' },
                { text: this.valueFormatter(val.creditOB, '-ve'), alignment: 'right' },
                { text: this.valueFormatter(val.debit, '+ve'), alignment: 'right' },
                { text: this.valueFormatter(val.credit, '-ve'), alignment: 'right' },
                { text: this.valueFormatter(val.debitCB, '+ve'), alignment: 'right' },
                { text: this.valueFormatter(val.creditCB, '-ve'), alignment: 'right' }]
            })
          ],
        },
        layout: {
          paddingTop: function () { return 10 },
          paddingLeft: function () { return 10 },
          paddingRight: function () { return 5 },
          paddingBottom: function () { return 10 }
        }
      },
      {
        table: {
          headerRows: 1,
          widths: [200, 75, 75, 75, 75, 75, 75],
          body: [
            [
              {
                text: 'Total',
                alignment: 'center',
                //style: 'underLine',
              },
              {
                text: this.valueFormatter(this.debitOB, '+ve'),
                //style: 'underLine',
                alignment: 'right'
              },
              {
                text: this.valueFormatter(this.creditOB, '-ve'),
                //style: 'underLine',
                alignment: 'right'
              },
              {
                text: this.valueFormatter(this.debit, '+ve'),
                //style: 'underLine',
                alignment: 'right'
              },
              {
                text: this.valueFormatter(this.credit, '-ve'),
                //style: 'underLine',
                alignment: 'right'
              },
              {
                text: this.valueFormatter(this.debitCB, '+ve'),
                //style: 'underLine',
                alignment: 'right'
              },
              {
                text: this.valueFormatter(this.creditCB, '-ve'),
                //style: 'underLine',
                alignment: 'right'
              }
            ],
          ],
        },
        layout: {
          //hLineWidth: function () { return 0; },
          hLineWidth: function (i) { return (i === 1) ? 1 : 0; },
          vLineWidth: function () { return 0; },
          paddingTop: function () { return 10 },
          paddingLeft: function () { return 10 },
          paddingRight: function () { return 7 },
          paddingBottom: function () { return 10 },
        }
      }
    ]
    return data
  }
}
   