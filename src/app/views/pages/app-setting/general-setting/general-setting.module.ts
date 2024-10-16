import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralSettingRoutingModule } from './general-setting-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { GeneralSettingComponent } from './general-setting.component';


@NgModule({
  declarations: [
    GeneralSettingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GeneralSettingRoutingModule
  ]
})
export class GeneralSettingModule { }
