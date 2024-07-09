import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistrictRoutingModule } from './district-routing.module';
import { ListDistrictComponent } from './list-district/list-district.component';
import { CreateDistrictComponent } from './create-district/create-district.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [ListDistrictComponent, CreateDistrictComponent],
  imports: [
    CommonModule,
    DistrictRoutingModule,    
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class DistrictModule { }
