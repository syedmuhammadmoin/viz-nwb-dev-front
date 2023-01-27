import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListAssetComponent } from './list-asset/list-asset.component';
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListAssetComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.ASSET_VIEW },
        //     { permission: Permissions.ASSET_CREATE },
        //     { permission: Permissions.ASSET_EDIT },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateAssetComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.ASSET_VIEW },
        //     { permission: Permissions.ASSET_CREATE }
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: AssetDetailComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.ASSET_VIEW },
        //     { permission: Permissions.ASSET_CREATE },
        //     { permission: Permissions.ASSET_EDIT },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class AssetRoutingModule { }
