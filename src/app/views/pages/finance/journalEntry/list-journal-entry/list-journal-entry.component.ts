import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/Dialog'
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { JournalEntryService } from '../services/journal-entry.service';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { JOURNAL_ENTRY } from 'src/app/views/shared/AppRoutes';
import { IJournalEntry } from '../model/IJournalEntry';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { DocumentStatus } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-list-journal-entry',
  templateUrl: './list-journal-entry.component.html',
  styleUrls: ['./list-journal-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ListJournalEntryComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: GridOptions;
  journalEntryList: IJournalEntry[];
  frameworkComponents: {[p: string]: unknown};
  tooltipData: string = "double click to view detail"

  // Injecting dependencies
  constructor(
    private journalEntryService: JournalEntryService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  // Declaring AgGrid data
  columnDefs = [
    { headerName: 'JV #', field: 'docNo', sortable: true, filter: true, tooltipField: 'docNo' },
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      filter: true,
      tooltipField: 'docNo',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.date != null ? params.data.date : null;
        return !date || this.transformDate(date, 'MMM d, y');
      }
    },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, tooltipField: 'docNo' },
    {
      headerName: 'Debit', field: 'totalDebit', sortable: true, filter: true, tooltipField: 'docNo',
      cellRenderer: (params: ICellRendererParams) => {
        return this.valueFormatter(params.data.totalDebit)
      }
      // cellRenderer: (params: ICellRendererParams) => {
      //   let debit: number = 0
      //   params.data.journalEntryLines.forEach((line: any) => {
      //     debit += line.debit
      //   })
      //   return debit.toLocaleString();
      // }
    },
    {
      headerName: 'Credit', field: 'totalCredit', sortable: true, filter: true, tooltipField: 'docNo',
      cellRenderer: (params: ICellRendererParams) => {
        return this.valueFormatter(params.data.totalCredit)
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'docNo', 
      cellRenderer: (params: ICellRendererParams) => {
        return DocumentStatus[params.data.status]
      }
    },
  ];


  ngOnInit() {

    this.getJournalEntries()

    // setting row and header height
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  addJournalEntry() {
    this.router.navigate(['/' + JOURNAL_ENTRY.CREATE])
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + JOURNAL_ENTRY.ID_BASED_ROUTE('details' , event.data.id)]);
  }

  getJournalEntries() {
    this.journalEntryService.getJournalEntries().subscribe(
      (res: IPaginationResponse<IJournalEntry[]>) => {
        this.journalEntryList = res.result;
        this.cdRef.markForCheck();
      })
  }
}






