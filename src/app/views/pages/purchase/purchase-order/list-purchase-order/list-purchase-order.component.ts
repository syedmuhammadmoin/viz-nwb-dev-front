import { PURCHASE_ORDER } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GridOptions } from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { PurchaseOrderService } from "../service/purchase-order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';


@Component({
  selector: 'kt-list-purchase-order',
  templateUrl: './list-purchase-order.component.html',
  styleUrls: ['./list-purchase-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListPurchaseOrderComponent extends AppComponentBase implements OnInit {

  purchaseOrderList: any;
  gridOptions: GridOptions;
  frameworkComponents: any;
  defaultColDef: any;
  tooltipData: string = "double click to view detail"

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
    { headerName: 'PO #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status' },
    { headerName: 'Vendor', field: 'vendor', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Order Date',
      field: 'poDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params: any) => {
        const date = params.data.poDate != null ? params.data.poDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params: any) => {
        const date = params.data.dueDate != null ? params.data.dueDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      },
    },
    {
      headerName: 'Total', field: 'total', sortable: true, filter: true, tooltipField: 'status',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'status' },
  ];

  ngOnInit(): void {
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = { customTooltip: CustomTooltipComponent };

    this.loadPurchaseOrderList();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  addPurchaseOrder() {
    this.router.navigate(['/'+PURCHASE_ORDER.CREATE]);
  }

  onRowDoubleClicked(event: any) {
    console.log('/'+PURCHASE_ORDER.ID_BASED_ROUTE('details', event.data.id));
    this.router.navigate(['/'+PURCHASE_ORDER.ID_BASED_ROUTE('details', event.data.id)], { relativeTo: this.activatedRoute })
  }

  loadPurchaseOrderList() {
    this._purchaseOrderService.getAllPurchaseOrders().subscribe((res) => {
      this.purchaseOrderList = res.result;
      this.cdRef.markForCheck();
    })
  }
}



