import { NgModule } from '@angular/core';
import { CreateRequisitionComponent } from './create-requisition/create-requisition.component';
import { ListRequisitionComponent } from './list-requisition/list-requisition.component';
import { PrintRequisitionComponent } from './print-requisition/print-requisition.component';
import { RequisitionDetailsComponent } from './requisition-details/requisition-details.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { RequisitionRoutingModule } from './requisition-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    CreateRequisitionComponent, 
    ListRequisitionComponent, 
    PrintRequisitionComponent, 
    RequisitionDetailsComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    RequisitionRoutingModule,
    AgGridModule
  ]
})
export class RequisitionModule { }
