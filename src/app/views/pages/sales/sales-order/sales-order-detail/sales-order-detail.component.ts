import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { SaleOrderService } from '../service/sale-order.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType } from 'src/app/views/shared/AppEnum';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DISPATCH_NOTE, INVOICE, SALES_ORDER } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ISalesOrder } from '../model/ISalesOrder';

@Component({
  selector: 'kt-sales-order-detail',
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SalesOrderDetailComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  salesOrderId: number;

  public SALES_ORDER = SALES_ORDER;
  public INVOICE = INVOICE;
  public DISPATCH_NOTE = DISPATCH_NOTE;

  salesOrderMaster: any;
  salesOrderLines: any;
  gridOptions: GridOptions = {};
  totalBeforeTax: number;
  totalTax: number;
  total: number;
  loader: boolean = true;

  columnDefs = [
    { headerName: 'Item', field: 'item', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Price', field: 'price', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Tax%', field: 'tax', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      cellRenderer: (params: ICellRendererParams) => {
        return params.data.tax + '%';
      }
    },
    {
      headerName: 'Sub total', field: 'subtotal', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'Account', field: 'account', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Location', field: 'location', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private salesOrderService: SaleOrderService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private layoutUtilService: LayoutUtilsService,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.gridOptions.rowStyle = { color: 'black' };
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.getSalesOrderData(id);
        this.salesOrderId = id;
        this.cdRef.markForCheck();
      } else {
        this.layoutUtilService.showActionNotification('Cannot find record with out id parameter', null, 5000, true, false)
        this.router.navigate(['/sales-order/list'])
      }
    });
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  private getSalesOrderData(id: number) {
    this.salesOrderService.getSalesOrderById(id).subscribe((res: IApiResponse<ISalesOrder>) => {
      this.salesOrderMaster = res.result;
      this.salesOrderLines = res.result.salesOrderLines;
      this.totalBeforeTax = this.salesOrderMaster.totalBeforeTax;
      this.totalTax = this.salesOrderMaster.totalTax;
      this.total = this.salesOrderMaster.total;
      this.cdRef.detectChanges()
    })
  }

  workflow(action: number) {
    this.isLoading = true
    this.salesOrderService.workflow({ action, docId: this.salesOrderMaster.id })
      .subscribe((res) => {
        this.getSalesOrderData(this.salesOrderId);
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'sales Order');
      }, (err) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.error('' + err.error.message, 'sales Order')
      })
  }
}
