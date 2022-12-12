import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoleComponent } from './role-management/create-role/create-role.component';
import { RoleListComponent } from './role-management/role-list/role-list.component';
import { CreateUserComponent } from './user-management/create-user/create-user.component';
import { UserListComponent } from './user-management/user-list/user-list.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { PartialsModule } from '../../partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from '../../shared/components/custom-tooltip/custom-tooltip.component';
import { AccessManagementRoutingModule } from './access-management-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChangePasswordComponent } from './user-management/change-password/change-password.component';
import { ResetPasswordComponent } from './user-management/reset-password/reset-password.component';
import { UserAccessLevelComponent } from './role-management/user-access-level/user-access-level.component';
import { PrintRolePermissionsComponent } from './role-management/print-role-permissions/print-role-permissions.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
    AccessManagementRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    CreateRoleComponent,
    RoleListComponent,
    CreateUserComponent,
    UserListComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    UserAccessLevelComponent,
    PrintRolePermissionsComponent
  ],
  entryComponents: [ResetPasswordComponent]
})
export class AccessManagementModule { }
