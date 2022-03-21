import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListOrganizationComponent } from './list-organization/list-organization.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListOrganizationComponent,
        data: {
          array: [
            { permission: Permissions.ORGANIZATION_VIEW },
            { permission: Permissions.ORGANIZATION_CREATE },
            { permission: Permissions.ORGANIZATION_DELETE },
            { permission: Permissions.ORGANIZATION_EDIT },
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
export class OrganizationRoutingModule { }
