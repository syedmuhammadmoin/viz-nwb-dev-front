import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchRoutingModule } from './batch-routing.module';
import { ListBatchComponent } from './list-batch/list-batch.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { DetailBatchComponent } from './detail-batch/detail-batch.component';


@NgModule({
  declarations: [ListBatchComponent, CreateBatchComponent, DetailBatchComponent],
  imports: [
    CommonModule,
    BatchRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class BatchModule { }
