import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBusinessPartnerComponent } from 'src/app/views/pages/profiling/business-partner/create-business-partner/create-business-partner.component';
import { CreateCategoryComponent } from 'src/app/views/pages/profiling/category/create-category/create-category.component';
import { CreateProductComponent } from 'src/app/views/pages/profiling/product/create-product/create-product.component';
import { CreateWarehouseComponent } from 'src/app/views/pages/profiling/warehouse/create-warehouse/create-warehouse.component';

@Injectable({
  providedIn: 'root'
})
export class AddModalButtonService {
  
  dialog: MatDialog; 

  constructor( injector: Injector ) {  this.dialog = injector.get(MatDialog);}

   //Create Warehouse
   openWarehouseDialog() {
    this.dialog.open(CreateWarehouseComponent, {
      width: '740px',
    });
   }
  
   //Create Category
   openCategoryDialog() {
    this.dialog.open(CreateCategoryComponent, {
      width: '740px',
    })
   }
  
   //Create Business Partner
   openBusinessPartnerDialog() {
    this.dialog.open(CreateBusinessPartnerComponent, {
      width: '740px',
    });
   }

   //Create Product
   openProductDialog() {
    this.dialog.open(CreateProductComponent, {
      width: '740px',
    });
   }
}
