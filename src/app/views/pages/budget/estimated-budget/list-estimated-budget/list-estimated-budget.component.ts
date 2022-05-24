import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { DateHelperService } from 'src/app/views/shared/helpers/date-helper';
import { Router } from '@angular/router';
import { ESTIMATED_BUDGET } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IEstimatedBudget } from '../model/IEstimatedBudget';
import { EstimatedBudgetService } from '../service/estimated-budget.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-list-estimated-budget',
  templateUrl: './list-estimated-budget.component.html',
  styleUrls: ['./list-estimated-budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEstimatedBudgetComponent extends AppComponentBase implements OnInit {

  estimatedBudgetList: IEstimatedBudget[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  tooltipData : string = "double click to edit"
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor( private _estimatedBudgetService: EstimatedBudgetService,
               public  dialog: MatDialog,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) {
               super(injector)
                this.gridOptions = <GridOptions>(
                 { 
                  context : { componentParent : this } 
                 }
                );
               } 

    columnDefs = [
      // { headerName: 'Account', field: 'accountId', sortable: true, filter: true, tooltipField: 'to', },
      {
        headerName: 'Estimated Budget Name', 
        field: 'estimatedBudgetName', 
        menuTabs: ["filterMenuTab"], 
        filter: true, 
        tooltipField: 'to', 
        cellRenderer: "loadingCellRenderer",
      },
      {
        headerName: 'From', field: 'from',  menuTabs: ["filterMenuTab"],  filter: true, tooltipField: 'to',
  
        // valueFormatter: (params: ICellRendererParams) => {
        //   return this.dateHelperService.transformDate(params.value, "MMM d, y");
        // },
        valueFormatter: (params: ValueFormatterParams) => {
          const date = params.value != null ? params.value : null;
          return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
        }
      },
      {
        headerName: 'To', field: 'to',  menuTabs: ["filterMenuTab"],  filter: true, tooltipField: 'to',
  
        valueFormatter: (params: ValueFormatterParams) => {
          const date = params.value != null ? params.value : null;
          return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
        }
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
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getEstimatedBudgets(params: any): Promise<IPaginationResponse<IEstimatedBudget[]>> {
    const result = await this._estimatedBudgetService.getEstimatedBudgets(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getEstimatedBudgets(params);

     if (!res.result) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'estimatedBudgetPageName')
     this.cdRef.detectChanges();
   },
  };
}

 
 


  
 
 












