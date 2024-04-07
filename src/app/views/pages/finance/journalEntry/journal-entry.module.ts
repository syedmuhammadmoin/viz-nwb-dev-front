import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListJournalEntryComponent } from './list-journal-entry/list-journal-entry.component';
import { CreateJournalEntryComponent } from './create-journal-entry/create-journal-entry.component';
import { JouralEntryDetailsComponent} from './joural-entry-details/joural-entry-details.component';
import { PrintJournalEntryComponent } from './print-journal-entry/print-journal-entry.component';
import { JournalEntryRoutingModule } from './journal-entry-routing.module';


@NgModule({
  declarations: [
    ListJournalEntryComponent,
    CreateJournalEntryComponent,
    JouralEntryDetailsComponent,
    PrintJournalEntryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    JournalEntryRoutingModule,
    AgGridModule
  ]
})
export class JournalEntryModule { }
