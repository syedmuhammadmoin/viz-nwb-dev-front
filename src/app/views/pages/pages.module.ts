// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import {AgGridModule} from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { CreateFiscalYearComponent } from './profiling/fiscal-year/create-fiscal-year/create-fiscal-year.component';
import { ListFiscalYearsComponent } from './profiling/fiscal-year/list-fiscal-years/list-fiscal-years.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        CoreModule,
        AgGridModule,
        MatButtonModule,
        PartialsModule,
    ],
    declarations: [

  ],
})

export class PagesModule { }
