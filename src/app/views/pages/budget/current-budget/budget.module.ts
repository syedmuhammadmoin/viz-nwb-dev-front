import { NgModule } from '@angular/core';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { SharedModule } from '../../../shared/modules/shared.module';
import { PartialsModule } from '../../../partials/partials.module';
import { BudgetRoutingModule } from './budget-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { ListBudgetComponent } from './list-budget/list-budget.component';
import { DetailBudgetComponent } from './detail-budget/detail-budget.component';
import { PrintBudgetComponent } from './print-budget/print-budget.component';
import { BudgetReportComponent } from './budget-report/budget-report.component';


@NgModule({
  declarations: [
    CreateBudgetComponent,
    ListBudgetComponent,
    DetailBudgetComponent,
    PrintBudgetComponent,
    BudgetReportComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    BudgetRoutingModule,
    AgGridModule
  ]
})

export class BudgetModule { }
