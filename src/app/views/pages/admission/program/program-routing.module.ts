import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateProgramComponent } from './create-program/create-program.component';
import { ListProgramComponent } from './list-program/list-program.component';
import {PermissionGuard} from '../../../../core/auth/_guards/permission.guard';
import {Permissions} from '../../../shared/AppEnum';
import {DetailProgramComponent} from './detail-program/detail-program.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListProgramComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_PROGRAM_CREATE },
            { permission: Permissions.ADMISSION_PROGRAM_VIEW },
            { permission: Permissions.ADMISSION_PROGRAM_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateProgramComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_PROGRAM_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateProgramComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_PROGRAM_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DetailProgramComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_PROGRAM_CREATE },
            { permission: Permissions.ADMISSION_PROGRAM_VIEW },
            { permission: Permissions.ADMISSION_PROGRAM_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
