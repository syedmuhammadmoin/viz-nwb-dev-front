import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { ListCourseComponent } from './list-course/list-course.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [ListCourseComponent, CreateCourseComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class CourseModule { }