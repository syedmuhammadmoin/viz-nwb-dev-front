import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualificationRoutingModule } from './qualification-routing.module';
import { ListQualificationComponent } from './list-qualification/list-qualification.component';
import { CreateQualificationComponent } from './create-qualification/create-qualification.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [ListQualificationComponent, CreateQualificationComponent],
  imports: [
    CommonModule,
    QualificationRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule
  ]
})
export class QualificationModule { }
