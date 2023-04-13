import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { ListBatchComponent } from './list-batch/list-batch.component';
import {PermissionGuard} from '../../../../core/auth/_guards/permission.guard';
import {Permissions} from '../../../shared/AppEnum';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListBatchComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_BATCH_VIEW },
            { permission: Permissions.ADMISSION_BATCH_CREATE },
            { permission: Permissions.ADMISSION_BATCH_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateBatchComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_BATCH_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateBatchComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_BATCH_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: CreateBatchComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_BATCH_VIEW },
            { permission: Permissions.ADMISSION_BATCH_CREATE },
            { permission: Permissions.ADMISSION_BATCH_EDIT },
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
export class BatchRoutingModule { }
