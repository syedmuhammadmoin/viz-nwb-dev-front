import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRenderer, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DocumentStatus } from 'src/app/views/shared/AppEnum';
import { CREDIT_NOTE } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { ICreditNote } from '../model/ICreditNote';
import { CreditNoteService } from '../service/credit-note.service';

@Component({
  selector: 'kt-list-credit-note',
  templateUrl: './list-credit-note.component.html',
  styleUrls: ['./list-credit-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListCreditNoteComponent extends AppComponentBase implements OnInit {

  creditNoteList: ICreditNote[];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"

  constructor(
    private creditNoteService: CreditNoteService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }


  columnDefs = [
    { headerName: 'Credit Note #', field: 'docNo', sortable: true, filter: true, tooltipField: 'noteDate', },
    { headerName: 'Customer', field: 'customerName', sortable: true, filter: true, tooltipField: 'noteDate', },
    {
      headerName: 'Note Date',
      field: 'noteDate',
      sortable: true,
      filter: true,
      tooltipField: 'noteDate',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.noteDate != null ? params.data.noteDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'noteDate',
      cellRenderer: (params: ICellRendererParams) => {
        return this.valueFormatter(params.data.totalAmount);
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'noteDate', 
    },,
  ];


  ngOnInit() {
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = { customTooltip: CustomTooltipComponent };

    this.getCreditNoteList();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  addCreditNote() {
    this.router.navigate(['/' + CREDIT_NOTE.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + CREDIT_NOTE.ID_BASED_ROUTE('details' , event.data.id)]);
  }

  getCreditNoteList() {
    this.creditNoteService.getCreditNotes().subscribe((res: IPaginationResponse<ICreditNote[]>) => {
        this.creditNoteList = res.result;
        this.cdRef.markForCheck();
      })
  }
}