import { BILL, DEBIT_NOTE, JOURNAL_ENTRY, PAYMENT } from '../../../../shared/AppRoutes';
import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, } from '@angular/router';
import { FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { VendorBillService } from '../services/vendor-bill.service';
import { finalize, take } from 'rxjs/operators';

import { ActionButton, DocumentStatus, DocType } from 'src/app/views/shared/AppEnum';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ITransactionRecon } from '../model/ITransactionRecon';
import { RegisterPaymentComponent } from '../../../sales/invoice/register-payment/register-payment.component';

@Component({
  selector: 'kt-vendor-bill-detail',
  templateUrl: './vendor-bill-detail.component.html',
  styleUrls: ['./vendor-bill-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class VendorBillDetailComponent extends AppComponentBase implements OnInit {

  //routing variables
  public BILL = BILL;
  public DEBIT_NOTE = DEBIT_NOTE;
  public PAYMENT = PAYMENT;
  public JOURNAL_ENTRY = JOURNAL_ENTRY;
  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  transactionReconModel: ITransactionRecon;
  // handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: any;

  //need for routing
  billId: number;

  //need for Register Payment
  transactionId: number
  ledgerId: number
  businessPartnerId: number;
  // Variables for bill data
  billLines: any;
  billMaster: any;
  loader: boolean = true;
  paidAmountList: any = [];
  pendingAmount: any;
  status: string;
  paidAmount: number;
  bpUnReconPaymentList: any = [];

  constructor(private vendorBillService: VendorBillService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining columns for ag grid
  columnDefs = [
    { 
      headerName: 'Item', 
      field: 'itemName', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return params.value || 'N/A'
      }
     },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Cost', field: 'cost', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Tax', field: 'tax', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      cellRenderer: (params: ICellRendererParams) => {
        return params.data.tax + '%';
      }
    },
    {
      headerName: 'Other Taxes/FET', field: 'anyOthertax', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      cellRenderer: (params: ICellRendererParams) => {
        return params.data.anyOtherTax;
      }
    },
    {
      headerName: 'Sub total', field: 'subTotal', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'COA', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { 
      headerName: 'Store', 
      field: 'warehouseName', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return params.value || 'N/A'
      }
     },
  ];


  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.getBillMasterData(id);
        this.billId = id;
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Bill master data
  getBillMasterData(id: number) {
    this.vendorBillService.getVendorBillById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe(res => {
      this.billMaster = res.result;
      this.billLines = res.result.billLines;
      this.businessPartnerId = this.billMaster.vendorId;
      this.transactionId = this.billMaster.transactionId;
      this.ledgerId = this.billMaster.ledgerId;
      this.status = this.billMaster.status;
      this.paidAmount = this.billMaster.totalPaid;
      this.pendingAmount = this.billMaster.pendingAmount;
      this.paidAmountList = this.billMaster.paidAmountList == null ? [] : this.billMaster.paidAmountList;
      this.bpUnReconPaymentList = this.billMaster.bpUnreconPaymentList == null ? [] : this.billMaster.bpUnreconPaymentList;

      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    })
  }

  //on dialogue open funtions
  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        accountId: this.billMaster.payableAccountId,
        paymentType: 2,
        documentLedgerId: this.ledgerId,
        campusId: this.billMaster.campusId,
        businessPartnerId: this.businessPartnerId,
        pendingAmount: this.pendingAmount,
        formName: 'Bill',
        docType: DocType.Payment
      }
    });
    //Recalling getBillMasterData function on dialog close
    dialogRef.afterClosed().subscribe(result => {
      this.getBillMasterData(this.billId);
      this.cdRef.markForCheck();
    });
  }

  reconcile(index: number) {
    // initializing empty model
    this.transactionReconModel = {} as ITransactionRecon;
    this.mapTransactionReconModel(index);
    //console.log(this.transactionReconModel)
    this.vendorBillService.createTransitionReconcile(this.transactionReconModel)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        () => {
          this.toastService.success('Reconciled Successfully', 'Bill')
          this.getBillMasterData(this.billId);
          this.cdRef.detectChanges();
          this.cdRef.markForCheck();
        }
      );
  }

  mapTransactionReconModel(index: number) {
    this.transactionReconModel.paymentLedgerId = this.bpUnReconPaymentList[index].paymentLedgerId;
    this.transactionReconModel.documentLedgerId = this.ledgerId;
    this.transactionReconModel.amount = this.bpUnReconPaymentList[index].amount > this.pendingAmount
      ? this.pendingAmount
      : this.bpUnReconPaymentList[index].amount;
  };

  workflow(action: any) {
    this.isLoading = true
    this.vendorBillService.workflow({ action, docId: this.billMaster.id })
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getBillMasterData(this.billId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Vendor Bill');
      })
  }

}




