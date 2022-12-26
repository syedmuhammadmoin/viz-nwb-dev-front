import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CreateQuotationComponent } from './create-quotation/create-quotation.component';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';
import { ListQuotationComponent } from './list-quotation/list-quotation.component';
import { PrintQuotationComponent } from './print-quotation/print-quotation.component';
import { QuotaionRoutingModule } from './quotaion-routing.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import 'ag-grid-enterprise';


@NgModule({
  declarations: [
  CreateQuotationComponent,
  QuotationDetailsComponent,
  ListQuotationComponent,
  PrintQuotationComponent],
  imports: [
    PartialsModule,
    SharedModule,
    QuotaionRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class QuotationModule { }
