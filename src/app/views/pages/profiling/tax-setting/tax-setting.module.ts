import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxSettingRoutingModule } from './tax-setting-routing.module';
import { CreateTaxSettingComponent } from './create-tax-setting/create-tax-setting.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';




@NgModule({
  declarations: [
    CreateTaxSettingComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,    
    TaxSettingRoutingModule
  ]
})
export class TaxSettingModule { }
