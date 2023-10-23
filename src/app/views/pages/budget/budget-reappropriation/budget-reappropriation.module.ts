import { NgModule } from '@angular/core';
import { CreateBudgetReappropriationComponent } from './create-budget-reappropriation/create-budget-reappropriation.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { PrintBudgetReappropriationComponent } from './print-budget-reappropriation/print-budget-reappropriation.component';
import { ListBudgetReappropriationComponent } from './list-budget-reappropriation/list-budget-reappropriation.component';
import { DetailBudgetReappropriationComponent } from './detail-budget-reappropriation/detail-budget-reappropriation.component';
import { BudgetReappropriationRoutingModule } from './budget-reappropriation-routing.module';


@NgModule({
    declarations: [
        CreateBudgetReappropriationComponent,
        ListBudgetReappropriationComponent,
        DetailBudgetReappropriationComponent,
        PrintBudgetReappropriationComponent
    ],
    imports: [
        BudgetReappropriationRoutingModule,
        SharedModule,
        PortletModule,
        AgGridModule.withComponents([CustomTooltipComponent])
    ]
})
export class BudgetReappropriationModule { }
