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
import { finalize, take } from 'rxjs/operators';


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
  public GOODS_RECEIVED_NOTE = GOODS_RECEIVED_NOTE

  grns = [
    {
      docId: 4,
      docNo: "GRN-4"
    },
    {
      docId: 5,
      docNo: "GRN-5"
    },
    {
      docId: 6,
      docNo: "GRN-6"
    },
    {
      docId: 7,
      docNo: "GRN-7"
    }
  ]

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

  gridApi: any

  //busy loading
  isLoading: boolean;

  columnDefs = [
    {
      headerName: 'Item', 
      field: 'item',
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Description', 
      field: 'description', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Account', 
      field: 'accountName', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Quantity', 
      field: 'quantity', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Received', 
      field: 'receivedQuantity',  
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 0
      }
    },
    {
      headerName: 'Cost', 
      field: 'cost', 
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Tax%', 
      field: 'tax', 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value) + '%'
      }
    },
    {
      headerName: 'Sub Total', 
      field: 'subTotal', 
      cellStyle: { 'font-size': '12px' },
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Store', 
      field: 'warehouse',  
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    }
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

    //hide received column initially
    // this.gridOptions.onGridReady = () => {
    //   this.gridOptions.columnApi.setColumnVisible('receivedQuantity', false);
    // }//onGridReady
  }

  ngOnInit(): void {
    this.gridOptions.rowStyle = {color: 'black'};
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
    // this.gridOptions.suppressHorizontalScroll = true;

    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.getPurchaseMasterData(id);
        this.purchaseOrderId = id;
        this.cdRef.markForCheck();
      }
    });
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent ) {
    this.gridApi = params.api
    params.api.sizeColumnsToFit();
  }

  private getPurchaseMasterData(id: number) {
    this.purchaseOrderService.getPurchaseOrderById(id)
    .pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges()
      })
     )
    .subscribe((res) => {
      this.purchaseOrderMaster = res.result;
      this.purchaseOrderLines = res.result.purchaseOrderLines;
      this.totalBeforeTax = this.purchaseOrderMaster.totalBeforeTax;
      this.totalTax = this.purchaseOrderMaster.totalTax;
      this.total = this.purchaseOrderMaster.totalAmount;

      if([DocumentStatus.Draft , DocumentStatus.Rejected , DocumentStatus.Submitted].includes(this.purchaseOrderMaster.state)) {
        this.gridOptions.columnApi.setColumnVisible('receivedQuantity', false);
      }
      else {
        this.gridOptions.columnApi.setColumnVisible('receivedQuantity', true);
        this.gridApi?.sizeColumnsToFit();
      }
      this.cdRef.detectChanges()
    })
  }

  workflow(action: any) {
    this.isLoading = true
    this.purchaseOrderService.workflow({action, docId: this.purchaseOrderMaster.id})
    .pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges()
      })
     )
      .subscribe((res) => {
        this.getPurchaseMasterData(this.purchaseOrderId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'purchase Order');
      })
  }
}


