import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { CreateJournalComponent } from './create-journal/create-journal.component';
import { JournalDetailsComponent} from './journal-details/journal-details.component';
import { PrintJournalComponent } from './print-journal/print-journal.component';
import { JournalRoutingModule } from './journal-routing.module';


@NgModule({
  declarations: [
    ListJournalComponent,
    CreateJournalComponent,
    JournalDetailsComponent,
    PrintJournalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    JournalRoutingModule,
    AgGridModule
  ]
})
export class JournalModule { }
