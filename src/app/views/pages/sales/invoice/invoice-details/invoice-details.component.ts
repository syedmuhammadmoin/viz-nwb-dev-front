import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
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
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';
import { AppConst } from 'src/app/views/shared/AppConst';


@Component({
  selector: 'kt-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
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

  transactionReconModel: ITransactionRecon = {} as ITransactionRecon;

  //Loader
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
  transactionId: number;
  ledgerId: number

  //Showing Remarks
  remarksList: string[] = [];
  currentClient : any = {};
  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining Invoice Columns
  columnDefs = [
    {
      headerName: 'Item',
      field: 'itemName',
      sortable: true,
      filter: true,
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
    {
      headerName: 'Description', field: 'description', sortable: false, filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'COA', field: 'accountName', sortable: false, filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Quantity', field: 'quantity', filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Price',
      field: 'price',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Tax %', field: 'tax', filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' },
      cellRenderer: (params: ICellRendererParams) => {
        return params.data.tax + '%';
      }
    },
    {
      headerName: 'Subtotal',
      field: 'subTotal',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Store',
      field: 'warehouseName',
      cellStyle: { 'font-size': '12px' },
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    }
  ];

  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.invoiceId = id;
        this.isLoading = true;
        this.getInvoiceData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting invoice master data
  getInvoiceData(id: number) {
    this.invoiceService.getInvoiceById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IInvoice>) => {
        this.invoiceMaster = res.result;
        this.invoiceLines = res.result.invoiceLines;
        this.totalBeforeTax = this.invoiceMaster.totalBeforeTax;
        this.totalTax = this.invoiceMaster.totalTax;
        this.totalInvoiceAmount = this.invoiceMaster.totalAmount;
        this.status = this.invoiceMaster.status;
        this.businessPartnerId = this.invoiceMaster.customerId;
        this.ledgerId = this.invoiceMaster.ledgerId;
        this.paidAmount = this.invoiceMaster.totalPaid;
        this.pendingAmount = this.invoiceMaster.pendingAmount;
        this.paidAmountList = this.invoiceMaster.paidAmountList == null ? [] : this.invoiceMaster.paidAmountList;
        this.bpUnReconPaymentList = this.invoiceMaster.bpUnreconPaymentList == null ? [] : this.invoiceMaster.bpUnreconPaymentList;
        this.remarksList = this.invoiceMaster.remarksList ?? []

        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  //on dialogue open funtions
  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        accountId: this.invoiceMaster.receivableAccountId,
        paymentType: 1,
        documentLedgerId: this.ledgerId,
        campusId: this.invoiceMaster.campusId,
        businessPartnerId: this.businessPartnerId,
        pendingAmount: this.pendingAmount,
        formName: 'Invoice',
        docType: DocType.Receipt
      }
    });
    //Getting Updated Invoice Data
    dialogRef.afterClosed().subscribe(() => {
      this.getInvoiceData(this.invoiceId);
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
  }

  reconcile(index: number) {
    this.mapTransactionReconModel(index);
    this.invoiceService.reconcilePayment(this.transactionReconModel)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(() => {
        this.toastService.success('Reconciled Successfully', 'Invoice')
        this.getInvoiceData(this.invoiceId);
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      });
  }

  mapTransactionReconModel(index: number) {
    console.log('this.bpUnReconPaymentList[index].paymentledgerId', this.bpUnReconPaymentList[index].paymentledgerId)
    this.transactionReconModel.paymentLedgerId = this.bpUnReconPaymentList[index].paymentLedgerId;
    this.transactionReconModel.documentLedgerId = this.ledgerId;
    this.transactionReconModel.amount = this.bpUnReconPaymentList[index].amount > this.pendingAmount
      ? this.pendingAmount
      : this.bpUnReconPaymentList[index].amount;
  };

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
    this.invoiceService.workflow({ action, docId: this.invoiceMaster.id, remarks })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.getInvoiceData(this.invoiceId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Invoice');
      })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.invoiceMaster,
        serviceClass: this.invoiceService,
        functionName: 'uploadFile',
        name: 'Invoice'
      },
    }).afterClosed().subscribe(() => {
      this.getInvoiceData(this.invoiceId)
      this.cdRef.detectChanges()
    })
  }
}
