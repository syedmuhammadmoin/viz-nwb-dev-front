import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { SaleOrderService } from "../service/sale-order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { SALES_ORDER } from 'src/app/views/shared/AppRoutes';
import { ISalesOrder } from '../model/ISalesOrder';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Component({
  selector: 'kt-list-sale-order',
  templateUrl: './list-sale-order.component.html',
  styleUrls: ['./list-sale-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListSaleOrderComponent extends AppComponentBase implements OnInit {

  salesOrderList: ISalesOrder[];
  defaultColDef: ColDef;
  gridOptions: GridOptions;
  frameworkComponents: {[p: string]: unknown};
  tooltipData: string = "double click to view detail"

  constructor(private saleOrderService: SaleOrderService,
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

    { headerName: 'SO #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status' },
    { headerName: 'Customer', field: 'customer', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Order Date',
      field: 'salesOrderDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.salesOrderDate != null ? params.data.salesOrderDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      },
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.dueDate != null ? params.data.dueDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      },
    },
    {
      headerName: 'Total', field: 'total', sortable: true, filter: true, tooltipField: 'status',
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'status' },
  ];


  ngOnInit(): void {

    this.getSalesOrderList()

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit()
  }

  addSalesOrder() {
    this.router.navigate(['/' + SALES_ORDER.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + SALES_ORDER.ID_BASED_ROUTE('details' ,  event.data.id)], { relativeTo: this.activatedRoute })
  }

  getSalesOrderList() {
    this.saleOrderService.getSalesOrders().subscribe((res: IPaginationResponse<ISalesOrder[]>) => {
      this.salesOrderList = res.result;
      this.cdRef.markForCheck();
    })
  }
}
