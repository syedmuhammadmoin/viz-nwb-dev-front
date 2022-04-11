import { BILL, DEBIT_NOTE, PAYMENT } from '../../../../shared/AppRoutes';
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
  public BILL=BILL;
  public DEBIT_NOTE=DEBIT_NOTE;
  public PAYMENT=PAYMENT;
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
  totalBeforeTax: number;
  totalTax: number;
  totalBillAmount: number;
  transactionId: number
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
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining columns for ag grid
  columnDefs = [
    { headerName: 'Item', field: 'itemName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
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
      headerName: 'Sub total', field: 'subTotal', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'COA', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Warehouse', field: 'warehouseName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
  ];


  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.getBillMasterData(id);
        this.billId = id;
        this.cdr.markForCheck();
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
    this.vendorBillService.getVendorBillMaster(id).subscribe(res => {
      this.billMaster = res.result;
      this.billLines = res.result.billLines;
      this.totalBeforeTax = this.billMaster.totalBeforeTax;
      this.totalTax = this.billMaster.totalTax;
      this.totalBillAmount = this.billMaster.totalAmount;
      this.businessPartnerId = this.billMaster.vendorId;
      this.transactionId = this.billMaster.transactionId;
      this.status = this.billMaster.status;
      this.paidAmount = this.billMaster.totalPaid;
      this.pendingAmount = this.billMaster.pendingAmount;
      this.paidAmountList = this.billMaster.paidAmountList == null ? [] : this.billMaster.paidAmountList;
      this.bpUnReconPaymentList = this.billMaster.bpUnreconPaymentList == null ? [] : this.billMaster.bpUnreconPaymentList;

      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, (err: any) => console.log(err));
  }

  //on dialogue open funtions
  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        accountId: this.billMaster.accountPayableId,
        paymentType: 2,
        transactionId: this.transactionId,
        businessPartnerId: this.businessPartnerId,
        pendingAmount: this.pendingAmount,
        formName: 'Bill'
      }
    });
    //Recalling getBillMasterData function on dialog close
    dialogRef.afterClosed().subscribe(result => {
      this.getBillMasterData(this.billId);
      this.cdr.markForCheck();
    });
  }

  reconcile(index: number) {
    // initializing empty model
    this.transactionReconModel = {} as ITransactionRecon;
    this.mapTransactionReconModel(index);
    //console.log(this.transactionReconModel)
    this.vendorBillService.createTransitionReconcile(this.transactionReconModel).pipe(
      take(1),
      finalize(() => this.isLoading = false))
      .subscribe(
        () => {
          this.toastService.success('Reconciled Successfully', 'Bill')
          this.getBillMasterData(this.billId);
          this.cdr.detectChanges();
          this.cdr.markForCheck();
        },
        (err: any) => {
          this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Reconciling')
          console.log(err)
        }
      );
  }

  mapTransactionReconModel(index: number) {
    this.transactionReconModel.paymentTransactionId = this.bpUnReconPaymentList[index].paymentTransactionId;
    this.transactionReconModel.documentTransactionId = this.transactionId;
    this.transactionReconModel.amount = this.bpUnReconPaymentList[index].amount > this.pendingAmount
      ? this.pendingAmount
      : this.bpUnReconPaymentList[index].amount;
  };

  workflow(action: any) {
    this.isLoading = true
    this.vendorBillService.workflow({ action, docId: this.billMaster.id })
      .subscribe((res) => {
        this.getBillMasterData(this.billId);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.success('' + res.message, 'Vendor Bill');
      }, (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.error('' + err.error.message, 'Vendor Bill')
      })
  }

}




