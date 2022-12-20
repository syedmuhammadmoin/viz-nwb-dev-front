import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CreateQuotationComponent } from './create-quotation/create-quotation.component';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';
import { ListQuotationComponent } from './list-quotation/list-quotation.component';
import { PrintQuotationComponent } from './print-quotation/print-quotation.component';
import { RouterModule } from '@angular/router';
import { QuotaionRoutingModule } from './quotaion-routing.module';



@NgModule({
  declarations: [
  CreateQuotationComponent,
  QuotationDetailsComponent,
  ListQuotationComponent,
  PrintQuotationComponent],
  imports: [
    CommonModule,
    AgGridModule,
    PartialsModule,
    SharedModule,
    QuotaionRoutingModule
  ]
})
export class QuotationModule { }
