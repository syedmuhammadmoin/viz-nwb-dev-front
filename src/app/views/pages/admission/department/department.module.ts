import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { ListAdmisionDepartmentComponent } from './list-admision-department/list-admision-department.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateAddmissionDepartmentComponent } from './create-addmission-department/create-addmission-department.component';


@NgModule({
  declarations: [ListAdmisionDepartmentComponent, CreateAddmissionDepartmentComponent],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class DepartmentModule { }
