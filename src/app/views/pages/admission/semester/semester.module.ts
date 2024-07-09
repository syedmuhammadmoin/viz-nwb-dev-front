import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/modules/shared.module';
import {ListSemesterComponent} from './list-semester/list-semester.component';
import {CreateSemesterComponent} from './create-semester/create-semester.component';
import {PartialsModule} from '../../../partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';
import {SemesterRoutingModule} from './semester-routing.module';

@NgModule({
  declarations: [
    ListSemesterComponent,
    CreateSemesterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    SemesterRoutingModule,
    AgGridModule
  ],
})
export class SemesterModule {
}
