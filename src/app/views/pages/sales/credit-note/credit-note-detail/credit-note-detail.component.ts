import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { ActionButton, DocumentStatus, DocType } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CreditNoteService } from '../service/credit-note.service';
import { CREDIT_NOTE, INVOICE } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICreditNote } from '../model/ICreditNote';
import { ICreditNoteLines } from '../model/ICreditNoteLines';


@Component({
  selector: 'kt-credit-note-detail',
  templateUrl: './credit-note-detail.component.html',
  styleUrls: ['./credit-note-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreditNoteDetailComponent extends AppComponentBase implements OnInit {

  constructor(
    private creditNoteService: CreditNoteService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  // For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  public CREDIT_NOTE = CREDIT_NOTE
  public INVOICE = INVOICE

  // handling register payment button
  isDisabled: boolean;

  // kt busy loading
  isLoading: boolean;

  // need for routing
  creditNoteId: number;

  totalBeforeTax: number;
  totalTax: number;
  totalAmount: number;

  // For Credit Note data
  creditNoteLines: ICreditNoteLines | any;
  creditNoteMaster: ICreditNote | any;
  reconciledDocumentList: any = [];

  // Defining columns for ag grid
  columnDefs = [
    { headerName: 'Item', field: 'itemName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Price', field: 'price', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
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
      headerName: 'Sub total', field: 'subtotal', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'Account', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Location', field: 'locationName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } }
  ];

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.creditNoteId = id;
        this.getCreditNoteData(id);
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

  getCreditNoteData(id: number) {
    this.creditNoteService.getCreditNoteById(id).subscribe((res: IApiResponse<ICreditNote>) => {
      this.creditNoteMaster = res.result;
      this.creditNoteLines = res.result.creditNoteLines;
      this.reconciledDocumentList = this.creditNoteMaster.reconciledDocuments == null ? [] : this.creditNoteMaster.reconciledDocuments;
      this.cdr.detectChanges();
    })
  }

  workflow(action: number) {
    this.isLoading = true
    this.creditNoteService.workflow({ action, docId: this.creditNoteMaster.id })
      .subscribe((res) => {
        this.getCreditNoteData(this.creditNoteId);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.success('' + res.message, 'Credit Note');
      }, (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.error('' + err.error.message, 'Credit Note')
      })
  }
}

