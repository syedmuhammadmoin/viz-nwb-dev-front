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
import { finalize, take } from 'rxjs/operators';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';


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
    private cdRef: ChangeDetectorRef,
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
  paidAmountList: any = [];

  //Showing Remarks
  remarksList: string[] = [];

  // Defining columns for ag grid
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
    { headerName: 'Account', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
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
      headerName: 'Sub total', field: 'subTotal', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
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

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.creditNoteId = id;
        this.isLoading = true;
        this.getCreditNoteData(id);
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

  getCreditNoteData(id: number) {
    this.creditNoteService.getCreditNoteById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<ICreditNote>) => {
      this.creditNoteMaster = res.result;
      this.creditNoteLines = res.result.creditNoteLines;
      this.paidAmountList = this.creditNoteMaster.paidAmountList == null ? [] : this.creditNoteMaster.paidAmountList;
      this.remarksList = this.creditNoteMaster.remarksList ?? [] 
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
    this.creditNoteService.workflow({ action, docId: this.creditNoteMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getCreditNoteData(this.creditNoteId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Credit Note');
      })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.creditNoteMaster,
        serviceClass: this.creditNoteService,
        functionName: 'uploadFile',
        name: 'Credit Note'
      },
    }).afterClosed().subscribe(() => {
      this.getCreditNoteData(this.creditNoteId)
      this.cdRef.detectChanges()
    })
  }
}

