import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListDesignationComponent } from './list-designation/list-designation.component';
import { DesignationRoutingModule } from './designation-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateDesignationComponent } from './create-designation/create-designation.component';
import { DesignationDetailComponent } from './designation-detail/designation-detail.component';


@NgModule({
  declarations: [
    ListDesignationComponent,
    CreateDesignationComponent,
    DesignationDetailComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    DesignationRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
  ],
  entryComponents: [
    CreateDesignationComponent
  ],
})
export class DesignationModule { }
