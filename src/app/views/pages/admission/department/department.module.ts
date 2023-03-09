import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { ListDeparmentComponent } from './list-deparment/list-deparment.component';


@NgModule({
  declarations: [ListDeparmentComponent],
  imports: [
    CommonModule,
    DepartmentRoutingModule
  ]
})
export class DepartmentModule { }
