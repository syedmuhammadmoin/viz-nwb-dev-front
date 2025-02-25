import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateIssuanceReturnComponent } from './create-issuance-return/create-issuance-return.component';
import { ListIssuanceReturnComponent } from './list-issuance-return/list-issuance-return.component';
import { IssuanceReturnDetailComponent } from './issuance-return-detail/issuance-return-detail.component';
import { PrintIssuanceReturnComponent } from './print-issuance-return/print-issuance-return.component';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { IssuanceReturnRoutingModule } from './issuance-return-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    CreateIssuanceReturnComponent, 
    ListIssuanceReturnComponent, 
    IssuanceReturnDetailComponent, 
    PrintIssuanceReturnComponent
  ],
  imports: [
    CommonModule,
    PartialsModule,
    SharedModule,
    IssuanceReturnRoutingModule,
    AgGridModule
  ]
})
export class IssuanceReturnModule { }
