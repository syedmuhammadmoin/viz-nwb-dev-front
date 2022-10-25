import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { CampusRoutingModule } from './campus-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { ListCampusComponent } from './list-campus/list-campus.component';

@NgModule({
  declarations: [
    ListCampusComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    CampusRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
  ]
})
export class CampusModule { }
