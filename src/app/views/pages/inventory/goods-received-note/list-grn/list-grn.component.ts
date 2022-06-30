import { GOODS_RECEIVED_NOTE } from './../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams }            from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { GrnService }   from "../service/grn.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IGRN } from '../model/IGRN';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-grn',
  templateUrl: './list-grn.component.html',
  styleUrls: ['./list-grn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListGrnComponent extends AppComponentBase implements OnInit {

  grnList: IGRN[];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private _grnService: GrnService,
    private router: Router,
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

  columnDefs = [
    { 
      headerName: 'Grn #', 
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
      headerName: 'Grn Date',
      field: 'grnDate',
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
      tooltipField: 'status',
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      tooltipField: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          values: ['Draft', 'Rejected', 'Unpaid', 'Partial', 'Paid', 'Submitted', 'Reviewed'],
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
      rowHeight: 40,
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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/'+ GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details',event.data.id) ], {relativeTo: this.activatedRoute})
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    var dataSource = {
      getRows: (params: any) => {
        this._grnService.getRecords(params).subscribe((data) => {
          if(isEmpty(data.result)) {  
            this.gridApi.showNoRowsOverlay() 
          } else {
            this.gridApi.hideOverlay();
          }
          params.successCallback(data.result || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'grnPageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setDatasource(dataSource);
  }
}
