import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListRequestRequisitionComponent } from './list-request-requisition/list-request-requisition.component';
import { CreateRequestRequisitionComponent } from './create-request-requisition/create-request-requisition.component';
import { RequestRequisitionDetailsComponent } from './request-requisition-details/request-requisition-details.component';
import { PrintRequestRequisitionComponent } from './print-request-requisition/print-request-requisition.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListRequestRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUEST_VIEW },
            { permission: Permissions.REQUEST_CREATE },
            { permission: Permissions.REQUEST_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateRequestRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUEST_CREATE },
            { permission: Permissions.REQUEST_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateRequestRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUEST_EDIT },
            { permission: Permissions.REQUEST_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: RequestRequisitionDetailsComponent,
        data: {
          array: [
            { permission: Permissions.REQUEST_VIEW },
            { permission: Permissions.REQUEST_EDIT },
            { permission: Permissions.REQUEST_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintRequestRequisitionComponent,
        data: {
          array: [
            { permission: Permissions.REQUEST_VIEW },
            { permission: Permissions.REQUEST_EDIT },
            { permission: Permissions.REQUEST_CREATE },
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
export class RequestRequisitionRoutingModule { }
