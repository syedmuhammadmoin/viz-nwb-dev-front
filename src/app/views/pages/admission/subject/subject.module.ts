import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectRoutingModule } from './subject-routing.module';
import { ListSubjectComponent } from './list-subject/list-subject.component';
import { CreateSubjectComponent } from './create-subject/create-subject.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [ListSubjectComponent, CreateSubjectComponent],
  imports: [
    CommonModule,
    SubjectRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class SubjectModule { }
