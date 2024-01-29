import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListDepartmentComponent } from './list-department/list-department.component';
import { DepartmentRoutingModule } from './department-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CreateDepartmentComponent } from './create-department/create-department.component';
import { DepartmentDetailComponent } from './department-detail/department-detail.component';


@NgModule({
  declarations: [
    ListDepartmentComponent,
    DepartmentDetailComponent,
    CreateDepartmentComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    DepartmentRoutingModule,
    AgGridModule
  ],
  entryComponents: [
    CreateDepartmentComponent
  ],
 
})
export class DepartmentModule { }
