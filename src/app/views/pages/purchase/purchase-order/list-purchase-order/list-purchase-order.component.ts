import { PURCHASE_ORDER } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { PurchaseOrderService } from "../service/purchase-order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IPurchaseOrder } from '../model/IPurchaseOrder';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';


@Component({
  selector: 'kt-list-purchase-order',
  templateUrl: './list-purchase-order.component.html',
  styleUrls: ['./list-purchase-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListPurchaseOrderComponent extends AppComponentBase implements OnInit {

  purchaseOrderList: IPurchaseOrder[];
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
    private router: Router,
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

  columnDefs = [
    { headerName: 'PO #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status', cellRenderer: "loadingCellRenderer"  },
    { headerName: 'Vendor', field: 'vendor', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Order Date',
      field: 'poDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'status' },
  ];

  ngOnInit(): void {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
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
    console.log('/'+PURCHASE_ORDER.ID_BASED_ROUTE('details', event.data.id));
    this.router.navigate(['/'+PURCHASE_ORDER.ID_BASED_ROUTE('details', event.data.id)], { relativeTo: this.activatedRoute })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getPurchaseOrders(params: any): Promise<IPaginationResponse<IPurchaseOrder[]>> {
    const result = await this._purchaseOrderService.getPurchaseOrders().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getPurchaseOrders(params);

     if (!res.result) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName')
     this.cdRef.detectChanges();
   },
  };

  // loadPurchaseOrderList() {
  //   this._purchaseOrderService.getPurchaseOrders().subscribe((res) => {
  //     this.purchaseOrderList = res.result;
  //     this.cdRef.markForCheck();
  //   })
  // }
}



