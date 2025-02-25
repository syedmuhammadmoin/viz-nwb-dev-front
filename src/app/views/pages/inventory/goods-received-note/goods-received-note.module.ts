import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { ListGrnComponent } from './list-grn/list-grn.component';
import { GrnDetailComponent } from './grn-detail/grn-detail.component';
import { PrintGrnComponent } from './print-grn/print-grn.component';
import { GoodsReceivedNoteRoutingModule } from './goods-received-note-routing.module';
import { CreateGrnComponent } from './create-grn/create-grn.component';

@NgModule({
  declarations: [
    ListGrnComponent,
    GrnDetailComponent,
    PrintGrnComponent,
    CreateGrnComponent
  ],
  imports: [
    CommonModule,
    PartialsModule,
    SharedModule,
    GoodsReceivedNoteRoutingModule,
    AgGridModule
  ]
})
export class GoodsReceivedNoteModule { }
