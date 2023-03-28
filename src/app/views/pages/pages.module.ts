// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import {AgGridModule} from "ag-grid-angular";
import { MatButtonModule } from '@angular/material/button';
import { ListSemesterComponent } from './admission/semester/list-semester/list-semester.component';
import { CreateSemesterComponent } from './admission/semester/create-semester/create-semester.component';
import {SharedModule} from '../shared/modules/shared.module';


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
})

export class PagesModule { }
