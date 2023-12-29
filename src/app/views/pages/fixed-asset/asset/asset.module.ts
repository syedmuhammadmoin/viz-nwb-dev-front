import { NgModule } from '@angular/core';
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { ListAssetComponent } from './list-asset/list-asset.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AssetRoutingModule } from './asset-routing.module';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { PrintAssetComponent } from './print-asset/print-asset.component';
import { ScheduleDepreciationComponent } from './schedule-depreciation/schedule-depreciation.component';
import { ActivationDetailComponent } from './activation-detail/activation-detail.component';


@NgModule({
  declarations: [
    CreateAssetComponent,
    ListAssetComponent,
    AssetDetailComponent,
    PrintAssetComponent,
    ScheduleDepreciationComponent,
    ActivationDetailComponent
  ],
    
  imports: [
    SharedModule,
    PartialsModule,
    AssetRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  entryComponents : [CreateAssetComponent, ScheduleDepreciationComponent]
})
export class AssetModule { }
