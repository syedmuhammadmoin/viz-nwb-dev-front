import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { QuotationService } from '../service/quotation.service';
// import { RegisterPaymentComponent } from '../register-payment/register-payment.component'
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ITransactionRecon } from '../../../purchase/vendorBill/model/ITransactionRecon';
import { CREDIT_NOTE, QUOTATION, JOURNAL_ENTRY, RECEIPT } from 'src/app/views/shared/AppRoutes';
import { IQuotationLines } from '../model/IQuotationLines';
import { IQuotation } from '../model/IQuotation';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';


@Component({
  selector: 'kt-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss']
})

export class QuotationDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public QUOTATION = QUOTATION;
  public JOURNAL_ENTRY = JOURNAL_ENTRY;
  public CREDIT_NOTE = CREDIT_NOTE;
  public RECEIPT = RECEIPT;

  transactionReconModel: ITransactionRecon;

  //handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  quotationId: number;

  loader: boolean = true;

  //Variables for Quotation data
  quotationLines: IQuotationLines | any
  quotationMaster: IQuotation | any;
  bpUnReconPaymentList: any = [];
  pendingAmount: any;
  status: string;
  paidAmount: number;
  paidAmountList: any = [];

  //need for Register Payment
  totalBeforeTax: number;
  totalTax: number;
  totalQuotationAmount: number;
  businessPartnerId: number;
  transactionId: number;
  ledgerId: number

  //Showing Remarks
  remarksList: string[] = [];

  constructor(
    private quotationService: QuotationService,
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
    // { headerName: 'COA', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Price',
      field: 'price',
      filter: true,
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    }
  ];

  ngOnInit() {
    // initializing empty model
    this.transactionReconModel = {} as ITransactionRecon;

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.quotationId = id;
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
    this.quotationService.getQuotationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IQuotation>) => {
      this.quotationMaster = res.result;
      this.quotationLines = res.result.quotationLines;
     

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
    this.quotationService.workflow({ action, docId: this.quotationMaster.id , remarks })
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getQuotationData(this.quotationId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Quotation');
      })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.quotationMaster,
        serviceClass: this.quotationService,
        functionName: 'uploadFile',
        name: 'Quotation'
      },
    }).afterClosed().subscribe(() => {
      this.getQuotationData(this.quotationId)
      this.cdRef.detectChanges()
    })
  }
}
