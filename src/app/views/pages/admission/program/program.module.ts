
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramRoutingModule } from './program-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { ListProgramComponent } from './list-program/list-program.component';
import { CreateProgramComponent } from './create-program/create-program.component';
import { DetailProgramComponent } from './detail-program/detail-program.component';


@NgModule({
  declarations: [ListProgramComponent, CreateProgramComponent, DetailProgramComponent],
  imports: [
    CommonModule,
    ProgramRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class ProgramModule { }

