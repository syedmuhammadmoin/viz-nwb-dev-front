import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { InvoiceService } from '../services/invoice.service';
import { RegisterPaymentComponent } from '../register-payment/register-payment.component'
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ITransactionRecon } from '../../../purchase/vendorBill/model/ITransactionRecon';
import { CREDIT_NOTE, INVOICE, JOURNAL_ENTRY, RECEIPT } from 'src/app/views/shared/AppRoutes';
import { IInvoiceLines } from '../model/IInvoiceLines';
import { IInvoice } from '../model/IInvoice';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Component({
  selector: 'kt-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoiceDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public INVOICE = INVOICE;
  public JOURNAL_ENTRY = JOURNAL_ENTRY;
  public CREDIT_NOTE = CREDIT_NOTE;
  public RECEIPT = RECEIPT;

  transactionReconModel: ITransactionRecon;

  //handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  invoiceId: number;

  loader: boolean = true;

  //Variables for Invoice data
  invoiceLines: IInvoiceLines | any
  invoiceMaster: IInvoice | any;
  bpUnReconPaymentList: any = [];
  pendingAmount: any;
  status: string;
  paidAmount: number;
  paidAmountList: any = [];

  //need for Register Payment
  totalBeforeTax: number;
  totalTax: number;
  totalInvoiceAmount: number;
  businessPartnerId: number;
  transactionId: number

  constructor(
    private invoiceService: InvoiceService,
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
      headerName: 'Price',
      field: 'price',
      filter: true,
      cellStyle: { 'font-size': '12px' },
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
      headerName: 'Subtotal',
      field: 'subTotal',
      filter: true,
      cellStyle: { 'font-size': '12px' },
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
    }
  ];

  ngOnInit() {
    // initializing empty model
    this.transactionReconModel = {} as ITransactionRecon;

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.invoiceId = id;
        this.getInvoiceData(id);
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

  //Getting invoice master data
  getInvoiceData(id: number) {
    this.invoiceService.getInvoiceById(id).subscribe((res: IApiResponse<IInvoice>) => {
      this.invoiceMaster = res.result;
      this.invoiceLines = res.result.invoiceLines;
      this.totalBeforeTax = this.invoiceMaster.totalBeforeTax;
      this.totalTax = this.invoiceMaster.totalTax;
      this.totalInvoiceAmount = this.invoiceMaster.totalAmount;
      this.status = this.invoiceMaster.status;
      this.businessPartnerId = this.invoiceMaster.customerId;
      this.transactionId = this.invoiceMaster.transactionId;
      this.paidAmount = this.invoiceMaster.totalPaid;
      this.pendingAmount = this.invoiceMaster.pendingAmount;
      this.paidAmountList = this.invoiceMaster.paidAmountList == null ? [] : this.invoiceMaster.paidAmountList;
      this.bpUnReconPaymentList = this.invoiceMaster.bpUnreconPaymentList == null ? [] : this.invoiceMaster.bpUnreconPaymentList;

      // //handling disablity of register payment button
      // this.isDisabled = (this.invoiceMaster.status === "Paid" ? true : false)
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, (err: any) => console.log(err));
  }

  //on dialogue open funtions
  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        accountId: this.invoiceMaster.accountReceivableId,
        paymentType: 1,
        transactionId: this.transactionId,
        businessPartnerId: this.businessPartnerId,
        pendingAmount: this.pendingAmount,
        formName: 'Invoice'
      }
    });
    //Recalling getInvoiceData function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getInvoiceData(this.invoiceId);
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  reconcile(index: number) {
    this.mapTransactionReconModel(index);
    this.invoiceService.reconcilePayment(this.transactionReconModel).pipe(
      take(1),
      finalize(() => this.isLoading = false))
      .subscribe(() => {
          this.toastService.success('Reconciled Successfully', 'Invoice')
          this.getInvoiceData(this.invoiceId);
          this.cdr.detectChanges();
          this.cdr.markForCheck();
        },
        (err) => this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Reconciling')
      );
  }

  mapTransactionReconModel(index: number) {
    this.transactionReconModel.paymentTransactionId = this.bpUnReconPaymentList[index].paymentTransactionId;
    this.transactionReconModel.documentTransactionId = this.transactionId;
    this.transactionReconModel.amount = this.bpUnReconPaymentList[index].amount > this.pendingAmount
      ? this.pendingAmount
      : this.bpUnReconPaymentList[index].amount;
  };

  workflow(action: number) {
    this.isLoading = true
    this.invoiceService.workflow({ action, docId: this.invoiceMaster.id })
      .subscribe((res) => {
        this.getInvoiceData(this.invoiceId);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.success('' + res.message, 'Invoice');
      }, (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.error('' + err.error.message, 'Invoice')
      })
  }
}
