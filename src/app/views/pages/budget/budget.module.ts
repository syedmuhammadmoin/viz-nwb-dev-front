import { NgModule } from '@angular/core';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { PartialsModule } from '../../partials/partials.module';
import { BudgetRoutingModule } from './budget-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from '../../shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [
    CreateBudgetComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    BudgetRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})

export class BudgetModule { }
