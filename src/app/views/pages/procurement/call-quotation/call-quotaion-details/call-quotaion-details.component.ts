import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { CallQuotationService } from '../service/call-quotation.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
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

  //Loader
  isLoading: boolean;

  //need for routing
  callQuotationId: number;

  //Variables for Quotation data
  callQuotationMaster: ICallQuotation | any;
  callForQuotationLines: ICallForQuotationLines | any;
  bpUnReconPaymentList: any = [];

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

  //Defining Call Quotation Columns
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
  ];

  ngOnInit() {

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
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
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
        this.toastService.success('' + res.message, 'Call Quotation');
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
        name: 'Call Quotation'
      },
    }).afterClosed().subscribe(() => {
      this.getQuotationData(this.callQuotationId)
      this.cdRef.detectChanges()
    })
  }
}
