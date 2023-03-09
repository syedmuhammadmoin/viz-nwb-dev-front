import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchTypeRoutingModule } from './batch-type-routing.module';
import { ListBatchTypeComponent } from './list-batch-type/list-batch-type.component';


@NgModule({
  declarations: [ListBatchTypeComponent],
  imports: [
    CommonModule,
    BatchTypeRoutingModule
  ]
})
export class BatchTypeModule { }
