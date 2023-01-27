import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListDepartmentComponent } from './list-department/list-department.component';
import { DepartmentRoutingModule } from './department-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    ListDepartmentComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    DepartmentRoutingModule,
    AgGridModule
  ]
})
export class DepartmentModule { }
