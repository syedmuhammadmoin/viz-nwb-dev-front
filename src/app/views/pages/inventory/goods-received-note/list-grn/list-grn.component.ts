import { GOODS_RECEIVED_NOTE } from './../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams }            from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { GrnService }   from "../service/grn.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IGRN } from '../model/IGRN';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
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
    { headerName: 'Grn #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status', cellRenderer: "loadingCellRenderer"  },
    { headerName: 'Vendor', field: 'vendor', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Grn Date',
      field: 'grnDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'status' },
  ];

  ngOnInit(): void {

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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/'+ GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details',event.data.id) ], {relativeTo: this.activatedRoute})
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getGrns(params: any): Promise<IPaginationResponse<IGRN[]>> {
    const result = await this._grnService.getGRNs().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getGrns(params);

     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'grnPageName')
     this.cdRef.detectChanges();
   },
  };
}
