import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BUDGET } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IBudgetLines } from '../model/IBudgetLines';
import { BudgetService } from '../service/budget.service';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';

@Component({
  selector: 'kt-detail-budget',
  templateUrl: './detail-budget.component.html',
  styleUrls: ['./detail-budget.component.scss']
})

export class DetailBudgetComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  //Loader
  isLoading: boolean;

  //need for routing
  budgetId: number;
  public BUDGET = BUDGET;

  //Variables for Budget data
  budgetLines: IBudgetLines | any
  budgetMaster: IBudgetResponse | any;
  totalAmount: number = 0;
  totalRevisedAmount: number = 0;
  
  

  //Injecting Dependencies
  constructor(
    private _budgetService: BudgetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining columns of AG Grid
  columnDefs = [
    {headerName: 'COA', field: 'accountName', filter: true, cellStyle: {'font-size': '12px'}},
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
      headerName: 'Revised Budget',
      field: 'revisedAmount',
      filter: true,
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ICellRendererParams) => {
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
  this._budgetService.workflow({ action, docId: this.budgetMaster.id, remarks })
    .pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    )
    .subscribe((res) => {
      this.getBudgetData(this.budgetId);
      this.cdRef.detectChanges();
      this.toastService.success('' + res.message, 'Budget');
    })
}
  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.budgetId = id;
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

  //Getting Budget Master Data
  getBudgetData(id: number) {
    this._budgetService.getBudgetById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IBudgetResponse>) => {
      this.budgetMaster = res.result;
      this.budgetLines = res.result.budgetLines;
      this.budgetLines.forEach((line: any) => {
        this.totalAmount += line.amount;
        this.totalRevisedAmount += line.revisedAmount;
      })
      this.cdRef.markForCheck();
    });
  }
}
