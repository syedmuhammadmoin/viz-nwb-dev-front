import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions, CalculationType } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BUDGET, ESTIMATED_BUDGET } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IEstimatedBudgetLines } from '../model/IEstimatedBudgetLines';
import { EstimatedBudgetService } from '../service/estimated-budget.service';
import { IEstimatedBudget } from '../model/IEstimatedBudget';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';

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

  //For AG Grid
  gridOptions: any;;
  defaultColDef: ColDef;

  //Loader
  isLoading: boolean;

  //Need For Routing
  estimatedBudgetId: number;
  public ESTIMATED_BUDGET = ESTIMATED_BUDGET;
  public BUDGET = BUDGET;

  estimatedBudgetLines: IEstimatedBudgetLines | any
  estimatedBudgetMaster: IEstimatedBudgetLines | any;

  //Injecting Dependencies
  constructor(
    private _estimatedBudgetService: EstimatedBudgetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  //Defining AG Grid Columns
  columnDefs = [
    {headerName: 'Account', field: 'accountName', filter: true, cellStyle: {'font-size': '12px'}},
    {
      headerName: 'Amount',
      field: 'amount',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Calculation Type',
      field: 'calculationType',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return CalculationType[params.value]
      }
    },
    {
      headerName: 'Value',
      field: 'value',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Estimated Value',
      field: 'estimatedValue',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
  ];

  //Get Remarks From User
remarksDialog(action: any): void {
  const dialogRef = this.dialog.open(CustomRemarksComponent, {
    width: '740px'
  });
  //sending remarks data after dialog closed
  dialogRef.afterClosed().subscribe((res) => {
    if (res) {
      this.workflow(action, res.data)
    }
  })
}
workflow(action: number, remarks: string) {
  this.isLoading = true
  this._estimatedBudgetService.workflow({ action, docId: this.estimatedBudgetMaster.id, remarks })
    .pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    )
    .subscribe((res) => {
      this.getBudgetData(this.estimatedBudgetId);
      this.cdRef.detectChanges();
      this.toastService.success('' + res.message, 'Invoice');
    })
}

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.estimatedBudgetId = id;
        this.isLoading = true;
        this.getBudgetData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Estimated Budget Master Data
  getBudgetData(id: number) {
    this._estimatedBudgetService.getEstimatedBudgetById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IEstimatedBudget>) => {
      this.estimatedBudgetMaster = res.result;
      this.estimatedBudgetLines = res.result.estimatedBudgetLines;
      
      this.cdRef.markForCheck();
    })
  }
}



