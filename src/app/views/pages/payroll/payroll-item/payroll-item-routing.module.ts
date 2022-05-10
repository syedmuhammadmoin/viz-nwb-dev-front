import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreatePayrollItemComponent } from './create-payroll-item/create-payroll-item.component';


const route : Routes = [
  {
    path: '',
    children: [
      // {
      //   path: CRUD_ROUTES.LIST,
      //   component: ListCashAccountComponent,
      //   // data: {
      //   //   array: [
      //   //     { permission: Permissions.CASHACCOUNT_VIEW },
      //   //     { permission: Permissions.CASHACCOUNT_CREATE },
      //   //     { permission: Permissions.CASHACCOUNT_DELETE },
      //   //     { permission: Permissions.CASHACCOUNT_EDIT },
      //   //   ]
      //   // },
      //   // canActivate: [PermissionGuard]
      // }
      {
        path: CRUD_ROUTES.CREATE,
        component: CreatePayrollItemComponent,
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

export class PayrollItemRoutingModule { }
