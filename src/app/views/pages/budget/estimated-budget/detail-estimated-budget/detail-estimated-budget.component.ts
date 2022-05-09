import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions, CalculationType } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BUDGET, ESTIMATED_BUDGET } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IEstimatedBudgetLines } from '../model/IEstimatedBudgetLines';
import { EstimatedBudgetService } from '../service/estimated-budget.service';
import { IEstimatedBudget } from '../model/IEstimatedBudget';

@Component({
  selector: 'kt-detail-estimated-budget',
  templateUrl: './detail-estimated-budget.component.html',
  styleUrls: ['./detail-estimated-budget.component.scss']
})

export class DetailEstimatedBudgetComponent extends AppComponentBase  implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public ESTIMATED_BUDGET = ESTIMATED_BUDGET;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  estimatedBudgetId: number;

  estimatedBudgetLines: IEstimatedBudgetLines | any
  estimatedBudgetMaster: IEstimatedBudgetLines | any;

  totalAmount = 0

  constructor(
    private _estimatedBudgetService: EstimatedBudgetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining columns for ag grid
  columnDefs = [
    // {headerName: 'Description', field: 'description', filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Account', field: 'accountName', filter: true, cellStyle: {'font-size': '12px'}},
    {
      headerName: 'Amount',
      field: 'amount',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Calculation Type',
      field: 'calculationType',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ICellRendererParams) => {
        return CalculationType[params.value]
      }
    },
    {
      headerName: 'Value',
      field: 'value',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Estimated Value',
      field: 'estimatedValue',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.estimatedBudgetId = id;
        this.getBudgetData(id);
        this.cdr.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Estimated Budget Master Data
  getBudgetData(id: number) {
    this._estimatedBudgetService.getEstimatedBudgetById(id).subscribe((res: IApiResponse<IEstimatedBudget>) => {
      this.estimatedBudgetMaster = res.result;
      this.estimatedBudgetLines = res.result.estimatedBudgetLines;
      
      // this.budgetLines.forEach((line: any) => {
      //   this.totalAmount += line.amount;
      // })
      this.cdr.markForCheck();
      this.isLoading = false;
    })
  }
}



