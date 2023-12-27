import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreatePettyCashComponent } from './create-petty-cash/create-petty-cash.component';
import { ListPettyCashComponent } from './list-petty-cash/list-petty-cash.component';
import { PettyCashDetailsComponent } from './petty-cash-details/petty-cash-details.component';
import { PettyCashRoutingModule } from './petty-cash-routing.module';
import { PrintPettyCashComponent } from './print-petty-cash/print-petty-cash.component';




@NgModule({
  declarations: [
    ListPettyCashComponent,
    CreatePettyCashComponent,
    PettyCashDetailsComponent,
    PrintPettyCashComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    PettyCashRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class PettyCashModule { }
