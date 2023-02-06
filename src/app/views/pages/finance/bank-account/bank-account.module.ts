import { NgModule} from '@angular/core';
import { SharedModule} from 'src/app/views/shared/modules/shared.module';
import { RouterModule} from '@angular/router';
import { PartialsModule} from 'src/app/views/partials/partials.module';
import { ListBankAccountComponent} from './list-bank-account/list-bank-account.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateBankAccountComponent } from './create-bank-account/create-bank-account.component';
import { BankAccountRoutingModule } from './bank-account-routing.module';

@NgModule({
  declarations: [
    ListBankAccountComponent,
    CreateBankAccountComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    PartialsModule,
    BankAccountRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
  ],
  entryComponents: [CreateBankAccountComponent]
})
export class BankAccountModule { }
