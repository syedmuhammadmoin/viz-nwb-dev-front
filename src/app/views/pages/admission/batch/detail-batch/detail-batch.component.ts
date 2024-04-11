import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {ActionButton, DocType, DocumentStatus, Permissions} from '../../../../shared/AppEnum';
import {ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams} from 'ag-grid-community';
import {ITransactionRecon} from '../../../purchase/vendorBill/model/ITransactionRecon';
import {ActivatedRoute, Params} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {finalize, take} from 'rxjs/operators';
import {CustomRemarksComponent} from '../../../../shared/components/custom-remarks/custom-remarks.component';
import {CustomUploadFileComponent} from '../../../../shared/components/custom-upload-file/custom-upload-file.component';
import {BATCH} from '../../../../shared/AppRoutes';
import {IBatch, IBatchLines} from '../model/IBatch';
import {BatchService} from '../service/batch.service';

@Component({
  selector: 'kt-detail-batch',
  templateUrl: './detail-batch.component.html',
  styleUrls: ['./detail-batch.component.scss']
})
export class DetailBatchComponent extends AppComponentBase implements OnInit {

  BATCH = BATCH

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // For ag grid
  gridOptions: any;
  defaultColDef: ColDef;

  transactionReconModel: ITransactionRecon = {} as ITransactionRecon;

  // Loader
  isLoading: boolean;

  // need for routing
  batchId: number;

  loader = true;

  // Variables for Invoice data
  batchLines: IBatchLines | any
  batchMaster: IBatch = {} as IBatch;
  status: string;

  // Showing Remarks
  remarksList: string[] = [];

  constructor(
    private batchService: BatchService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  // Defining Invoice Columns
  columnDefs = [
    {
      headerName: 'Program',
      field: 'program',
      sortable: false,
      filter: true,
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
  ];

  ngOnInit() {

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.batchId = id;
        this.isLoading = true;
        this.getBatchData(id);
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

  // Getting invoice master data
  getBatchData(id: number) {
    this.batchService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.batchMaster = res.result;
        this.batchLines = res.result.batchLines;
        // this.status = this.batchMaster.status;
        // this.remarksList = this.batchMaster.remarksList ?? []

        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  // on dialogue open funtions
  /*openDialog(): void {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        accountId: this.batchMaster.receivableAccountId,
        paymentType: 1,
        documentLedgerId: this.ledgerId,
        campusId: this.batchMaster.campusId,
        businessPartnerId: this.businessPartnerId,
        pendingAmount: this.pendingAmount,
        formName: 'Invoice',
        docType: DocType.Receipt
      }
    });
    // Getting Updated Invoice Data
    dialogRef.afterClosed().subscribe(() => {
      this.getBatchData(this.programId);
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
  }*/

  /*reconcile(index: number) {
    this.mapTransactionReconModel(index);
    this.programService.reconcilePayment(this.transactionReconModel)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(() => {
        this.toastService.success('Reconciled Successfully', 'Invoice')
        this.getBatchData(this.programId);
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      });
  }*/

  /*mapTransactionReconModel(index: number) {
    console.log('this.bpUnReconPaymentList[index].paymentledgerId', this.bpUnReconPaymentList[index].paymentledgerId)
    this.transactionReconModel.paymentLedgerId = this.bpUnReconPaymentList[index].paymentLedgerId;
    this.transactionReconModel.documentLedgerId = this.ledgerId;
    this.transactionReconModel.amount = this.bpUnReconPaymentList[index].amount > this.pendingAmount
      ? this.pendingAmount
      : this.bpUnReconPaymentList[index].amount;
  };*/

  // Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    // sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number , remarks: string) {
    /*this.isLoading = true
    this.programService.workflow({ action, docId: this.batchMaster.id , remarks })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.getBatchData(this.programId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Invoice');
      })*/
  }

  // upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.batchMaster,
        serviceClass: this.batchService,
        functionName: 'uploadFile',
        name: 'Invoice'
      },
    }).afterClosed().subscribe(() => {
      this.getBatchData(this.batchId)
      this.cdRef.detectChanges()
    })
  }
}
