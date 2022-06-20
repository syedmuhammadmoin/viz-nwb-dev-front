import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListDepartmentComponent } from './list-department/list-department.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListDepartmentComponent,
        data: {
          array: [
            { permission: Permissions.DEPARTMENTS_VIEW },
            { permission: Permissions.DEPARTMENTS_CREATE },
            { permission: Permissions.DEPARTMENTS_EDIT },
            { permission: Permissions.DEPARTMENTS_DELETE }
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

export class DepartmentRoutingModule { }

