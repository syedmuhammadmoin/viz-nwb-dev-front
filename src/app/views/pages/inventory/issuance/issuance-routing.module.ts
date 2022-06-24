import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListIssuanceComponent } from './list-issuance/list-issuance.component';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CreateIssuanceComponent } from './create-issuance/create-issuance.component';
import { IssuanceDetailsComponent } from './issuance-details/issuance-details.component';
import { PrintIssuanceComponent } from './print-issuance/print-issuance.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListIssuanceComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_VIEW },
            { permission: Permissions.ISSUANCE_CREATE },
            { permission: Permissions.ISSUANCE_EDIT },
            { permission: Permissions.ISSUANCE_DELETE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateIssuanceComponent,
       //canDeactivate: [FormConfirmationGuard],
        data: {
          array: [
            { permission: Permissions.ISSUANCE_VIEW },
            { permission: Permissions.ISSUANCE_CREATE },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateIssuanceComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_VIEW },
            { permission: Permissions.ISSUANCE_EDIT },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: IssuanceDetailsComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_VIEW },
            { permission: Permissions.ISSUANCE_CREATE },
            { permission: Permissions.ISSUANCE_EDIT },
            { permission: Permissions.ISSUANCE_DELETE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintIssuanceComponent,
        data: {
          array: [
            { permission: Permissions.ISSUANCE_VIEW },
            { permission: Permissions.ISSUANCE_CREATE },
            { permission: Permissions.ISSUANCE_EDIT },
            { permission: Permissions.ISSUANCE_DELETE },
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

export class IssuanceRoutingModule { }
