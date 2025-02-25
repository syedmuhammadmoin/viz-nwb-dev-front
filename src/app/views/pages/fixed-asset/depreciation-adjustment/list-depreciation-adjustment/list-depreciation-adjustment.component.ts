import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ValueFormatterParams
} from 'ag-grid-community';
import {Permissions} from '../../../../shared/AppEnum';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CustomTooltipComponent} from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import {DEPRECIATION_ADJUSTMENT} from '../../../../shared/AppRoutes';
import {isEmpty} from 'lodash';
import {DepreciationAdjustmentService} from '../service/depreciation-adjustment.service';
import {IDepreciationAdjustment} from '../model/IDepreciationAdjustment';

@Component({
  selector: 'kt-list-asset-adjustment',
  templateUrl: './list-depreciation-adjustment.component.html',
  styleUrls: ['./list-depreciation-adjustment.component.scss']
})
export class ListDepreciationAdjustmentComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: any;
  DepreciationAdjustmentList: IDepreciationAdjustment[];
  FilteredData: any[]=[];
  tooltipData = 'double click to view detail'
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  // Injecting Dependencies
  constructor(
    private depreciationAdjustmentService: DepreciationAdjustmentService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }

  // Defining AG Grid Columns
  columnDefs = [
    {
      headerName: 'Doc #',
      field: 'docNo',
      tooltipField: 'docNo',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Date',
      field: 'dateOfDepreciationAdjustment',
      tooltipField: 'docNo',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Description',
      field: 'description',
      tooltipField: 'docNo',
      suppressHeaderMenuButton: true,
    },
    /*{
      headerName: 'Debit',
      field: 'totalDebit',
      headerClass: 'custom_left',
      cellStyle: {'text-align': 'right'},
      tooltipField: 'docNo',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Credit',
      field: 'totalCredit',
      headerClass: 'custom_left',
      cellStyle: {'text-align': 'right'},
      tooltipField: 'docNo',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },*/
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        values: ['Draft', 'Rejected', 'Unpaid', 'Partial', 'Paid', 'Submitted', 'Reviewed'],
        defaultToNothingSelected: true,
        suppressSorting: true,
        suppressSelectAll: true,
        suppressAndOrCondition: true,
      },
    },
  ];


  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: 'double click to view detail'
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
    }

    this.components = {
      customTooltip: CustomTooltipComponent,
      loadingCellRenderer(params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  addDepreciationAdjustment() {
    this.router.navigate(['/' + DEPRECIATION_ADJUSTMENT.CREATE])
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + DEPRECIATION_ADJUSTMENT.ID_BASED_ROUTE('details', event.data.id)]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    const dataSource = {
      getRows: (params: any) => {
        this.depreciationAdjustmentService.getRecords(params).subscribe((data) => {
          if (isEmpty(data.result)) {
            this.gridApi.showNoRowsOverlay()
          } else {
            this.FilteredData = data.result;
            this.gridApi.hideOverlay();
          }
          params.successCallback(this.FilteredData || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'DepreciationAdjustmentPageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }
    
  fetchData(x: any) {           
    const dataSource = {
      getRows: (params: any) => {        
        this.depreciationAdjustmentService.getRecordByYearMonth(x.startDate ,x.endDate )
          .subscribe((data) => {
            if (isEmpty(data.result)) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();             
              this.FilteredData = data.result;
            }
            params.successCallback(this.FilteredData || 0 ,data.totalRecords);
            this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName');
            this.cdRef.detectChanges();
        });
      },
    };
    this.gridApi.setDatasource(dataSource);
}
}
