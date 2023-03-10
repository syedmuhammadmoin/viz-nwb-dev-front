import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchTypeRoutingModule } from './batch-type-routing.module';
import { ListBatchTypeComponent } from './list-batch-type/list-batch-type.component';
import { CreateBatchTypeComponent } from './create-batch-type/create-batch-type.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [ListBatchTypeComponent, CreateBatchTypeComponent],
  imports: [
    CommonModule,
    BatchTypeRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class BatchTypeModule { }
