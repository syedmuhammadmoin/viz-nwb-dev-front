import { CreateCategoryComponent } from 'src/app/views/pages/profiling/category/create-category/create-category.component';
import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/views/shared/modules/shared.module';
import {PartialsModule} from 'src/app/views/partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';
import { ListProductComponent } from './list-product/list-product.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductRoutingModule } from './product-routing.module'


@NgModule({
  declarations: [
   CreateProductComponent,
   ListProductComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    ProductRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ], 
  entryComponents: [CreateProductComponent, ]
})
export class ProductModule { }
