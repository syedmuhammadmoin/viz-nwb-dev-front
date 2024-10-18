import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiscalYearRoutingModule } from './fiscal-year-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CreateFiscalYearComponent } from './create-fiscal-year/create-fiscal-year.component';
import { ListFiscalYearsComponent } from './list-fiscal-years/list-fiscal-years.component';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    CreateFiscalYearComponent,
    ListFiscalYearsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    AgGridModule,
    FiscalYearRoutingModule
  ]
})
export class FiscalYearModule { }
