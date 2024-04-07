import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import {SharedModule} from '../../../shared/modules/shared.module';
import {PartialsModule} from '../../../partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';
import { ListCityComponent } from './list-city/list-city.component';
import { CreateCityComponent } from './create-city/create-city.component';


@NgModule({
  declarations: [ListCityComponent, CreateCityComponent],
  imports: [
    CommonModule,
    CityRoutingModule,
    SharedModule,
    PartialsModule,
    AgGridModule
  ]
})
export class CityModule { }
