import { NgModule} from '@angular/core';
import { AgGridModule} from 'ag-grid-angular';
import { PartialsModule} from 'src/app/views/partials/partials.module';
import { SharedModule} from 'src/app/views/shared/modules/shared.module';
import { ListCashAccountComponent} from './list-cash-account/list-cash-account.component';
import { CreateCashAccountComponent } from './create-cash-account/create-cash-account.component';
import { CashAccountRoutingModule } from './cash-account-routing.module';


@NgModule({
  declarations: [
    CreateCashAccountComponent,
    ListCashAccountComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    CashAccountRoutingModule,   
    AgGridModule
  ]
})

export class CashAccountModule { }
