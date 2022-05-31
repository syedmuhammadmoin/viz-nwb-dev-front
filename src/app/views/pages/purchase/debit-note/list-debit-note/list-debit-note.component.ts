import { DEBIT_NOTE } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { DebitNoteService } from '../service/debit-note.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IDebitNote } from '../model/IDebitNote';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-debit-note',
  templateUrl: './list-debit-note.component.html',
  styleUrls: ['./list-debit-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListDebitNoteComponent extends AppComponentBase implements OnInit {

  debitNoteList: any;
  defaultColDef: any;
  frameworkComponents: any;
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private debitNoteService: DebitNoteService,
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
    { headerName: 'Debit Note #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status', cellRenderer: "loadingCellRenderer" },
    { headerName: 'Vendor Name', field: 'vendorName', sortable: true, filter: true, tooltipField: 'vendor' },
    {
      headerName: 'Note Date',
      field: 'noteDate',
      sortable: true,
      filter: true,
      tooltipField: 'vendor',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      },
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'vendor',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value) || 'N/A'
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'status',
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

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  addDebitNote() {
    this.router.navigate(['/'+DEBIT_NOTE.CREATE]);
  }

  onRowDoubleClicked(event: any) {
    this.router.navigate(['/'+DEBIT_NOTE.ID_BASED_ROUTE('details',event.data.id) ]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getDebitNotes(params: any): Promise<IPaginationResponse<IDebitNote[]>> {
    const result = await this.debitNoteService.getDebitNotes(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getDebitNotes(params);

     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'debitNotePageName')
     this.cdRef.detectChanges();
   },
  };

  // loadDebitNoteList() {
  //   this.debitNoteService.getDebitNotes().subscribe(
  //     (res) => {
  //       this.debitNoteList = res.result;
  //       this.cdRef.markForCheck();
  //     },
  //     (err: any) => {
  //       console.log(err)
  //     })
  // }
}





