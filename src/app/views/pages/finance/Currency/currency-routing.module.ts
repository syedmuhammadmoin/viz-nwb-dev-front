import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { CreateCurrencyComponent } from './Component/create-currency/create-currency.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CurrencyListComponent } from './Component/currency-list/currency-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: CurrencyListComponent,
        data: {
          array: [
            { permission: Permissions.CURRENCY_VIEW },
            { permission: Permissions.CURRENCY_CREATE },
            { permission: Permissions.CURRENCY_EDIT },
          ]
        },
       // canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateCurrencyComponent,
        data: {
          array: [
            { permission: Permissions.CURRENCY_CREATE },
            { permission: Permissions.CURRENCY_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateCurrencyComponent,
        data: {
          array: [
            { permission: Permissions.CURRENCY_EDIT },
            { permission: Permissions.CURRENCY_VIEW },
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
export class CurrencyRoutingModule { }
