import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDisposalComponent } from './list-disposal/list-disposal.component';
import { CreateDisposalComponent } from './create-disposal/create-disposal.component';
import { PrintDisposalComponent } from './print-disposal/print-disposal.component';
import { DisposalDetailsComponent } from './disposal-details/disposal-details.component';



@NgModule({
  declarations: [ListDisposalComponent, CreateDisposalComponent, PrintDisposalComponent, DisposalDetailsComponent],
  imports: [
    CommonModule
  ]
})
export class DisposalModule { }
