import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchRoutingModule } from './batch-routing.module';
import { ListBatchComponent } from './list-batch/list-batch.component';


@NgModule({
  declarations: [ListBatchComponent],
  imports: [
    CommonModule,
    BatchRoutingModule
  ]
})
export class BatchModule { }
