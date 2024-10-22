import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListOrganizationComponent } from './list-organization/list-organization.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';

const routes: Routes = [
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
            { permission: Permissions.ORGANIZATION_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateOrganizationComponent,
        data: {
          array: [
            { permission: Permissions.ORGANIZATION_CREATE },
            { permission: Permissions.ORGANIZATION_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateOrganizationComponent,
        data: {
          array: [
            { permission: Permissions.ORGANIZATION_EDIT },
            { permission: Permissions.ORGANIZATION_VIEW },
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
export class OrganizationRoutingModule { }
