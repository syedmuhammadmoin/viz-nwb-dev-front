import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingAsideComponent } from './setting-aside-menu/setting-aside.component';
import { AppSettingComponent } from './app-setting.component';

const routes: Routes = [
  {
    path: '',
    component: AppSettingComponent,
    children: [
      { path: '', redirectTo: 'accounting', pathMatch: 'full' },
      {path: 'accounting',loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule)},
      {path: 'general-setting', loadChildren: () => import('./general-setting/general-setting.module').then(m => m.GeneralSettingModule)}
      // { path: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsettingRoutingModule { }
