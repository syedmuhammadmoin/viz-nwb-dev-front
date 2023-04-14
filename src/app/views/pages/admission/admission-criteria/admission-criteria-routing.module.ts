import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import {CreateAdmissionCriteriaComponent} from './create-admission-criteria/create-admission-criteria.component';
import {ListAdmissionCriteriaComponent} from './list-admission-criteria/list-admission-criteria.component';
import {DetailAdmissionCriteriaComponent} from './detail-admission-criteria/detail-admission-criteria.component';
import {PermissionGuard} from '../../../../core/auth/_guards/permission.guard';
import {Permissions} from '../../../shared/AppEnum';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListAdmissionCriteriaComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_CRITERIA_VIEW },
            { permission: Permissions.ADMISSION_CRITERIA_CREATE },
            { permission: Permissions.ADMISSION_CRITERIA_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateAdmissionCriteriaComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_CRITERIA_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateAdmissionCriteriaComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_CRITERIA_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DetailAdmissionCriteriaComponent,
        data: {
          array: [
            { permission: Permissions.ADMISSION_CRITERIA_VIEW },
            { permission: Permissions.ADMISSION_CRITERIA_CREATE },
            { permission: Permissions.ADMISSION_CRITERIA_EDIT },
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
export class AdmissionCriteriaRoutingModule { }
