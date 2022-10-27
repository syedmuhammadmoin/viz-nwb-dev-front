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
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';


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

  paidAmountList: any = []

  totalBeforeTax: number;
  totalTax: number;
  totalAmount: number;
  //Variables for Debit Note Data
  debitNoteMaster: any;
  debitNoteLines: any;
  reconciledDocumentList: any = [];

  //Showing Remarks
  remarksList: string[] = [];

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
    { headerName: 'Account', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
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
    { 
      headerName: 'Store', 
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
        this.isLoading = true;
        this.debitNoteId = id;
        this.getDebitNoteMasterData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }
  
  // First time rendered ag grid
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  //Debit Note Master Data
  getDebitNoteMasterData(id: number) {
    this.debitNoteService.getDebitNoteById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe(res => {
      this.debitNoteMaster = res.result;
      this.debitNoteLines = res.result.debitNoteLines;
      this.totalBeforeTax = this.debitNoteMaster.totalBeforeTax;
      this.totalTax = this.debitNoteMaster.totalTax;
      this.totalAmount = this.debitNoteMaster.totalAmount;
      this.paidAmountList = this.debitNoteMaster.paidAmountList;
      this.remarksList = this.debitNoteMaster.remarksList ?? [] 
      //this.reconciledDocumentList = this.debitNoteMaster.reconciledDocuments == null ? [] : this.debitNoteMaster.reconciledDocuments;
      this.cdRef.detectChanges();
    })
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

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.debitNoteService.workflow({ action, docId: this.debitNoteMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getDebitNoteMasterData(this.debitNoteId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Debit Note');
      })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.debitNoteMaster,
        serviceClass: this.debitNoteService,
        functionName: 'uploadFile',
        name: 'Debit Note'
      },
    }).afterClosed().subscribe(() => {
      this.getDebitNoteMasterData(this.debitNoteId)
      this.cdRef.detectChanges()
    })
  }
}







