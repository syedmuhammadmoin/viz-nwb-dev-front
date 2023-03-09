import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftRoutingModule } from './shift-routing.module';
import { ListShiftComponent } from './list-shift/list-shift.component';


@NgModule({
  declarations: [ListShiftComponent],
  imports: [
    CommonModule,
    ShiftRoutingModule
  ]
})
export class ShiftModule { }
