import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import {CALL_QUOTATION} from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { ICallQuotation } from '../model/ICallQuotation';
import { CallQuotationService } from '../service/call-quotation.service';


@Component({
  selector: 'kt-list-call-quotaion',
  templateUrl: './list-call-quotaion.component.html',
  styleUrls: ['./list-call-quotaion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListCallQuotaionComponent extends AppComponentBase implements OnInit {

  quotationList: ICallQuotation[];
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
    private callQuotationService: CallQuotationService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
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
      headerName: 'Vendor #',
      field: 'docNo',
      tooltipField: 'docNo',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Call Quotation Date',
      field: 'callForQuotationDate',
      tooltipField: 'docNo',
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
      headerName: 'Description',
      field: '',
      tooltipField: 'docNo',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['equals'],
          suppressAndOrCondition: true,
        }
    },
    // {
    //   headerName: 'Due Date',
    //   field: 'dueDate',
    //   tooltipField: 'docNo',
    //   filter: 'agDateColumnFilter',
    //   menuTabs: ['filterMenuTab'],
    //     filterParams: {
    //       filterOptions: ['equals'],
    //       suppressAndOrCondition: true,
    //     },
    //   valueFormatter: (params: ValueFormatterParams) => {
    //     return this.transformDate(params.value, 'MMM d, y') || null;
    //   }
    // },
    // {
    //   headerName: 'Total',
    //   field: 'totalAmount',
    //   headerClass: 'custom_left',
    //   cellStyle: { 'text-align': "right" },
    //   tooltipField: 'docNo',
    //   suppressMenu: true,
    //   valueFormatter: (params: ValueFormatterParams) => {
    //     return this.valueFormatter(params.value) || null;
    //   }
    // },
    // {
    //   headerName: 'Status',
    //   field: 'status',
    //   filter: 'agSetColumnFilter',
    //   menuTabs: ['filterMenuTab'],
    //     filterParams: {
    //       values: ['Draft', 'Rejected', 'Unpaid', 'Partial', 'Paid', 'Submitted', 'Reviewed'],
    //       defaultToNothingSelected: true,
    //       suppressSorting:true,
    //       suppressSelectAll: true,
    //       suppressAndOrCondition: true,
    //     },
    // },
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

  addCallQuotation() {
    this.router.navigate(['/' + CALL_QUOTATION.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + CALL_QUOTATION.ID_BASED_ROUTE('details', event.data.id)]);
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    var dataSource = {
      getRows: (params: any) => {
        this.callQuotationService.getRecords(params).subscribe((data) => {
          if(isEmpty(data.result)) {
            this.gridApi.showNoRowsOverlay()
          } else {
            this.gridApi.hideOverlay();
          }
          params.successCallback(data.result || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'callQuotationPageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setDatasource(dataSource);
  }

}



