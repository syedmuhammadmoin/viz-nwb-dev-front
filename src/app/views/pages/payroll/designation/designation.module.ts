import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListDesignationComponent } from './list-designation/list-designation.component';
import { DesignationRoutingModule } from './designation-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    ListDesignationComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    DesignationRoutingModule,
    AgGridModule
  ]
})
export class DesignationModule { }
