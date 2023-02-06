import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListRequisitionComponent } from './list-requisition/list-requisition.component';
import { CreateRequisitionComponent } from './create-requisition/create-requisition.component';
import { RequisitionDetailsComponent } from './requisition-details/requisition-details.component';
import { PrintRequisitionComponent } from './print-requisition/print-requisition.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUISITION_VIEW },
            { permission: Permissions.REQUISITION_CREATE },
            { permission: Permissions.REQUISITION_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUISITION_CREATE },
            { permission: Permissions.REQUISITION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUISITION_EDIT },
            { permission: Permissions.REQUISITION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: RequisitionDetailsComponent,
        data: {
          array: [
            { permission: Permissions.REQUISITION_VIEW },
            { permission: Permissions.REQUISITION_EDIT },
            { permission: Permissions.REQUISITION_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUISITION_VIEW },
            { permission: Permissions.REQUISITION_EDIT },
            { permission: Permissions.REQUISITION_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisitionRoutingModule { }
