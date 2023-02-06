import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListIssuanceReturnComponent } from './list-issuance-return/list-issuance-return.component';
import { CreateIssuanceReturnComponent } from './create-issuance-return/create-issuance-return.component';
import { IssuanceReturnDetailComponent } from './issuance-return-detail/issuance-return-detail.component';
import { PrintIssuanceReturnComponent } from './print-issuance-return/print-issuance-return.component';

const routes : Routes = [
  {
    path:'',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListIssuanceReturnComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_RETURN_VIEW },
            { permission: Permissions.ISSUANCE_RETURN_EDIT },
            { permission: Permissions.ISSUANCE_RETURN_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateIssuanceReturnComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_RETURN_CREATE },
            { permission: Permissions.ISSUANCE_RETURN_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateIssuanceReturnComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_RETURN_EDIT },
            { permission: Permissions.ISSUANCE_RETURN_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: IssuanceReturnDetailComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_RETURN_VIEW },
            { permission: Permissions.ISSUANCE_RETURN_EDIT },
            { permission: Permissions.ISSUANCE_RETURN_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintIssuanceReturnComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_RETURN_VIEW },
            { permission: Permissions.ISSUANCE_RETURN_EDIT },
            { permission: Permissions.ISSUANCE_RETURN_CREATE },
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
export class IssuanceReturnRoutingModule { }
