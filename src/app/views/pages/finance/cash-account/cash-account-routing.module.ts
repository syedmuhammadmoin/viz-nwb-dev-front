import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListCashAccountComponent } from './list-cash-account/list-cash-account.component';
import { CASH_ACCOUNT, CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListCashAccountComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.CASHACCOUNT_VIEW },
        //     { permission: Permissions.CASHACCOUNT_CREATE },
        //     { permission: Permissions.CASHACCOUNT_DELETE },
        //     { permission: Permissions.CASHACCOUNT_EDIT },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({ 
    imports: [RouterModule.forChild(route) ],
    exports: [RouterModule]
})

export class CashAccountRoutingModule { }
