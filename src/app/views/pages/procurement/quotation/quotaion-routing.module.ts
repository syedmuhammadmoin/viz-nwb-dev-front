import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { FormConfirmationGuard } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListQuotationComponent } from './list-quotation/list-quotation.component';
import { CreateQuotationComponent } from './create-quotation/create-quotation.component';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';
import { PrintQuotationComponent } from './print-quotation/print-quotation.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListQuotationComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_VIEW },
            { permission: Permissions.QUOTATION_CREATE },
            { permission: Permissions.QUOTATION_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateQuotationComponent,
       canDeactivate: [FormConfirmationGuard],
        data: {
          array: [
            { permission: Permissions.QUOTATION_CREATE },
            { permission: Permissions.QUOTATION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateQuotationComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_EDIT },
            { permission: Permissions.QUOTATION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: QuotationDetailsComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_VIEW },
            { permission: Permissions.QUOTATION_CREATE },
            { permission: Permissions.QUOTATION_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintQuotationComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_VIEW },
            { permission: Permissions.QUOTATION_CREATE },
            { permission: Permissions.QUOTATION_EDIT },
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

export class QuotaionRoutingModule { }
