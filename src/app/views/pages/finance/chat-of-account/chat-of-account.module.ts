import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatOfAccountComponent } from './chat-of-account.component';
import { CreateLevel3Component } from './level3/create-level3/create-level3.component';
import { CreateLevel4Component } from './level4/create-level4/create-level4.component';
import { ChartOfAccountService } from './service/chart-of-account.service';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule} from 'ag-grid-angular';
import { ChartOfAccountRoutingModule } from './chart-of-account-routing.module';
import 'ag-grid-enterprise';

@NgModule({
  declarations: [
    ChatOfAccountComponent,
    CreateLevel3Component,
    CreateLevel4Component,
  ],
  imports: [
    SharedModule,
    CommonModule,
    PartialsModule,
    ChartOfAccountRoutingModule,
    AgGridModule
  ],
  providers: [ChartOfAccountService]
})
export class ChatOfAccountModule { }
