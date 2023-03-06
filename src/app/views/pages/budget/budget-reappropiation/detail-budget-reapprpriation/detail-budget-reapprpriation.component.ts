import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BUDGET_REAPPROPIATION } from 'src/app/views/shared/AppRoutes';
import { IBudget } from '../model/Ibudget';
import { IBudgetLines } from '../model/IbudgetLines';
import { BudgetReappropriationService } from '../service/budget-reappropriation.service';
import { finalize, take } from 'rxjs/operators';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ActionButton, DocType, DocumentStatus, Permissions } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-detail-budget-reapprpriation',
  templateUrl: './detail-budget-reapprpriation.component.html',
  styleUrls: ['./detail-budget-reapprpriation.component.scss']
})
export class DetailBudgetReapprpriationComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus
  statusMaster: any;

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  //Loader
  isLoading: boolean;

  //need for routing
  budgetId: number;
  public BUDGET_REAPPROPRIATION = BUDGET_REAPPROPIATION;

  //Variables for Budget data
  budgetLines: IBudgetLines | any
  budgetMaster: IBudget | any;

  //Injecting Dependencies
  constructor(
    private budgetReappropriationService: BudgetReappropriationService,
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
    { headerName: 'COA', field: 'level4', filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Campus',
      field: 'campus',
      filter: true,
      tooltipField: 'campus',
      cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Description',
      field: 'description',
      filter: true,
      tooltipField: 'campus',
      cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Addition',
      field: 'additionAmount',
      filter: true,
      tooltipField: 'campus',
      cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Deletion',
      field: 'deletionAmount',
      filter: true,
      tooltipField: 'campus',
      cellStyle: { 'font-size': '12px' }
    }
  ];

  ngOnInit() {
    // console.log(this.budgetMaster.id , 'getting id')
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
    this.budgetReappropriationService.getBudgetReapproById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IBudget>) => {
        this.budgetMaster = res.result;
        this.budgetLines = res.result.budgetReappropriationLines;
        this.cdRef.markForCheck();
      });
  }
}
