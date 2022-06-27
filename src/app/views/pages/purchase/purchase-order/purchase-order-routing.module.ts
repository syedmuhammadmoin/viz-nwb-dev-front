import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { NgModule } from '@angular/core';

import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListPurchaseOrderComponent } from './list-purchase-order/list-purchase-order.component';

import { FormConfirmationGuard } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PrintPurchaseOrderComponent } from './print-purchase-order/print-purchase-order.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';

const routes : Routes = [
  {
    path:'',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListPurchaseOrderComponent,
        data: {
          array: [
            { permission: Permissions.PURCHASEORDER_VIEW },
            { permission: Permissions.PURCHASEORDER_EDIT },
            { permission: Permissions.PURCHASEORDER_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreatePurchaseOrderComponent,
        //canDeactivate: [FormConfirmationGuard],
        data: {
          array: [
            { permission: Permissions.PURCHASEORDER_CREATE },
            { permission: Permissions.PURCHASEORDER_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreatePurchaseOrderComponent,
        data: {
          array: [
            { permission: Permissions.PURCHASEORDER_EDIT },
            { permission: Permissions.PURCHASEORDER_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: PurchaseOrderDetailComponent,
        data: {
          array: [
            { permission: Permissions.PURCHASEORDER_VIEW },
            { permission: Permissions.PURCHASEORDER_EDIT },
            { permission: Permissions.PURCHASEORDER_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintPurchaseOrderComponent,
        data: {
          array: [
            { permission: Permissions.PURCHASEORDER_VIEW },
            { permission: Permissions.PURCHASEORDER_EDIT },
            { permission: Permissions.PURCHASEORDER_CREATE },
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
export class PurchaseOrderRoutingModule { }
