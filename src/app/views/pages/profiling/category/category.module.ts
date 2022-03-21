import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CategoryService } from './service/category.service';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AccountResolverService } from "src/app/views/shared/resolver/account/account-resolver.service";
import { ListCategoryComponent } from './list-category/list-category.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { CategoryRoutingModule } from './category-routing.module';



@NgModule({
  declarations: [
    CreateCategoryComponent,
    ListCategoryComponent, 
  ],
  imports: [
    SharedModule,
    PartialsModule,
    CategoryRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
  ],
  providers: [ AccountResolverService],
  entryComponents: [CreateCategoryComponent],
})

export class CategoryModule { }
