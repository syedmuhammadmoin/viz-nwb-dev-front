import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { QuotationService } from '../service/quotation.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CREDIT_NOTE, QUOTATION, JOURNAL_ENTRY, RECEIPT, REQUISITION } from 'src/app/views/shared/AppRoutes';
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
  gridOptions: any;
  defaultColDef: ColDef;

  public QUOTATION = QUOTATION;
  public JOURNAL_ENTRY = JOURNAL_ENTRY;
  public CREDIT_NOTE = CREDIT_NOTE;
  public RECEIPT = RECEIPT;
  public REQUISITION = REQUISITION;

  //Loader
  isLoading: boolean;

  //need for routing
  quotationId: number;

  //Variables for Quotation data
  quotationLines: IQuotationLines | any
  quotationMaster: IQuotation | any;

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
    this.defaultColDef = { resizable: true, sortable: false };
  }

  //Defining Quotation Columns
  columnDefs = [
    { 
      headerName: 'Item', 
      field: 'itemName', 
      sortable: false, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
     },
    { headerName: 'Description', field: 'description', sortable: false, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Quantity', field: 'quantity', sortable: false, filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Price',
      field: 'price',
      filter: true,
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    }
  ];

  ngOnInit() {
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
      this.remarksList = this.quotationMaster.remarksList ?? []
     
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
