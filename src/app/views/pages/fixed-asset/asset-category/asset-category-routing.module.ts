import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListAssetCategoryComponent } from './list-asset-category/list-asset-category.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListAssetCategoryComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.BANKACCOUNT_VIEW },
        //     { permission: Permissions.BANKACCOUNT_CREATE },
        //     { permission: Permissions.BANKACCOUNT_DELETE },
        //     { permission: Permissions.BANKACCOUNT_EDIT },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
      // {
      //   path: CRUD_ROUTES.CREATE,
      //   component: CreateDepreciationComponent,
      //   // data: {
      //   //   array: [
      //   //     { permission: Permissions.BANKACCOUNT_VIEW },
      //   //     { permission: Permissions.BANKACCOUNT_CREATE },
      //   //     { permission: Permissions.BANKACCOUNT_DELETE },
      //   //     { permission: Permissions.BANKACCOUNT_EDIT },
      //   //   ]
      //   // },
      //   // canActivate: [PermissionGuard]
      // }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class AssetCategoryRoutingModule { }
