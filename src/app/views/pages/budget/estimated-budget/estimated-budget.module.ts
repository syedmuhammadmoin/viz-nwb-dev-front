import { NgModule } from '@angular/core';
import { CreateEstimatedBudgetComponent } from './create-estimated-budget/create-estimated-budget.component';
import { ListEstimatedBudgetComponent } from './list-estimated-budget/list-estimated-budget.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { EstimatedBudgetRoutingModule } from './estimated-budget-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { DetailEstimatedBudgetComponent } from './detail-estimated-budget/detail-estimated-budget.component';
import { PrintEstimatedBudgetComponent } from './print-estimated-budget/print-estimated-budget.component';


@NgModule({
  declarations: [
    CreateEstimatedBudgetComponent, 
    ListEstimatedBudgetComponent, DetailEstimatedBudgetComponent, PrintEstimatedBudgetComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    EstimatedBudgetRoutingModule,
    AgGridModule
  ]
})
export class EstimatedBudgetModule { }
