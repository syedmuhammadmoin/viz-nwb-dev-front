import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateQuotationComparativeComponent } from './create-quotation-comparative/create-quotation-comparative.component';
import { QuotationComparativeDetailComponent } from './quotation-comparative-detail/quotation-comparative-detail.component';
import { ListQuotationComparativeComponent } from './list-quotation-comparative/list-quotation-comparative.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListQuotationComparativeComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_COMPARATIVE_VIEW },
            { permission: Permissions.QUOTATION_COMPARATIVE_CREATE },
            { permission: Permissions.QUOTATION_COMPARATIVE_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateQuotationComparativeComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_COMPARATIVE_CREATE },
            { permission: Permissions.QUOTATION_COMPARATIVE_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateQuotationComparativeComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_COMPARATIVE_EDIT },
            { permission: Permissions.QUOTATION_COMPARATIVE_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: QuotationComparativeDetailComponent,
        data: {
          array: [
            { permission: Permissions.QUOTATION_COMPARATIVE_VIEW },
            { permission: Permissions.QUOTATION_COMPARATIVE_CREATE },
            { permission: Permissions.QUOTATION_COMPARATIVE_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      // {
      //   path: CRUD_ROUTES.PRINT,
      //   component: ,
      //   data: {
      //     array: [
      //       { permission: Permissions.QUOTATION_COMPARATIVE_VIEW },
      //       { permission: Permissions.QUOTATION_COMPARATIVE_CREATE },
      //       { permission: Permissions.QUOTATION_COMPARATIVE_EDIT },
      //     ]
      //   },
      //   // canActivate: [PermissionGuard]
      // }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QuotationComparativeRoutingModule { }
