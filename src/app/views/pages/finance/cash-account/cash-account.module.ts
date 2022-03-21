import { NgModule} from '@angular/core';
import { AgGridModule} from 'ag-grid-angular';
import { PartialsModule} from 'src/app/views/partials/partials.module';
import { SharedModule} from 'src/app/views/shared/modules/shared.module';
import { ListCashAccountComponent} from './list-cash-account/list-cash-account.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateCashAccountComponent } from './create-cash-account/create-cash-account.component';
import { CashAccountRoutingModule } from './cash-account-routing.module';
import { CashAccountService } from './service/cashAccount.service';


@NgModule({
  declarations: [
    CreateCashAccountComponent,
    ListCashAccountComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    CashAccountRoutingModule,   
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  providers: [],
  entryComponents: [CreateCashAccountComponent],
})

export class CashAccountModule { }
