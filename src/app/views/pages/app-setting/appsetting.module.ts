import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsettingRoutingModule } from './appsetting-routing.module';
import { SettingAsideComponent } from './setting-aside-menu/setting-aside.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { AppSettingComponent } from './app-setting.component';


@NgModule({
  declarations: [
    SettingAsideComponent,
    AppSettingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppsettingRoutingModule,
  ]
})
export class AppsettingModule { }
