import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkFlowRoutingModule } from './workflow-routing.module';
import { ListWorkflowComponent } from './list-workflow/list-workflow.component';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { PartialsModule } from '../../../partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../../shared/modules/shared.module';

@NgModule({
  declarations: [
    ListWorkflowComponent,
    CreateWorkflowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    WorkFlowRoutingModule,
    AgGridModule
  ]
})
export class WorkflowModule { }
