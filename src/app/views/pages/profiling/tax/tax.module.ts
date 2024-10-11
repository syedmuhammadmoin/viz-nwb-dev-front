import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTaxComponent } from './list-tax/list-tax.component';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { TaxRoutingModule } from './tax-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectTaxListComponent } from './select-tax-list/select-tax-list.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    ListTaxComponent, 
    CreateTaxComponent,
    SelectTaxListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    
    SharedModule,
    PartialsModule,
    TaxRoutingModule, 
    NgbNavModule,
    MatTabsModule,
    AgGridModule
  ]
})
export class TaxModule { }
