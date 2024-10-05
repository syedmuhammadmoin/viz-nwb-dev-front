import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxGroupRoutingModule } from './tax-group-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListTaxGroupComponent } from './list-tax-group/list-tax-group.component';
import { CreateTaxGroupComponent } from './create-tax-group/create-tax-group.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    ListTaxGroupComponent,
    CreateTaxGroupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AgGridModule, 
    TaxGroupRoutingModule
  ]
})
export class TaxGroupModule { }
