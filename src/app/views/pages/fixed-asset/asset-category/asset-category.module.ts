import { NgModule } from '@angular/core';
import { CreateAssetCategoryComponent } from './create-asset-category/create-asset-category.component';
import { ListAssetCategoryComponent } from './list-asset-category/list-asset-category.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AssetCategoryRoutingModule } from './asset-category-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';



@NgModule({
  declarations: [
    CreateAssetCategoryComponent, 
    ListAssetCategoryComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    AssetCategoryRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  entryComponents: [CreateAssetCategoryComponent]
})
export class AssetCategoryModule { }
