import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { DateHelperService } from 'src/app/views/shared/helpers/date-helper';
import { Router } from '@angular/router';
import { BUDGET } from 'src/app/views/shared/AppRoutes';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { BudgetService } from '../service/budget.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-budget',
  templateUrl: './list-budget.component.html',
  styleUrls: ['./list-budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListBudgetComponent extends AppComponentBase implements OnInit {

  budgetList: IBudgetResponse[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  tooltipData : string = "double click to view detail"
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor( private _budgetService: BudgetService,
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
        headerName: 'Budget', 
        field: 'budgetName', 
        tooltipField: 'to', 
        cellRenderer: "loadingCellRenderer",
        filter: 'agTextColumnFilter',
        menuTabs: ['filterMenuTab'],
            filterParams: {
              filterOptions: ['contains'],
              suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'From', field: 'from',  menuTabs: ["filterMenuTab"], suppressMenu: true, tooltipField: 'to',
  
        // valueFormatter: (params: ICellRendererParams) => {
        //   return this.dateHelperService.transformDate(params.value, "MMM d, y");
        // },
        valueFormatter: (params: ValueFormatterParams) => {
          const date = params.value != null ? params.value : null;
          return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
        }
      },
      {
        headerName: 'To', field: 'to',  menuTabs: ["filterMenuTab"], suppressMenu: true, tooltipField: 'to',
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

  onFirstDataRendered(params : FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent){
    this.router.navigate(['/' + BUDGET.ID_BASED_ROUTE('details', event.data.id)]);
  }

  addBudget() {
    this.router.navigate(['/' + BUDGET.CREATE])
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getBudgets(params);
     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
      this.gridApi.hideOverlay();
    }
    // if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'budgetPageName');
     this.cdRef.detectChanges();
   },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getBudgets(params: any): Promise<IPaginationResponse<IBudgetResponse[]>> {
    const result = await this._budgetService.getRecords(params).toPromise()
    return result
  }


  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.setDatasource(this.dataSource);
  // }

  // async getBudgets(params: any): Promise<IPaginationResponse<IBudgetResponse[]>> {
  //   const result = await this._budgetService.getBudgets(params).toPromise()
  //   return result
  // }

  // dataSource = {
  //   getRows: async (params: any) => {
  //    const res = await this.getBudgets(params);

  //    if(isEmpty(res.result)) {  
  //     this.gridApi.showNoRowsOverlay() 
  //   } else {
  //    this.gridApi.hideOverlay();
  //   }
  //    //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
  //    params.successCallback(res.result || 0, res.totalRecords);
  //    this.paginationHelper.goToPage(this.gridApi, 'budgetPageName')
  //    this.cdRef.detectChanges();
  //  },
  // };

  // getBudgets() : void {
  //   this._budgetService.getBudgets().subscribe((res: IPaginationResponse<IBudgetResponse[]>) => {
  //     this.budgetList = res.result;
  //     this.cdRef.detectChanges();
  //   })
  // }
}

 
 


  
 
 









