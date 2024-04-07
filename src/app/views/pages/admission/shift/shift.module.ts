import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftRoutingModule } from './shift-routing.module';
import { ListShiftComponent } from './list-shift/list-shift.component';
import { CreateShiftComponent } from './create-shift/create-shift.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [ListShiftComponent, CreateShiftComponent],
  imports: [
    CommonModule,
    ShiftRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class ShiftModule { }
