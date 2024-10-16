import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingComponent } from './accounting.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';


const routes : Routes = [
  {path : '', component : AccountingComponent}
]
@NgModule({
  declarations: [
    AccountingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountingModule { }
