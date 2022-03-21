import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListLocationComponent } from './list-location/list-location.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListLocationComponent,
        data: {
          array: [
            { permission: Permissions.LOCATION_VIEW },
            { permission: Permissions.LOCATION_CREATE },
            { permission: Permissions.LOCATION_DELETE },
            { permission: Permissions.LOCATION_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
