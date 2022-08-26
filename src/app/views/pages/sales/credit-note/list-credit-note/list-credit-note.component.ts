import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
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
  public permissions = Permissions
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
    { 
      headerName: 'Credit Note #', 
      field: 'docNo',
      tooltipField: 'noteDate', 
      cellRenderer: "loadingCellRenderer" ,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    { 
      headerName: 'Customer', 
      field: 'customerName',
      tooltipField: 'noteDate', 
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Note Date',
      field: 'noteDate',
      tooltipField: 'noteDate',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['equals'],
          suppressAndOrCondition: true,
        },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Total', 
      field: 'totalAmount',
      tooltipField: 'noteDate',
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value) || null;
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          values: ['Draft', 'Rejected', 'Unpaid', 'Partial', 'Paid', 'Submitted', 'Reviewed'],
          defaultToNothingSelected: true,
          suppressSorting:true,
          suppressSelectAll: true,
          suppressAndOrCondition: true,
        },
    },,
  ];


  ngOnInit() {
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: "double click to view detail",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      resizable: true,
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

    var dataSource = {
      getRows: (params: any) => {
        this.creditNoteService.getRecords(params).subscribe((data) => {
          if(isEmpty(data.result)) {  
            this.gridApi.showNoRowsOverlay() 
          } else {
            this.gridApi.hideOverlay();
          }
          params.successCallback(data.result || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'creditNotePageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setDatasource(dataSource);
  }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.setDatasource(this.dataSource);
  // }

  // async getCreditNotes(params: any): Promise<IPaginationResponse<ICreditNote[]>> {
  //   const result = await this.creditNoteService.getCreditNotes(params).toPromise()
  //   return result
  // }

  // dataSource = {
  //   getRows: async (params: any) => {
  //    const res = await this.getCreditNotes(params);

  //    if(isEmpty(res.result)) { 
  //     this.gridApi.showNoRowsOverlay() 
  //   } else {
  //    this.gridApi.hideOverlay();
  //   }
  //    //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
  //    params.successCallback(res.result || 0, res.totalRecords);
  //    this.paginationHelper.goToPage(this.gridApi, 'creditNotePageName')
  //    this.cdRef.detectChanges();
  //  },
  // };

  // getCreditNoteList() {
  //   this.creditNoteService.getCreditNotes().subscribe((res: IPaginationResponse<ICreditNote[]>) => {
  //       this.creditNoteList = res.result;
  //       this.cdRef.markForCheck();
  //     })
  // }
}