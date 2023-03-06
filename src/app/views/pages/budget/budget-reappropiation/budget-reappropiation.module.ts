import { NgModule } from '@angular/core';
import { BudgetReappropiationRoutingModule } from './budget-reappropiation-routing.module';
import { CreateBudgetReappropiationComponent } from './create-budget-reappropiation/create-budget-reappropiation.component';
import { ListBudgetReappropiationComponent } from './list-budget-reappropiation/list-budget-reappropiation.component';
import { AgGridModule } from 'ag-grid-angular';
import { DetailBudgetReapprpriationComponent } from './detail-budget-reapprpriation/detail-budget-reapprpriation.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { PrintBudgetReappropriationComponent } from './print-budget-reappropriation/print-budget-reappropriation.component';




@NgModule({
    declarations: [
        CreateBudgetReappropiationComponent,
        ListBudgetReappropiationComponent,
        DetailBudgetReapprpriationComponent,
        PrintBudgetReappropriationComponent
    ],
    imports: [
        BudgetReappropiationRoutingModule,
        SharedModule,
        PortletModule,
        AgGridModule.withComponents([CustomTooltipComponent])
    ]
})
export class BudgetReappropiationModule { }
