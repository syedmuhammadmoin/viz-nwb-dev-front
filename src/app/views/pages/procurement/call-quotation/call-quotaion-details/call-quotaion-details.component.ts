import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { CallQuotationService } from '../service/call-quotation.service';
// import { RegisterPaymentComponent } from '../register-payment/register-payment.component'
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ITransactionRecon } from '../../../purchase/vendorBill/model/ITransactionRecon';
import { CREDIT_NOTE, CALL_QUOTATION, JOURNAL_ENTRY, RECEIPT } from 'src/app/views/shared/AppRoutes';
import { ICallForQuotationLines } from '../model/ICallQuotationLines';
import { ICallQuotation } from '../model/ICallQuotation';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';


@Component({
  selector: 'kt-call-quotaion-details',
  templateUrl: './call-quotaion-details.component.html',
  styleUrls: ['./call-quotaion-details.component.scss']
})

export class CallQuotaionDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public CALL_QUOTATION = CALL_QUOTATION;
  public JOURNAL_ENTRY = JOURNAL_ENTRY;
  public CREDIT_NOTE = CREDIT_NOTE;
  public RECEIPT = RECEIPT;

  transactionReconModel: ITransactionRecon;

  //handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  callQuotationId: number;

  loader: boolean = true;

  //Variables for Quotation data
  callQuotationMaster: ICallQuotation | any;
  callForQuotationLines: ICallForQuotationLines | any;
  bpUnReconPaymentList: any = [];
  pendingAmount: any;
  status: string;
  paidAmount: number;
  paidAmountList: any = [];

  //need for Register Payment
  totalBeforeTax: number;
  totalTax: number;
  totalCallQuotationAmount: number;
  businessPartnerId: number;
  transactionId: number;
  ledgerId: number

  //Showing Remarks
  remarksList: string[] = [];

  constructor(
    private callquotationService: CallQuotationService,
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
      field: 'item', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return params.value || 'N/A'
      }
     },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    // { headerName: 'COA', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    // {
    //   headerName: 'Price',
    //   field: 'price',
    //   filter: true,
    //   cellStyle: { 'font-size': '12px' },
    //   valueFormatter: (params: ICellRendererParams) => {
    //     return this.valueFormatter(params.value)
    //   }
    // },
    // {
    //   headerName: 'Tax %', field: 'tax', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
    //   cellRenderer: (params: ICellRendererParams) => {
    //     return params.data.tax + '%';
    //   }
    // },
    // {
    //   headerName: 'Subtotal',
    //   field: 'subTotal',
    //   filter: true,
    //   cellStyle: { 'font-size': '12px' },
    //   valueFormatter: (params: ICellRendererParams) => {
    //     return this.valueFormatter(params.value)
    //   }
    // },
    // { 
    //   headerName: 'Store', 
    //   field: 'warehouseName', 
    //   sortable: true, 
    //   filter: true, 
    //   cellStyle: { 'font-size': '12px' },
    //   valueFormatter: (params: ICellRendererParams) => {
    //     return params.value || 'N/A'
    //   }
    // }
  ];

  ngOnInit() {
    // initializing empty model
    this.transactionReconModel = {} as ITransactionRecon;

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.callQuotationId = id;
        this.isLoading = true;
        this.getQuotationData(id);
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

  //Getting quotation master data
  getQuotationData(id: number) {
    this.callquotationService.getCallQuotationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<ICallQuotation>) => {
      this.callQuotationMaster = res.result;
      this.callForQuotationLines = res.result.callForQuotationLines;

      // //handling disablity of register payment button
      // this.isDisabled = (this.quotationMaster.status === "Paid" ? true : false)
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
  }

  //on dialogue open funtions
  // openDialog(): void {
  //   const dialogRef = this.dialog.open(RegisterPaymentComponent, {
  //     width: '900px',
  //     data: {
  //       accountId: this.quotationMaster.receivableAccountId,
  //       paymentType: 1,
  //       documentLedgerId: this.ledgerId,
  //       campusId: this.quotationMaster.campusId,
  //       businessPartnerId: this.businessPartnerId,
  //       pendingAmount: this.pendingAmount,
  //       formName: 'Quotation',
  //       docType: DocType.Receipt
  //     }
  //   });
  //   //Recalling getQuotationData function on dialog close
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.getQuotationData(this.quotationId);
  //     this.cdRef.markForCheck();
  //     this.cdRef.detectChanges();
  //   });
  // }

  // reconcile(index: number) {
  //   this.mapTransactionReconModel(index);
  //   this.quotationService.reconcilePayment(this.transactionReconModel)
  //   .pipe(
  //     take(1),
  //      finalize(() => {
  //       this.isLoading = false;
  //       this.cdRef.detectChanges();
  //      })
  //    )
  //     .subscribe(() => {
  //         this.toastService.success('Reconciled Successfully', 'Quotation')
  //         this.getQuotationData(this.quotationId);
  //         this.cdRef.detectChanges();
  //         this.cdRef.markForCheck();
  //       });
  // }

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

  workflow(action: number , remarks: string) {
    this.isLoading = true
    this.callquotationService.workflow({ action, docId: this.callQuotationMaster.id , remarks })
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getQuotationData(this.callQuotationId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Call Of Quotation');
      })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.callQuotationMaster,
        serviceClass: this.callquotationService,
        functionName: 'uploadFile',
        name: 'Call Of Quotation'
      },
    }).afterClosed().subscribe(() => {
      this.getQuotationData(this.callQuotationId)
      this.cdRef.detectChanges()
    })
  }
}
