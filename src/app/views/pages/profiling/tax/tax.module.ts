import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTaxComponent } from './list-tax/list-tax.component';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { TaxRoutingModule } from './tax-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    ListTaxComponent, 
    CreateTaxComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    TaxRoutingModule,
    AgGridModule
  ]
})
export class TaxModule { }
