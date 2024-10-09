import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBankAccountComponent } from 'src/app/views/pages/finance/bank-account/create-bank-account/create-bank-account.component';
import { CreateBusinessPartnerComponent } from 'src/app/views/pages/profiling/business-partner/create-business-partner/create-business-partner.component';
import { CreateCategoryComponent } from 'src/app/views/pages/profiling/category/create-category/create-category.component';
import { CreateProductComponent } from 'src/app/views/pages/profiling/product/create-product/create-product.component';
import { CreateTaxGroupComponent } from 'src/app/views/pages/profiling/tax-group/create-tax-group/create-tax-group.component';
import { ListTaxGroupComponent } from 'src/app/views/pages/profiling/tax-group/list-tax-group/list-tax-group.component';
import { CreateUnitOfMeasurementComponent } from 'src/app/views/pages/profiling/unit-of-measurement/create-unit-of-measurement/create-unit-of-measurement.component';
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
      width: '800px',
    });
   }
  
   //Create Category
   openCategoryDialog() {
    this.dialog.open(CreateCategoryComponent, {
      width: '800px',
    })
   }
  openTaxGroupListDialog(){
    this.dialog.open(ListTaxGroupComponent,{
      width: '1205px',
      height : '230px'
    })
  }
   //Create Business Partner
   openBusinessPartnerDialog() {
    this.dialog.open(CreateBusinessPartnerComponent, {
      width: '800px',
    });
   }

   //Create Product
   openProductDialog() {
    this.dialog.open(CreateProductComponent, {
      width: '800px',
    });
   }

   //Create Unit of Measurement
   openUnitOfMeasurementDialog() {
    this.dialog.open(CreateUnitOfMeasurementComponent, {
      width: '500px',
    });
   }

   //Create Bank Account
   openBankAccountDialog() {
    this.dialog.open(CreateBankAccountComponent, {
      width: '800px',
    });
   }
}
