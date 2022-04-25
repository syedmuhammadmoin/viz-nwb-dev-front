import { PURCHASE_ORDER, BILL, GOODS_RECEIVED_NOTE } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, Component, Injector, OnInit} from '@angular/core';
import { PurchaseOrderService} from '../service/purchase-order.service';
import { ActivatedRoute, Router} from '@angular/router';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { ActionButton, DocumentStatus, DocType } from 'src/app/views/shared/AppEnum';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { FirstDataRenderedEvent, GridOptions,  ValueFormatterParams} from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'kt-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PurchaseOrderDetailComponent extends AppComponentBase implements OnInit {

  //routing
  public PURCHASE_ORDER= PURCHASE_ORDER;
  public BILL= BILL;
  public GOODS_RECEIVED_NOTE=GOODS_RECEIVED_NOTE

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  purchaseOrderMaster: any;
  purchaseOrderLines: any ;
  gridOptions: GridOptions;

  totalBeforeTax: number;
  totalTax: number;
  total: number;

  loader: boolean = true;

  //need for routing
  purchaseOrderId: number;

  //busy loading
  isLoading: boolean;

  columnDefs = [
    {headerName: 'Item', field: 'item', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Account', field: 'accountName', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Cost', field: 'cost', sortable: true, filter: true, cellStyle: {'font-size': '12px'},
    valueFormatter: (params: ValueFormatterParams) => {
      return this.valueFormatter(params.value)
    }},
    {
      headerName: 'Tax%', field: 'tax', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value) + '%'
      }
    },
    {
      headerName: 'Sub Total', field: 'subTotal', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Warehouse', 
      field: 'warehouse', 
      sortable: true, 
      filter: true, 
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
  ];


  constructor(
    private activatedRoute: ActivatedRoute,
    private purchaseOrderService: PurchaseOrderService,
    private cdRef:ChangeDetectorRef,
    private router: Router,
    private layoutUtilService: LayoutUtilsService,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
  }

  ngOnInit(): void {
    this.gridOptions.rowStyle = {color: 'black'};
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
    // this.gridOptions.suppressHorizontalScroll = true;

    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.getPurchaseMasterData(id);
        this.purchaseOrderId = id;
        this.cdRef.markForCheck();
      } else {
        this.layoutUtilService.showActionNotification('Cannot find record with out id parameter', null, 5000, true, false)
        this.router.navigate(['/'+PURCHASE_ORDER.LIST])
      }
    });
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent ) {
    params.api.sizeColumnsToFit();
  }

  private getPurchaseMasterData(id: number) {
    this.purchaseOrderService.getPurchaseOrderById(id).subscribe((res) => {
      this.purchaseOrderMaster = res.result;
      this.purchaseOrderLines = res.result.purchaseOrderLines;
      this.totalBeforeTax = this.purchaseOrderMaster.totalBeforeTax;
      this.totalTax = this.purchaseOrderMaster.totalTax;
      this.total = this.purchaseOrderMaster.totalAmount;
      this.cdRef.detectChanges()
    }, (error => {
      console.log(error);
    }))
  }

  workflow(action: any) {
    this.isLoading = true
    this.purchaseOrderService.workflow({action, docId: this.purchaseOrderMaster.id})
      .subscribe((res) => {
        this.getPurchaseMasterData(this.purchaseOrderId);
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'purchase Order');
      }, (err) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.error('' + err.error.message, 'purchase Order')
      })
  }
}


