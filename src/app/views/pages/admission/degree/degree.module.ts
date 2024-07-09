import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DegreeRoutingModule } from './degree-routing.module';
import { DegreeListComponent } from './degree-list/degree-list.component';
import { CreateDegreeComponent } from './create-degree/create-degree.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [DegreeListComponent, CreateDegreeComponent],
  imports: [
    CommonModule,
    DegreeRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class DegreeModule { }
