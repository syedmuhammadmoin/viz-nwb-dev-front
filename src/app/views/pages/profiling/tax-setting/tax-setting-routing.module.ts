import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTaxSettingComponent } from './create-tax-setting/create-tax-setting.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from 'src/app/views/shared/AppEnum';

const routes: Routes = [
  {
    path: '',
    component : CreateTaxSettingComponent,
    children: [   
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateTaxSettingComponent,
        data: {
          array: [
            { permission: Permissions.TAXES_SETTING_CREATE },
            { permission: Permissions.TAXES_SETTING_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },             
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxSettingRoutingModule { }
