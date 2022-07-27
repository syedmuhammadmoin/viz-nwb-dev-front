import { NgModule } from '@angular/core';
import { CreateIssuanceComponent } from './create-issuance/create-issuance.component';
import { ListIssuanceComponent } from './list-issuance/list-issuance.component';
import { PrintIssuanceComponent } from './print-issuance/print-issuance.component';
import { IssuanceDetailsComponent } from './issuance-details/issuance-details.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { IssuanceRoutingModule } from './issuance-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';


@NgModule({
  declarations: [
    CreateIssuanceComponent, 
    ListIssuanceComponent, 
    PrintIssuanceComponent, 
    IssuanceDetailsComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    IssuanceRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  entryComponents: [
    CustomRemarksComponent,
    CustomUploadFileComponent
  ]
})
export class IssuanceModule { }
