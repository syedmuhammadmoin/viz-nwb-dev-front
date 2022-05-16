import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    ListEmployeeComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    EmployeeRoutingModule,
    // AgGridModule.withComponents([CustomTooltipComponent])
    AgGridModule
  ]
})
export class EmployeeModule { }
