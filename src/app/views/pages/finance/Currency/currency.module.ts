import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { CurrencyListComponent } from './Component/currency-list/currency-list.component';
import { CreateCurrencyComponent } from './Component/create-currency/create-currency.component';
import { CurrencyRoutingModule } from './currency-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CurrencyListComponent,
    CreateCurrencyComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    
    PartialsModule,
    NgSelectModule,
    NgbNavModule,
    CurrencyRoutingModule,
    AgGridModule
  ]
})
export class CurrencyModule { }
