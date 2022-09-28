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
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';
import { MatDialog } from '@angular/material/dialog';


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

  //Showing Remarks
  remarksList: string[] = [];

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
    public dialog: MatDialog,
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
    this.gridOptions.rowHeight = 30;
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
      this.remarksList = this.purchaseOrderMaster.remarksList ?? [] 

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

  //Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    //sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.purchaseOrderService.workflow({action, docId: this.purchaseOrderMaster.id, remarks})
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

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.purchaseOrderMaster,
        serviceClass: this.purchaseOrderService,
        functionName: 'uploadFile',
        name: 'Purchase Order'
      },
    }).afterClosed().subscribe(() => {
      this.getPurchaseMasterData(this.purchaseOrderId)
      this.cdRef.detectChanges()
    })
  }
}


