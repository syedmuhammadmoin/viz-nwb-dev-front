import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListAssetCategoryComponent } from './list-asset-category/list-asset-category.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListAssetCategoryComponent,
        data: {
          array: [
            { permission: Permissions.ASSET_CATEGORY_VIEW },
            { permission: Permissions.ASSET_CATEGORY_CREATE },
            { permission: Permissions.ASSET_CATEGORY_DELETE },
            { permission: Permissions.ASSET_CATEGORY_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
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
