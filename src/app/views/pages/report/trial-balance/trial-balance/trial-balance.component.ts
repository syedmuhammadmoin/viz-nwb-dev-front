import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { ITrialBalance } from '../model/ITrialBalance';
import { GridReadyEvent, RowNode, ValueFormatterParams } from 'ag-grid-community';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { TrialBalanceService } from '../service/trial-balance.service';
import { isEmpty } from 'lodash';
import { map } from 'rxjs/operators';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';

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
    private trialBalanceService: TrialBalanceService,
    private cdRef: ChangeDetectorRef,
    public ngxsService:NgxsCustomService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Account',
        field: 'accountName',
        cellStyle: {textAlign : 'left'},
        // width: 300
      },
      {
        headerName: 'Opening Balance',
        children: [
          {
            headerName: 'Debit',
            field: 'debitOB',
            filter: 'agNumberColumnFilter',
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            },
            cellClass: 'my__margin'
          },
          {
            headerName: 'Credit',
            field: 'creditOB',
            filter: 'agNumberColumnFilter',
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
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            }
          },
          {
            headerName: 'Credit',
            field: 'credit',
            filter: 'agNumberColumnFilter',
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
            //aggFunc: 'sum',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            }
          },
          {
            headerName: 'Credit',
            field: 'creditCB',
            //aggFunc: 'sum',
            filter: 'agNumberColumnFilter',
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '-ve')
            }
          },
        ],
      },
    ];
    this.defaultColDef = {
      width: 175,
      resizable: true,
    };
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
      accountName: [''],
      campusName: ['']
      // organization: [''],
      // warehouse: [''],
      // department: [''],
      // location: ['']
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

    const body = { ...this.trialBalanceForm.value } as ITrialBalance
    // body.docDate = this.transformDate(new Date(body.docDate), 'MMM d, y') 
    // body.docDate2 = this.transformDate(new Date(body.docDate2), 'MMM d, y')
    body.docDate = this.formatDate(body.docDate)
    body.docDate2 = this.formatDate(body.docDate2)
    
    this.isLoading = true;
    this.trialBalanceService.getTrialBalance(body).pipe(map((res: any) => {
      return res.result.map((response: ITrialBalance) => {
        return response
      });
    })).subscribe((result: ITrialBalance[]) => {
      this.rowData = result;
      this.recordsData = result;
      //this.totals = this.calculateTotal(result, 'creditCB', 'debitCB', 'creditOB', 'debitOB', 'credit', 'debit')
    
      //for PDF
      (!isEmpty(result)) ? this.disability = false : this.disability = true;
      if (isEmpty(result)) {
        this.toastService.info('No Records Found !' , 'Trial Balance')
      }
      this.isLoading = false;

      this.cdRef.detectChanges();
      setTimeout(() => {
        const pinnedBottomData = this.generatePinnedBottomData();
        this.gridApi.setPinnedBottomRowData([pinnedBottomData]);
      }, 500)
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
   