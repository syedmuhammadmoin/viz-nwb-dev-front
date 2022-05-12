import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/Dialog'
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { JournalEntryService } from '../services/journal-entry.service';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { JOURNAL_ENTRY } from 'src/app/views/shared/AppRoutes';
import { IJournalEntry } from '../model/IJournalEntry';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

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
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
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
    { headerName: 'JV #', field: 'docNo', sortable: true, filter: true, tooltipField: 'docNo', cellRenderer: "loadingCellRenderer", },
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      filter: true,
      tooltipField: 'docNo',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, tooltipField: 'docNo' },
    {
      headerName: 'Debit', field: 'totalDebit', sortable: true, filter: true, tooltipField: 'docNo',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
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
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'docNo'
    },
  ];


  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.components = {
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getJournalEntries(params: any): Promise<IPaginationResponse<IJournalEntry[]>> {
    const result = await this.journalEntryService.getJournalEntries().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getJournalEntries(params)

     if (!res.result) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'journalEntryPageName')
     this.cdRef.detectChanges();
   },
  };

  // getJournalEntries() {
  //   this.journalEntryService.getJournalEntries().subscribe(
  //     (res: IPaginationResponse<IJournalEntry[]>) => {
  //       this.journalEntryList = res.result;
  //       this.cdRef.markForCheck();
  //     })
  // }
}






