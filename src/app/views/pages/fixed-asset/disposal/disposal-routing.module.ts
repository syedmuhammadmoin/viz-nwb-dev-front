import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListDisposalComponent } from './list-disposal/list-disposal.component';
import { CreateDisposalComponent } from './create-disposal/create-disposal.component';
import { PrintDisposalComponent } from './print-disposal/print-disposal.component';
import { DisposalDetailsComponent } from './disposal-details/disposal-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListDisposalComponent,
        data: {
          array: [
            { permission: Permissions.DISPOSAL_VIEW },
            { permission: Permissions.DISPOSAL_CREATE },
            { permission: Permissions.DISPOSAL_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateDisposalComponent,
        data: {
          array: [
            { permission: Permissions.DISPOSAL_CREATE },
            { permission: Permissions.DISPOSAL_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateDisposalComponent,
        data: {
          array: [
            { permission: Permissions.DISPOSAL_EDIT },
            { permission: Permissions.DISPOSAL_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DisposalDetailsComponent,
        data: {
          array: [
            { permission: Permissions.DISPOSAL_VIEW },
            { permission: Permissions.DISPOSAL_CREATE },
            { permission: Permissions.DISPOSAL_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintDisposalComponent,
        data: {
          array: [
            { permission: Permissions.DISPOSAL_VIEW },
            { permission: Permissions.DISPOSAL_CREATE },
            { permission: Permissions.DISPOSAL_EDIT },
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
export class DisposalRoutingModule { }
