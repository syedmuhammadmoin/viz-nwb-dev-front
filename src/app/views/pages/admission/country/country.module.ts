import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryRoutingModule } from './country-routing.module';
import {SharedModule} from '../../../shared/modules/shared.module';
import {PartialsModule} from '../../../partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';
import {ListCountryComponent} from './list-country/list-country.component';
import {CreateCountryComponent} from './create-country/create-country.component';


@NgModule({
  declarations: [
    ListCountryComponent,
    CreateCountryComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule,
    SharedModule,
    PartialsModule,
    AgGridModule
  ]
})
export class CountryModule { }
