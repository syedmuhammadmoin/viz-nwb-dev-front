import { NgModule } from '@angular/core';
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { ListAssetComponent } from './list-asset/list-asset.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AssetRoutingModule } from './asset-routing.module';


@NgModule({
  declarations: [CreateAssetComponent, ListAssetComponent],
  imports: [
    SharedModule,
    PartialsModule,
    AssetRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class AssetModule { }
