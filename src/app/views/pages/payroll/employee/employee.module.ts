import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';


@NgModule({
  declarations: [
    ListEmployeeComponent,
    EmployeeDetailComponent,
    CreateEmployeeComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    EmployeeRoutingModule,
    AgGridModule
  ]
})
export class EmployeeModule { }
