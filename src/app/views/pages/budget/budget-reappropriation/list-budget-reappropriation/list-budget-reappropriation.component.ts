import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { DateHelperService } from 'src/app/views/shared/helpers/date-helper';
import { IBudgetReport } from '../../current-budget/model/IBudgetReport';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { BUDGET_REAPPROPRIATION } from 'src/app/views/shared/AppRoutes';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { BudgetReappropriationService } from '../service/budget-reappropriation.service';
import { IBudget } from '../model/Ibudget';
import { MatDialog } from '@angular/material/dialog';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';

@Component({
  selector: 'kt-list-budget-reappropriation',
  templateUrl: './list-budget-reappropriation.component.html',
  styleUrls: ['./list-budget-reappropriation.component.scss']
})

export class ListBudgetReappropriationComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean;

  // For AG Grid..
  budgetList: IBudgetReport[];
  gridOptions: any;;
  defaultColDef: ColDef;
  public permissions = Permissions;
  
  tooltipData: string = "double click to view detail"
  components: any;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  //Injecting Dependencies
  constructor(
    private budgetReappropriation: BudgetReappropriationService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    public dateHelperService: DateHelperService,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }


  //Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'Budget',
      field: 'budget',
      tooltipField: 'budget',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Date',
      field: 'budgetReappropriationDate',
      tooltipField: 'budget',
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
      tooltipField: 'budget',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        values: ['Draft', 'Rejected', 'Unpaid', 'Partial', 'Paid', 'Submitted', 'Reviewed'],
        defaultToNothingSelected: true,
        suppressSorting: true,
        suppressSelectAll: true,
        suppressAndOrCondition: true,
      },
    }
  ];

  ngOnInit() {

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
    this.router.navigate(['/' + BUDGET_REAPPROPRIATION.ID_BASED_ROUTE('details', event.data.id)]);
  }

  addBudget() {
    this.router.navigate(['/' + BUDGET_REAPPROPRIATION.CREATE])
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getBudgetReappropriation(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'BudgetReappropriationPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getBudgetReappropriation(params: any): Promise<IPaginationResponse<IBudget[]>> {
    const result = await this.budgetReappropriation.getRecords(params).toPromise()
    return result
  }

}
