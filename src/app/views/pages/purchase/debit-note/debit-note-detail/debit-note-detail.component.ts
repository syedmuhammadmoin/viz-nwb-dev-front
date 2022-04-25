import { DEBIT_NOTE, BILL } from '../../../../shared/AppRoutes';
import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionButton, DocumentStatus, DocType } from 'src/app/views/shared/AppEnum';
import { GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { DebitNoteService } from '../service/debit-note.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';


@Component({
  selector: 'kt-debit-note-detail',
  templateUrl: './debit-note-detail.component.html',
  styleUrls: ['./debit-note-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DebitNoteDetailComponent extends AppComponentBase implements OnInit {
  //routing variables
  public DEBIT_NOTE= DEBIT_NOTE
  public BILL= BILL;

  docType = DocType
  public permissions = Permissions;
 
  action = ActionButton
  docStatus = DocumentStatus

  // handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: any;

  //need for routing
  debitNoteId: number;

  totalBeforeTax: number;
  totalTax: number;
  totalAmount: number;
  //Variables for Debit Note Data
  debitNoteMaster: any;
  debitNoteLines: any;
  reconciledDocumentList: any = [];

  constructor(private debitNoteService: DebitNoteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    injector: Injector,
    private cdRef: ChangeDetectorRef) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
  }

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
    { headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Cost', field: 'cost', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
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
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'Account', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { 
      headerName: 'Warehouse', 
      field: 'warehouseName', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
     }
  ];

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.getDebitNoteMasterData(id);
        this.debitNoteId = id;
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
  }
  
  // First time rendered ag grid
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  //Debit Note Master Data
  getDebitNoteMasterData(id: number) {
    this.debitNoteService.getDebitNoteMaster(id).subscribe(res => {
      this.debitNoteMaster = res.result;
      this.debitNoteLines = res.result.debitNoteLines;
      this.totalBeforeTax = this.debitNoteMaster.totalBeforeTax;
      this.totalTax = this.debitNoteMaster.totalTax;
      this.totalAmount = this.debitNoteMaster.totalAmount;
      this.reconciledDocumentList = this.debitNoteMaster.reconciledDocuments == null ? [] : this.debitNoteMaster.reconciledDocuments;
      this.cdRef.detectChanges();
    }, (err: any) => console.log(err));
  }

  workflow(action: any) {
    this.isLoading = true
    console.log(action , this.debitNoteMaster.id)
    this.debitNoteService.workflow({ action, docId: this.debitNoteMaster.id })
      .subscribe((res) => {
        this.getDebitNoteMasterData(this.debitNoteId);
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Debit Note');
      }, (err) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.error('' + err.error.message, 'Debit Note')
      })
  }
}







