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
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';


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
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  entryComponents: [
    CustomRemarksComponent,
   //CustomUploadFileComponent
  ]
})
export class IssuanceReturnModule { }
