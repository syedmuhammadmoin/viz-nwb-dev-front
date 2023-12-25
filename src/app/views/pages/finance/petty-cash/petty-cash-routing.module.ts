import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListPettyCashComponent } from './list-petty-cash/list-petty-cash.component';
import { CreatePettyCashComponent } from './create-petty-cash/create-petty-cash.component';
import { PettyCashDetailsComponent } from './petty-cash-details/petty-cash-details.component';
import { PrintPettyCashComponent } from './print-petty-cash/print-petty-cash.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListPettyCashComponent,
        data: {
          array: [
            { permission: Permissions.PETTYCASH_VIEW },
            { permission: Permissions.PETTYCASH_CREATE },
            { permission: Permissions.PETTYCASH_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreatePettyCashComponent,
        data: {
          array: [
            { permission: Permissions.PETTYCASH_CREATE },
            { permission: Permissions.PETTYCASH_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreatePettyCashComponent,
        data: {
          array: [
            { permission: Permissions.PETTYCASH_EDIT },
            { permission: Permissions.PETTYCASH_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: PettyCashDetailsComponent,
        data: {
          array: [
            { permission: Permissions.PETTYCASH_VIEW },
            { permission: Permissions.PETTYCASH_CREATE },
            { permission: Permissions.PETTYCASH_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintPettyCashComponent,
        data: {
          array: [
            { permission: Permissions.PETTYCASH_VIEW },
            { permission: Permissions.PETTYCASH_CREATE },
            { permission: Permissions.PETTYCASH_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class PettyCashRoutingModule { }
