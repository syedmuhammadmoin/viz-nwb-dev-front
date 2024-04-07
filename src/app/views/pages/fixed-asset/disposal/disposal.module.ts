import {NgModule} from '@angular/core';
import {ListDisposalComponent} from './list-disposal/list-disposal.component';
import {CreateDisposalComponent} from './create-disposal/create-disposal.component';
import {PrintDisposalComponent} from './print-disposal/print-disposal.component';
import {DisposalDetailsComponent} from './disposal-details/disposal-details.component';
import {SharedModule} from 'src/app/views/shared/modules/shared.module';
import {PartialsModule} from 'src/app/views/partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';
import {DisposalRoutingModule} from './disposal-routing.module';


@NgModule({
  declarations: [ListDisposalComponent, CreateDisposalComponent, PrintDisposalComponent, DisposalDetailsComponent],
  imports: [
    SharedModule,
    PartialsModule,
    DisposalRoutingModule,
    AgGridModule
  ]
})
export class DisposalModule {
}
