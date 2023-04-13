import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateShiftComponent } from './create-shift/create-shift.component';
import { ListShiftComponent } from './list-shift/list-shift.component';
import {Permissions} from '../../../shared/AppEnum';
import {PermissionGuard} from '../../../../core/auth/_guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListShiftComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_SHIFT_VIEW },
            { permission: Permissions.ADMISSION_SHIFT_CREATE },
            { permission: Permissions.ADMISSION_SHIFT_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateShiftComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_SHIFT_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
    ]
  },
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateShiftComponent,
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
export class ShiftRoutingModule { }
