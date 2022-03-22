import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { DateHelperService } from 'src/app/views/shared/helpers/date-helper';
import { Router } from '@angular/router';
import { BUDGET } from 'src/app/views/shared/AppRoutes';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { BudgetService } from '../service/budget.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';

@Component({
  selector: 'kt-list-budget',
  templateUrl: './list-budget.component.html',
  styleUrls: ['./list-budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListBudgetComponent implements OnInit {

  budgetList: IBudgetResponse[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  tooltipData : string = "double click to edit"

  constructor( private _budgetService: BudgetService,
               public  dialog: MatDialog,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private dateHelperService: DateHelperService,
             ) {
                this.gridOptions = <GridOptions>(
                 { 
                  context : { componentParent : this } 
                 }
                );
               } 

    columnDefs = [
      // { headerName: 'Account', field: 'accountId', sortable: true, filter: true, tooltipField: 'to', },
      {
        headerName: 'Budget', field: 'budgetName', menuTabs: ["filterMenuTab"], filter: true, tooltipField: 'to',
      },
  
      // { headerName: 'Amount', field: 'amount', sortable: true, filter: true, tooltipField: 'to', },
      {
        headerName: 'From', field: 'from',  menuTabs: ["filterMenuTab"],  filter: true, tooltipField: 'to',
  
        cellRenderer: (params: ICellRendererParams) => {
          const date = params.data.from != null ? params.data.from : null;
          return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
        }
      },
      {
        headerName: 'To', field: 'to',  menuTabs: ["filterMenuTab"],  filter: true, tooltipField: 'to',
  
        cellRenderer: (params: ICellRendererParams) => {
          const date = params.data.to != null ? params.data.to : null;
          return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
        }
      },
    ];
 
  ngOnInit() {

    this.getBudgets();

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  }

  onFirstDataRendered(params : FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent){
    console.log()
    this.router.navigate(['/' + BUDGET.ID_BASED_ROUTE('details', event.data.id)]);
  }

  addBudget() {
    this.router.navigate(['/' + BUDGET.CREATE])
  }

  getBudgets() : void {
    this._budgetService.getBudgets().subscribe((res: IPaginationResponse<IBudgetResponse[]>) => {
      this.budgetList = res.result;
      this.cdRef.detectChanges();
    })
  }
}

 
 


  
 
 









