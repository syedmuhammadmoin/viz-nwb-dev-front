import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateAddmissionDepartmentComponent } from './create-addmission-department/create-addmission-department.component';
import { ListAdmisionDepartmentComponent } from './list-admision-department/list-admision-department.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListAdmisionDepartmentComponent,
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
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateAddmissionDepartmentComponent,
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
