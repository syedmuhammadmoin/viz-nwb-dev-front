import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListDepartmentComponent } from '../../payroll/department/list-department/list-department.component';
import { DepartmentModule } from './department.module';
import { ListDeparmentComponent } from './list-deparment/list-deparment.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListDeparmentComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.FACULTY_VIEW },
        //     { permission: Permissions.FACULTY_CREATE },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
