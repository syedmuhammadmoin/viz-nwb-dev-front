import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {GridOptions, ValueFormatterParams} from 'ag-grid-community';
import {DocType} from 'src/app/views/shared/AppEnum';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {IReport} from '../model/IReport';
import {NgxsCustomService} from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import {IFixedAssetReport} from '../model/IFixedAssetReport';
import {FixedAssetReportService} from '../services/fixed-asset-report.service';
import {APP_ROUTES, ASSET_REPORT, REPORT} from '../../../../shared/AppRoutes';
import {Router} from '@angular/router';

@Component({
  selector: 'kt-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent extends AppComponentBase implements OnInit {

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  // gridOptions: GridOptions;

  autoGroupColumnDef;
  openingBalance = 0;
  balance = 0;
  columnDefs;
  defaultColDef: any

  // Busy Loading
  isLoading: boolean;

  disability = true

  // Declaring FormGroup
  assetReportForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  rowData: IFixedAssetReport[] = [];
  reportModel: IReport = {} as IReport;

  // Declaring Model
  // Initializing generalLedger model...

  // generalLedgerModel: IGeneralLedger = {} as IGeneralLedger

  // Validation Messages
  validationMessages = {
    docDate: {
      required: 'Start Date is required.'
    },
    docDate2: {
      required: 'End Date is required.'
    },
    fixedAssetId: {
      required: 'Fixed Asset is required.'
    },
    storeId: {
      required: 'Store is required.'
    }
  }

  // Error keys for validation messages
  formErrors = {
    docDate: '',
    docDate2: '',
    fixedAssetId: '',
    storeId: ''
  }

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private injector: Injector,
    public ngxService: NgxsCustomService,
    private fixedReportService: FixedAssetReportService,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Asset Name',
        field: 'fixedAsset',
        cellStyle: {textAlign: 'left'}
      },
      {
        headerName: 'Store',
        field: 'store',
        suppressMenu: true,
      },
      /*{
        headerName: 'Date', field: 'docDate', cellStyle: {textAlign: 'left'},
        cellRenderer: (params: any) => {
          const date = params?.data?.docDate != null ? params?.data?.docDate : null;
          return date == null ? null : this.transformDate(date, 'MMM d, y');
        }
      },*/
      {
        headerName: 'Usefull Life',
        field: 'usefullLife',
        cellStyle: {textAlign: 'left'}
      },
      /*{
        headerName: 'Quantity',
        field: 'quantity',
        suppressMenu: true,
        cellStyle: {textAlign: 'left'},
        valueFormatter: (params: ValueFormatterParams) => {
          return DocType[params.value]
        }
      },*/

      // },
      {
        headerName: 'Unit Cost',
        field: 'unitCost',
        suppressMenu: true,
        valueFormatter: (params) => this.valueFormatter(params.value),
        cellStyle: {textAlign: 'left'}
      },
      {
        headerName: 'Dep Charged For The Period',
        field: 'depChargedForThePeriod',
        suppressMenu: true,
        valueFormatter: (params) => this.valueFormatter(params.value)
      },
      {
        headerName: 'Opening Accumulated Dep.',
        field: 'openingAccDep',
        suppressMenu: true,
      },
      {
        headerName: 'Category',
        field: 'category',
        colId: 'balance',
        suppressMenu: true,
      },
      {
        headerName: 'Dep. Rate',
        field: 'depRate',
        suppressMenu: true,
      },
      {
        headerName: 'Closing Accumulated Depreciation',
        field: 'closingAccDep',
        suppressMenu: true,
      },

      {
        headerName: 'NBV',
        field: 'nbv',
        suppressMenu: true,
      }
    ];
  }

  onRowDoubleClicked($event: any) {
  }

  ngOnInit(): void {

    // AG Grid Options
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.suppressAggFuncInHeader = true;

    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ['filterMenuTab'],
    };

    /*this.autoGroupColumnDef = {
      headerName: 'Account',
      menuTabs: ['filterMenuTab'],
      minWidth: 300,
      filterValueGetter: (params) => params.data.accountName,
      cellRendererParams: {
        suppressCount: true,
        checkbox: false,
      },
    }*/

    // initializing formGroup
    this.assetReportForm = this.fb.group({
      docDate: ['', [Validators.required]],
      docDate2: ['', [Validators.required]],
      fixedAssetId: [''],
      storeId: [''],
    });

    // Get Data From Store
    // this.ngxsService.getAllBusinessPartnerFromState();
    this.ngxService.getWarehouseFromState();
    this.ngxService.getAssetsFromState();
    // this.ngxsService.getAccountLevel4FromState()
    // this.ngxsService.getCampusFromState()

    // handling dueDate logic
    this.assetReportForm.get('docDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.assetReportForm.get('docDate2').value < this.assetReportForm.get('docDate').value
    })
  }

  onSubmit() {
    if (this.assetReportForm.invalid) {
      this.logValidationErrors(this.assetReportForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapFormValueToModel();
    this.isLoading = true;
    this.fixedReportService.getFixedAssetReport(this.reportModel)
      .subscribe((res) => {
        this.rowData = res.result;
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
  }

  reset() {
    this.formDirective.resetForm();
    // this.formSubmitAttempt = false;
    // this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    // for PDF
    this.disability = true;
  }

  onFirstDataRendered(params: any) {
    // params.api.sizeColumnsToFit();
  }

  private mapFormValueToModel() {
    this.reportModel.fromDate = this.transformDate(this.assetReportForm.value.docDate, 'yyyy-MM-dd');
    this.reportModel.toDate = this.transformDate(this.assetReportForm.value.docDate2, 'yyyy-MM-dd');
    this.reportModel.fixedAssetId = this.assetReportForm.value.fixedAssetId.id;
    this.reportModel.storeId = this.assetReportForm.value.storeId.id;
  }

  printFixedAssetReport() {
    this.fixedReportService.setFixedAssetDataForPrintComponent(this.rowData);
    this.router.navigate(['/' + ASSET_REPORT.PRINT], {
      queryParams: {
        fromDate: this.dateHelperService.transformDate(this.assetReportForm.value.docDate, 'MMM d, y'),
        toDate: this.dateHelperService.transformDate(this.assetReportForm.value.docDate2, 'MMM d, y'),
        fixedAsset: (this.assetReportForm.value.fixedAssetId?.name || 'All'),
        warehouse: (this.assetReportForm.value.storeId?.name || 'All'),
      }
    })
  }
}
