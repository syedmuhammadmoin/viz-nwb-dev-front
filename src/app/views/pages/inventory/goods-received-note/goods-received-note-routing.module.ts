import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { FormConfirmationGuard } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { ListGrnComponent } from './list-grn/list-grn.component';
import { GrnDetailComponent } from './grn-detail/grn-detail.component';
import { PrintGrnComponent } from './print-grn/print-grn.component';
import { CreateGrnComponent } from './create-grn/create-grn.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const routes : Routes = [
  {
    path:'',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListGrnComponent,
        data: {
          array: [
            { permission: Permissions.GRN_VIEW },
            { permission: Permissions.GRN_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateGrnComponent,
        canDeactivate: [FormConfirmationGuard],
        data: {
          array: [
            { permission: Permissions.GRN_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateGrnComponent,
        data: {
          array: [
            { permission: Permissions.GRN_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: GrnDetailComponent,
        data: {
          array: [
            { permission: Permissions.GRN_VIEW },
            { permission: Permissions.GRN_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintGrnComponent,
        data: {
          array: [
            { permission: Permissions.GRN_VIEW },
            { permission: Permissions.GRN_CREATE },
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
export class GoodsReceivedNoteRoutingModule { }
