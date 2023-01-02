import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListCallQuotaionComponent } from './list-call-quotaion/list-call-quotaion.component';
import { CreateCallQuotaionComponent } from './create-call-quotaion/create-call-quotaion.component';
import { CallQuotaionDetailsComponent } from './call-quotaion-details/call-quotaion-details.component';
import { PrintCallQuotaionComponent } from './print-call-quotaion/print-call-quotaion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListCallQuotaionComponent,
        data: {
          array: [
            { permission: Permissions.CALL_QUOTATION_VIEW },
            { permission: Permissions.CALL_QUOTATION_CREATE },
            { permission: Permissions.CALL_QUOTATION_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateCallQuotaionComponent,
        data: {
          array: [
            { permission: Permissions.CALL_QUOTATION_CREATE },
            { permission: Permissions.CALL_QUOTATION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateCallQuotaionComponent,
        data: {
          array: [
            { permission: Permissions.CALL_QUOTATION_EDIT },
            { permission: Permissions.CALL_QUOTATION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: CallQuotaionDetailsComponent,
        data: {
          array: [
            { permission: Permissions.CALL_QUOTATION_VIEW },
            { permission: Permissions.CALL_QUOTATION_CREATE },
            { permission: Permissions.CALL_QUOTATION_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintCallQuotaionComponent,
        data: {
          array: [
            { permission: Permissions.CALL_QUOTATION_VIEW },
            { permission: Permissions.CALL_QUOTATION_CREATE },
            { permission: Permissions.CALL_QUOTATION_EDIT },
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

export class CallQuotaionRoutingModule { }

