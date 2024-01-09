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
import { AppConst } from 'src/app/views/shared/AppConst';

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
      },
      {
        headerName: 'Opening Balance',
        children: [
          {
            headerName: 'Debit',
            field: 'debitOB',
            suppressMenu: true,
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            },
            cellClass: 'my__margin'
          },
          {
            headerName: 'Credit',
            field: 'creditOB',
            suppressMenu: true,
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
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            }
          },
          {
            headerName: 'Credit',
            field: 'credit',
            suppressMenu: true,
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
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '+ve')
            }
          },
          {
            headerName: 'Credit',
            field: 'creditCB',
            suppressMenu: true,
            valueFormatter: (params: ValueFormatterParams) => {
              return this.valueFormatter(params.value, '-ve')
            }
          },
        ],
      },
    ];
  }
  public currentClient : any ={}
  ngOnInit(): void {
    this.currentClient = AppConst.ClientConfig.config
    this.autoGroupColumnDef = {
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

    //Get Data from Store
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getAccountLevel4FromState()
    this.ngxsService.getCampusFromState()

    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };

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
      this.gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
        if (rowNode.data[element])
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
        target[element] = target[element]
      }
    })
    target.accountName = 'Total'
    return target;
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
}
