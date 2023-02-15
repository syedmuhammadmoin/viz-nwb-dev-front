import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListCwipComponent } from './list-cwip/list-cwip.component';
import { CwipDetailsComponent } from './cwip-details/cwip-details.component';
import { CreateCwipComponent } from './create-cwip/create-cwip.component';
import { PrintCwipComponent } from './print-cwip/print-cwip.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListCwipComponent,
        data: {
          array: [
            { permission: Permissions.CWIP_VIEW },
            { permission: Permissions.CWIP_CREATE },
            { permission: Permissions.CWIP_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateCwipComponent,
        data: {
          array: [
            { permission: Permissions.CWIP_CREATE },
            { permission: Permissions.CWIP_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateCwipComponent,
        data: {
          array: [
            { permission: Permissions.CWIP_EDIT },
            { permission: Permissions.CWIP_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: CwipDetailsComponent,
        data: {
          array: [
            { permission: Permissions.CWIP_VIEW },
            { permission: Permissions.CWIP_CREATE },
            { permission: Permissions.CWIP_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintCwipComponent,
        data: {
          array: [
            { permission: Permissions.CWIP_VIEW },
            { permission: Permissions.CWIP_CREATE },
            { permission: Permissions.CWIP_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CwipRoutingModule { }

