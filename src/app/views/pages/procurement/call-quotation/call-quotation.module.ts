import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { CallQuotaionRoutingModule } from './call-quotaion-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgGridModule,
    PartialsModule,
    SharedModule,
    CallQuotaionRoutingModule
  ]
})
export class CallQuotationModule { }
