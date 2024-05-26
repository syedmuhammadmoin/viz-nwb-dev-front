import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ValueFormatterParams
} from 'ag-grid-community';
import {isEmpty} from 'lodash';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {REQUISITION} from 'src/app/views/shared/AppRoutes';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {IRequisition} from '../model/IRequisition';
import {RequisitionService} from '../service/requisition.service';


@Component({
  selector: 'kt-list-requisition',
  templateUrl: './list-requisition.component.html',
  styleUrls: ['./list-requisition.component.scss']
})

export class ListRequisitionComponent extends AppComponentBase implements OnInit {

  requisitionList: IRequisition[];
  FilteredData: any[]=[];
  defaultColDef: ColDef;
  
  gridOptions: any;
  tooltipData: string = 'double click to view detail'
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private requisitionService: RequisitionService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: {componentParent: this}
      }
    );
  }

  //Defining Requisition Columns
  columnDefs = [
    {
      headerName: 'Requisition #',
      field: 'docNo',
      tooltipField: 'docNo',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }
    },
    {
      headerName: 'Employee',
      field: 'employeeName',
      tooltipField: 'docNo',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Requisition Date',
      field: 'requisitionDate',
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
      headerName: 'Status',
      field: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        values: ['Draft', 'Rejected', 'Open', 'Closed', 'Submitted', 'Reviewed'],
        defaultToNothingSelected: true,
        suppressSorting: true,
        suppressSelectAll: true,
        suppressAndOrCondition: true,
      },
    },
  ];

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: 'double click to edit',
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

  addRequisition() {
    this.router.navigate(['/' + REQUISITION.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + REQUISITION.ID_BASED_ROUTE('details', event.data.id)]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    var dataSource = {
      getRows: (params: any) => {
        this.requisitionService.getRecords(params).subscribe((data) => {
          if (isEmpty(data.result)) {
            this.gridApi.showNoRowsOverlay()
          } else {
            this.FilteredData = data.result
            this.gridApi.hideOverlay();
          }
          params.successCallback(this.FilteredData || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'requisitionPageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }

  fetchData(x: any) {           
    const dataSource = {
      getRows: (params: any) => {        
        this.requisitionService.getRecordByYearMonth(x.startDate ,x.endDate )
          .subscribe((data) => {
            if (isEmpty(data.result)) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();             
              this.FilteredData = data.result;
            }
            params.successCallback(this.FilteredData || 0 ,data.totalRecords);
            this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName');
            this.cdRef.detectChanges();
        });
      },
    };
    this.gridApi.setDatasource(dataSource);
}
}
