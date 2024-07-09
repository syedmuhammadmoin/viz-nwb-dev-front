import { NgModule } from '@angular/core';
import { CreateBidEvaluationComponent } from './create-bid-evaluation/create-bid-evaluation.component';
import { ListBidEvaluationComponent } from './list-bid-evaluation/list-bid-evaluation.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { BidEvaluationRoutingModule } from './bid-evaluation-routing.module';
import { BidEvaluationDetailComponent } from './bid-evaluation-detail/bid-evaluation-detail.component';
import { PrintBidEvaluationComponent } from './print-bid-evaluation/print-bid-evaluation.component';


@NgModule({
  declarations: [
    CreateBidEvaluationComponent, 
    ListBidEvaluationComponent, 
    BidEvaluationDetailComponent, 
    PrintBidEvaluationComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    BidEvaluationRoutingModule,
    AgGridModule
  ]
})
export class BidEvaluationModule { }
