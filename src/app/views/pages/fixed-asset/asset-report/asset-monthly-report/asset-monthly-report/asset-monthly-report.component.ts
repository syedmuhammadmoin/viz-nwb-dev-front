import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AppComponentBase} from '../../../../../shared/app-component-base';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {GridOptions} from 'ag-grid-community';
import {IFixedAssetReport} from '../../model/IFixedAssetReport';
import {IReport} from '../../model/IReport';
import {NgxsCustomService} from '../../../../../shared/services/ngxs-service/ngxs-custom.service';
import {FixedAssetReportService} from '../../services/fixed-asset-report.service';
import {ASSET_REPORT} from '../../../../../shared/AppRoutes';

@Component({
  selector: 'kt-asset-monthly-report',
  templateUrl: './asset-monthly-report.component.html',
  styleUrls: ['./asset-monthly-report.component.scss']
})
export class AssetMonthlyReportComponent extends AppComponentBase implements OnInit {

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  // gridOptions: any;

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
  gridOptions: any;
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
  formErrors: any = {
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
        suppressHeaderMenuButton: true,
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
        suppressHeaderMenuButton: true,
        cellStyle: {textAlign: 'left'},
        valueFormatter: (params: ValueFormatterParams) => {
          return DocType[params.value]
        }
      },*/

      // },
      {
        headerName: 'Unit Cost',
        field: 'unitCost',
        suppressHeaderMenuButton: true,
        valueFormatter: (params) => this.valueFormatter(params.value),
        cellStyle: {textAlign: 'left'}
      },
      {
        headerName: 'Month',
        field: 'month',
        suppressHeaderMenuButton: true,
        cellStyle: {textAlign: 'left'}
      },
      {
        headerName: 'Dep Charged For The Period',
        field: 'depChargedForThePeriod',
        suppressHeaderMenuButton: true,
        valueFormatter: (params) => this.valueFormatter(params.value)
      },
      {
        headerName: 'Opening Accumulated Dep.',
        field: 'openingAccDep',
        suppressHeaderMenuButton: true,
      },
      {
        headerName: 'Category',
        field: 'category',
        colId: 'balance',
        suppressHeaderMenuButton: true,
      },
      {
        headerName: 'Dep. Rate',
        field: 'depRate',
        suppressHeaderMenuButton: true,
      },
      {
        headerName: 'Closing Accumulated Depreciation',
        field: 'closingAccDep',
        suppressHeaderMenuButton: true,
      },

      {
        headerName: 'NBV',
        field: 'nbv',
        suppressHeaderMenuButton: true,
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
      sortable: false,
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
    this.fixedReportService.getFixedAssetMonthlyReport(this.reportModel)
      .subscribe((res) => {
        this.rowData = res.result;
        if (this.rowData.length > 0) {
          this.disability = false
        }
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
    this.fixedReportService.setFixedAssetMonthlyDataForPrintComponent(this.rowData);
    this.router.navigate(['/' + ASSET_REPORT.MONTHLY_PRINT], {
      queryParams: {
        fromDate: this.dateHelperService.transformDate(this.assetReportForm.value.docDate, 'MMM d, y'),
        toDate: this.dateHelperService.transformDate(this.assetReportForm.value.docDate2, 'MMM d, y'),
        fixedAsset: (this.assetReportForm.value.fixedAssetId?.name || 'All'),
        warehouse: (this.assetReportForm.value.storeId?.name || 'All'),
      }
    })
  }
}
