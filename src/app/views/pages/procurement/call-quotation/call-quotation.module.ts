import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CallQuotaionRoutingModule } from './call-quotaion-routing.module';
import { ListCallQuotaionComponent } from './list-call-quotaion/list-call-quotaion.component';
import { CreateCallQuotaionComponent } from './create-call-quotaion/create-call-quotaion.component';
import { CallQuotaionDetailsComponent } from './call-quotaion-details/call-quotaion-details.component';
import { PrintCallQuotaionComponent } from './print-call-quotaion/print-call-quotaion.component';



@NgModule({
  declarations: [
    ListCallQuotaionComponent,
    CreateCallQuotaionComponent,
    CallQuotaionDetailsComponent,
    PrintCallQuotaionComponent
  ],
  imports: [
    CommonModule,
    AgGridModule,
    PartialsModule,
    SharedModule,
    CallQuotaionRoutingModule
  ]
})
export class CallQuotationModule { }
