import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
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
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

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
    { headerName: 'Credit Note #', field: 'docNo', sortable: true, filter: true, tooltipField: 'noteDate', cellRenderer: "loadingCellRenderer" },
    { headerName: 'Customer', field: 'customerName', sortable: true, filter: true, tooltipField: 'noteDate', },
    {
      headerName: 'Note Date',
      field: 'noteDate',
      sortable: true,
      filter: true,
      tooltipField: 'noteDate',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'noteDate',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value) || null;
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

  addCreditNote() {
    this.router.navigate(['/' + CREDIT_NOTE.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + CREDIT_NOTE.ID_BASED_ROUTE('details' , event.data.id)]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getCreditNotes(params: any): Promise<IPaginationResponse<ICreditNote[]>> {
    const result = await this.creditNoteService.getCreditNotes().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getCreditNotes(params);

     if (!res.result) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'creditNotePageName')
     this.cdRef.detectChanges();
   },
  };

  // getCreditNoteList() {
  //   this.creditNoteService.getCreditNotes().subscribe((res: IPaginationResponse<ICreditNote[]>) => {
  //       this.creditNoteList = res.result;
  //       this.cdRef.markForCheck();
  //     })
  // }
}