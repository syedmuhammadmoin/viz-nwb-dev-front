import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRequisitionComponent } from './create-requisition/create-requisition.component';
import { ListRequisitionComponent } from './list-requisition/list-requisition.component';
import { PrintRequisitionComponent } from './print-requisition/print-requisition.component';
import { RequisitionDetailsComponent } from './requisition-details/requisition-details.component';



@NgModule({
  declarations: [CreateRequisitionComponent, ListRequisitionComponent, PrintRequisitionComponent, RequisitionDetailsComponent],
  imports: [
    CommonModule
  ]
})
export class RequisitionModule { }
