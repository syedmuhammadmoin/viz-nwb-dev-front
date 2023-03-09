import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeTypeRoutingModule } from './fee-type-routing.module';
import { ListFeeComponent } from './list-fee/list-fee.component';


@NgModule({
  declarations: [ListFeeComponent],
  imports: [
    CommonModule,
    FeeTypeRoutingModule
  ]
})
export class FeeTypeModule { }
