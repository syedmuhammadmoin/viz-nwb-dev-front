import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { CampusRoutingModule } from './campus-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateCampusComponent } from './create-campus/create-campus.component';
import { ListCampusComponent } from './list-campus/list-campus.component';

@NgModule({
  declarations: [
    CreateCampusComponent, 
    ListCampusComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    CampusRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
  ],
  entryComponents: [CreateCampusComponent]
})
export class CampusModule { }
