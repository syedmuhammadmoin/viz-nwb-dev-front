import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { Router } from '@angular/router';
import { ESTIMATED_BUDGET } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IEstimatedBudget } from '../model/IEstimatedBudget';
import { EstimatedBudgetService } from '../service/estimated-budget.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-estimated-budget',
  templateUrl: './list-estimated-budget.component.html',
  styleUrls: ['./list-estimated-budget.component.scss'],
})

export class ListEstimatedBudgetComponent extends AppComponentBase implements OnInit {

  // Injecting Dependencies
  constructor(
    private _estimatedBudgetService: EstimatedBudgetService,
    public  dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ((
      {
      context : { componentParent : this }
      }
    ) as GridOptions);
    }

  estimatedBudgetList: IEstimatedBudget[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  
  tooltipData = 'double click to view detail'
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

    columnDefs = [
      {
        headerName: 'Anticipated Budget Name',
        field: 'estimatedBudgetName',
        tooltipField: 'estimatedBudgetName',
        cellRenderer: 'loadingCellRenderer',
        filter: 'agTextColumnFilter',
        menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'From',
        field: 'from',
        menuTabs: ['filterMenuTab'],
        suppressHeaderMenuButton: true,
        tooltipField: 'from',
        valueFormatter: (params: ValueFormatterParams) => {
          const date = params.value != null ? params.value : null;
          return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
        }
      },
      {
        headerName: 'To',
        field: 'to',
        menuTabs: ['filterMenuTab'],
        suppressHeaderMenuButton: true,
        tooltipField: 'to',
        valueFormatter: (params: ValueFormatterParams) => {
          const date = params.value != null ? params.value : null;
          return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        tooltipField: 'status',
        filter: 'agTextColumnFilter',
        menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
      },
    ];

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getEstimatedBudgets(params);
     if(isEmpty(res.result)) {
      this.gridApi.showNoRowsOverlay()
    } else {
      this.gridApi.hideOverlay();
    }
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'anticipatedBudgetPageName');
     this.cdRef.detectChanges();
   },
  };

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: 'double click to view detail'
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
      loadingCellRenderer (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };
  }

  onFirstDataRendered(params : FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent){
    this.router.navigate(['/' + ESTIMATED_BUDGET.ID_BASED_ROUTE('details', event.data.id)]);
  }

  addEstimatedBudget() {
    this.router.navigate(['/' + ESTIMATED_BUDGET.CREATE])
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getEstimatedBudgets(params: any): Promise<IPaginationResponse<IEstimatedBudget[]>> {
    const result = await firstValueFrom(this._estimatedBudgetService.getRecords(params));
    return result
  }
}
