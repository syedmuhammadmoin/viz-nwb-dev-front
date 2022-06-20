import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-management/user-list/user-list.component';
import { CreateUserComponent } from './user-management/create-user/create-user.component';
import { RoleListComponent } from './role-management/role-list/role-list.component';
import { CreateRoleComponent } from './role-management/create-role/create-role.component';
import { ChangePasswordComponent } from './user-management/change-password/change-password.component';
import { ACCESS_MANAGEMENT } from '../../shared/AppRoutes';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from '../../shared/AppEnum';



const routes: Routes = [
  {
      path: '',
      children: [
          {
              path: ACCESS_MANAGEMENT.USER_LIST,
              component: UserListComponent,
              data: {
                array: [
                  { permission: Permissions.AUTH_VIEW },
                  { permission: Permissions.AUTH_CREATE },
                  { permission: Permissions.AUTH_EDIT },
                  { permission: Permissions.AUTH_DELETE }
                ]
              },
              canActivate: [PermissionGuard]
          },
          {
              path: ACCESS_MANAGEMENT.CREATE_USER,
              component: CreateUserComponent
          },
          {
            path: ACCESS_MANAGEMENT.CHANGE_PASSWORD,
            component: ChangePasswordComponent
          },
          {
              path: ACCESS_MANAGEMENT.ROLE_LIST,
              component: RoleListComponent,
              data: {
                array: [
                  { permission: Permissions.AUTH_VIEW },
                  { permission: Permissions.AUTH_CREATE },
                  { permission: Permissions.AUTH_EDIT },
                  { permission: Permissions.AUTH_DELETE }
                ]
              },
              canActivate: [PermissionGuard]
          },
          {
              path: ACCESS_MANAGEMENT.CREATE_ROLE,
              component: CreateRoleComponent
          }
      ]
  }
]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessManagementRoutingModule { }
