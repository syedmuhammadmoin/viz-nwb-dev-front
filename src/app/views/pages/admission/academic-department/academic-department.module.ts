import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicDepartmentRoutingModule } from './academic-department-routing.module';
import { ListAcademicDepartmentComponent } from './list-academic-department/list-academic-department.component';
import { CreateAcademicDepartmentComponent } from './create-academic-department/create-academic-department.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [ListAcademicDepartmentComponent, CreateAcademicDepartmentComponent],
  imports: [
    CommonModule,
    AcademicDepartmentRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class AcademicDepartmentModule { }
