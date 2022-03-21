import { NgModule } from '@angular/core';
import { CreateBankStatementComponent } from './create-bank-statement/create-bank-statement.component';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { BankStatementService } from './service/bank-statement.service';
import { ListBankStatementComponent } from './list-bank-statement/list-bank-statement.component';
import { BankAccountService } from '../bank-account/service/bankAccount.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { BankStatementRoutingModule } from './bank-statement-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CreateBankStatementComponent,
    ListBankStatementComponent
  ],
  imports: [   
    SharedModule,
    RouterModule,
    PartialsModule,
    BankStatementRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  providers : [
    BankStatementService,
    BankAccountService
  ]
})

export class BankStatementModule { }
