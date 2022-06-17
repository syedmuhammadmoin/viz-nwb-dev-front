import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreatePayrollItemComponent } from './create-payroll-item/create-payroll-item.component';
import { ListPayrollItemComponent } from './list-payroll-item/list-payroll-item.component';


const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListPayrollItemComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_ITEM_VIEW },
            { permission: Permissions.PAYROLL_ITEM_CREATE },
            { permission: Permissions.PAYROLL_ITEM_EDIT},
            { permission: Permissions.PAYROLL_ITEM_DELETE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreatePayrollItemComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_ITEM_VIEW },
            { permission: Permissions.PAYROLL_ITEM_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreatePayrollItemComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_ITEM_VIEW },
            { permission: Permissions.PAYROLL_ITEM_CREATE },
            { permission: Permissions.PAYROLL_ITEM_EDIT}
          ]
        },
        canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({ 
    imports: [RouterModule.forChild(route) ],
    exports: [RouterModule]
})

export class PayrollItemRoutingModule { }
