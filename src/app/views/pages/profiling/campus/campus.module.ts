import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { CampusRoutingModule } from './campus-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { ListCampusComponent } from './list-campus/list-campus.component';

@NgModule({
  declarations: [
    ListCampusComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    CampusRoutingModule,
    AgGridModule
  ]
})
export class CampusModule { }
