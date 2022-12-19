import { NgModule } from '@angular/core';
import { CreateBidEvaluationComponent } from './create-bid-evaluation/create-bid-evaluation.component';
import { ListBidEvaluationComponent } from './list-bid-evaluation/list-bid-evaluation.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { BidEvaluationRoutingModule } from './bid-evaluation-routing.module';


@NgModule({
  declarations: [
    CreateBidEvaluationComponent, 
    ListBidEvaluationComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    BidEvaluationRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class BidEvaluationModule { }
