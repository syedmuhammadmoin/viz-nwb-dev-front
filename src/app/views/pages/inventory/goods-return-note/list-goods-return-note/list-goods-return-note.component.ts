import { GOODS_RETURN_NOTE } from './../../../../shared/AppRoutes';
import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams }            from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { isEmpty } from 'lodash';
import { IGoodsReturnNote } from '../model/IGoodsReturnNote';
import { GoodsReturnNoteService } from '../service/goods-return-note.service';

@Component({
  selector: 'kt-list-goods-return-note',
  templateUrl: './list-goods-return-note.component.html',
  styleUrls: ['./list-goods-return-note.component.scss']
})

export class ListGoodsReturnNoteComponent extends AppComponentBase implements OnInit {

  goodsReturnNoteList: IGoodsReturnNote[];
  defaultColDef: ColDef;
  
  gridOptions: any;
  tooltipData: string = "double click to view detail"
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private goodsReturnNoteService: GoodsReturnNoteService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  //Defining Goods Return Note Columns
  columnDefs = [
    {
      headerName: 'GRTRN #',
      field: 'docNo',
      tooltipField: 'status',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Vendor',
      field: 'vendorName',
      tooltipField: 'status',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Return Date',
      field: 'returnDate',
      tooltipField: 'status',
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
      cellStyle: { 'text-align': "right" },
      tooltipField: 'status',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          values: ['Draft', 'Rejected', 'Approved', 'Submitted', 'Reviewed'],
          defaultToNothingSelected: true,
          suppressSorting:true,
          suppressSelectAll: true,
          suppressAndOrCondition: true,
        },
    },
  ];

  ngOnInit(): void {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: "double click to view detail",
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
    }

    this.components = {
      customTooltip: CustomTooltipComponent,
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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/'+ GOODS_RETURN_NOTE.ID_BASED_ROUTE('details',event.data.id) ], {relativeTo: this.activatedRoute})
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    var dataSource = {
      getRows: (params: any) => {
        this.goodsReturnNoteService.getRecords(params).subscribe((data) => {
          if(isEmpty(data.result)) {
            this.gridApi.showNoRowsOverlay()
          } else {
            this.gridApi.hideOverlay();
          }
          params.successCallback(data.result || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'goodsReturnNotePageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }
}
