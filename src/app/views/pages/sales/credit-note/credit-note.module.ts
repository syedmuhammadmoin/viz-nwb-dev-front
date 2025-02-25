import { NgModule } from '@angular/core';
import { CreateCreditNoteComponent } from './create-credit-note/create-credit-note.component';
import { ListCreditNoteComponent } from './list-credit-note/list-credit-note.component';
import { CreditNoteDetailComponent } from './credit-note-detail/credit-note-detail.component';
import { PrintCreditNoteComponent } from './print-credit-note/print-credit-note.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { CreditNoteRoutingModule } from './credit-note-routing.module';


@NgModule({
  declarations: [
    CreateCreditNoteComponent,
    ListCreditNoteComponent,
    CreditNoteDetailComponent,
    PrintCreditNoteComponent
  ],
 
  imports: [
    SharedModule,
    PartialsModule,
    CreditNoteRoutingModule,
    AgGridModule
  ]
})
export class CreditNoteModule { }

