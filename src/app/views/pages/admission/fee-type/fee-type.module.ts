import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeTypeRoutingModule } from './fee-type-routing.module';
import { ListFeeComponent } from './list-fee/list-fee.component';
import { CreateFeeTypeComponent } from './create-fee-type/create-fee-type.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [ListFeeComponent, CreateFeeTypeComponent],
  imports: [
    CommonModule,
    FeeTypeRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class FeeTypeModule { }
