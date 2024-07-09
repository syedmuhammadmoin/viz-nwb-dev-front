import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateRoutingModule } from './state-routing.module';
import {SharedModule} from '../../../shared/modules/shared.module';
import {PartialsModule} from '../../../partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';
import { ListStateComponent } from './list-state/list-state.component';
import { CreateStateComponent } from './create-state/create-state.component';


@NgModule({
  declarations: [ListStateComponent, CreateStateComponent],
  imports: [
    CommonModule,
    StateRoutingModule,
    SharedModule,
    PartialsModule,
    AgGridModule
  ]
})
export class StateModule { }
