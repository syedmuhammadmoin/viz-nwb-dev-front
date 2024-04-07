import { NgModule } from '@angular/core';
import { CreateRequestRequisitionComponent } from './create-request-requisition/create-request-requisition.component';
import { ListRequestRequisitionComponent } from './list-request-requisition/list-request-requisition.component';
import { PrintRequestRequisitionComponent } from './print-request-requisition/print-request-requisition.component';
import { RequestRequisitionDetailsComponent } from './request-requisition-details/request-requisition-details.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { RequestRequisitionRoutingModule } from './request-requisition-routing.module';


@NgModule({
  declarations: [
    CreateRequestRequisitionComponent, 
    ListRequestRequisitionComponent, 
    PrintRequestRequisitionComponent, 
    RequestRequisitionDetailsComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    RequestRequisitionRoutingModule,
    AgGridModule
  ]
})

export class RequestRequisitionModule { }
