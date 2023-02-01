import { NgModule } from '@angular/core';
import { ListCwipComponent } from './list-cwip/list-cwip.component';
import { CreateCwipComponent } from './create-cwip/create-cwip.component';
import { PrintCwipComponent } from './print-cwip/print-cwip.component';
import { CwipDetailsComponent } from './cwip-details/cwip-details.component';
import {SharedModule} from 'src/app/views/shared/modules/shared.module';
import {PartialsModule} from 'src/app/views/partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';
import { CwipRoutingModule } from './cwip-routing.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';





@NgModule({
  declarations: [ListCwipComponent, CreateCwipComponent, PrintCwipComponent, CwipDetailsComponent],
  imports: [
    SharedModule,
    PartialsModule,
    CwipRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ], 
  entryComponents: [
    CreateCwipComponent
   ]
})
export class CwipModule { }
