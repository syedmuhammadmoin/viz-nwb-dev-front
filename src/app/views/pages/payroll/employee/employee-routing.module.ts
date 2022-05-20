import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListEmployeeComponent,
        data: {
          array: [
            { permission: Permissions.EMPLOYEE_VIEW }
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: EmployeeDetailComponent,
        data: {
          array: [
            { permission: Permissions.EMPLOYEE_VIEW }
          ]
        },
        canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class EmployeeRoutingModule { }
