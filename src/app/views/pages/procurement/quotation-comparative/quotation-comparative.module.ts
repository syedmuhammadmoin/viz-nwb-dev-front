import { NgModule } from '@angular/core';
import { CreateQuotationComparativeComponent } from './create-quotation-comparative/create-quotation-comparative.component';
import { ListQuotationComparativeComponent } from './list-quotation-comparative/list-quotation-comparative.component';
import { QuotationComparativeDetailComponent } from './quotation-comparative-detail/quotation-comparative-detail.component';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { QuotationComparativeRoutingModule } from './quotation-comparative-routing.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [
    CreateQuotationComparativeComponent, 
    ListQuotationComparativeComponent, 
    QuotationComparativeDetailComponent
  ],
  imports: [
    PartialsModule,
    SharedModule,
    QuotationComparativeRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class QuotationComparativeModule { }
