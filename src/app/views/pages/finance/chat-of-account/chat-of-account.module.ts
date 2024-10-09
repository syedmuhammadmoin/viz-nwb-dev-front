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
import { ListChartOfAccountComponent } from './list-chart-of-account/list-chart-of-account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupDropdownCellEditorComponent } from './group-drop-down-cell-editor/group-drop-down-cell-editor.component';

@NgModule({
  declarations: [
    ChatOfAccountComponent,
    CreateLevel3Component,
    CreateLevel4Component,
    ListChartOfAccountComponent,
    GroupDropdownCellEditorComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    PartialsModule,
    ChartOfAccountRoutingModule,
    AgGridModule,
  ],
  providers: [ChartOfAccountService]
})
export class ChatOfAccountModule { }
