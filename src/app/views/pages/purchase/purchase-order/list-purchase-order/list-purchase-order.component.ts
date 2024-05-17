import { PURCHASE_ORDER } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { PurchaseOrderService } from "../service/purchase-order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IPurchaseOrder } from '../model/IPurchaseOrder';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';
import { IFilterationModel } from 'src/app/views/shared/components/grid-filteration/FilterationModel';


@Component({
  selector: 'kt-list-purchase-order',
  templateUrl: './list-purchase-order.component.html',
  styleUrls: ['./list-purchase-order.component.scss']
})

export class ListPurchaseOrderComponent extends AppComponentBase implements OnInit {

  purchaseOrderList: IPurchaseOrder[];
  FilteredData:any[] = [];
  month:string;
  year:string;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  

  constructor(
    private _purchaseOrderService: PurchaseOrderService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  //Defining Purchase Order Columns
  columnDefs = [
    {
      headerName: 'PO #',
      field: 'docNo',
      tooltipField: 'status',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Vendor',
      field: 'vendorName',
      tooltipField: 'status',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Purchase Order Date',
      field: 'poDate',
      tooltipField: 'status',
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
      headerName: 'Due Date',
      field: 'dueDate',
      tooltipField: 'status',
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
      headerName: 'Total',
      field: 'totalAmount',
      tooltipField: 'status',
      cellStyle: { 'text-align': "right" },
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          values: ['Draft', 'Rejected', 'Open', 'Closed', 'Submitted', 'Reviewed'],
          defaultToNothingSelected: true,
          suppressSorting:true,
          suppressSelectAll: true,
          suppressAndOrCondition: true,
        },
    },
  ]; 
  ngOnInit(): void {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      resizable: true,
    }

    this.components = {
      loadingCellRenderer: function (params: any) {
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

  addPurchaseOrder() {
    this.router.navigate(['/'+PURCHASE_ORDER.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/'+ PURCHASE_ORDER.ID_BASED_ROUTE('details', event.data.id)], { relativeTo: this.activatedRoute })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    var dataSource = {
      getRows: (params: any) => {        
        params.month = this.month;
        params.year = this.year;        
        this._purchaseOrderService.getRecords(params).subscribe((data) => {
          if(isEmpty(data.result)) {
            this.gridApi.showNoRowsOverlay()
          
            
          } else {
            this.FilteredData = data.result;
            this.gridApi.hideOverlay();         
          }
          params.successCallback(this.FilteredData || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setDatasource(dataSource);
  }


  fetchData(x: any) {              
    const dataSource = {
      getRows: (params: any) => {        
        this._purchaseOrderService.getRecordByYearMonth(x.startDate ,x.endDate )
          .subscribe((data) => {
            if (isEmpty(data.result)) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();             
              this.FilteredData = data.result;
            }
            params.successCallback(this.FilteredData || 0, data.totalRecords);
            this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName');
            this.cdRef.detectChanges();
        });
      },
    };
    this.gridApi.setDatasource(dataSource);
}
}