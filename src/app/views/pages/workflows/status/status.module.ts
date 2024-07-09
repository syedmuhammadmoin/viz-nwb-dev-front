import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { CreateStatusComponent } from './create-status/create-status.component';
import { ListStatusComponent } from './list-status/list-status.component';
import { StatusRoutingModule } from './status-routing.module';

@NgModule({
  declarations: [
    CreateStatusComponent,
    ListStatusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    StatusRoutingModule,
    AgGridModule
  ]
})


export class StatusModule { }
