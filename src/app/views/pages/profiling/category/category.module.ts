import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListCategoryComponent } from './list-category/list-category.component';
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
    AgGridModule
  ]
})

export class CategoryModule { }
