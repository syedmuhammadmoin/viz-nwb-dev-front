import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { CreateBusinessPartnerComponent } from 'src/app/views/pages/profiling/business-partner/create-business-partner/create-business-partner.component';
import { BusinessPartnerService } from 'src/app/views/pages/profiling/business-partner/service/businessPartner.service';
import { CreateCategoryComponent } from 'src/app/views/pages/profiling/category/create-category/create-category.component';
import { CategoryService } from 'src/app/views/pages/profiling/category/service/category.service';
import { CreateLocationComponent } from 'src/app/views/pages/profiling/location/create-location/create-location.component';
import { LocationService } from 'src/app/views/pages/profiling/location/service/location.service';
import { CreateOrganizationComponent } from 'src/app/views/pages/profiling/organization/create-organization/create-organization.component';
import { OrganizationService } from 'src/app/views/pages/profiling/organization/services/organization.service';
import { CreateProductComponent } from 'src/app/views/pages/profiling/product/create-product/create-product.component';
import { ProductService } from 'src/app/views/pages/profiling/product/service/product.service';
import { CreateWarehouseComponent } from 'src/app/views/pages/profiling/warehouse/create-warehouse/create-warehouse.component';
import { WarehouseService } from 'src/app/views/pages/profiling/warehouse/services/warehouse.service';
@Injectable({
  providedIn: 'root'
})
export class AddModalButtonService {
  // for orgnization list
  orgnizationList = new BehaviorSubject([]);
  // for business partner list
  partnerList = new BehaviorSubject([]);
  // for departments list
  departmentList= new BehaviorSubject([]);
  // for warehouses list
  warehouseList=new BehaviorSubject([]);
   // for warehouses list
   locationList=new BehaviorSubject([]);
  // for warehouse location list
  warehouseLocationList=new BehaviorSubject([]);
  // for categories list
  categoryList=new BehaviorSubject([]);
  // for product (item) list
  productList=new BehaviorSubject([]);
  dialog: MatDialog;
  constructor(
   private orgnizationService :OrganizationService,
   private partnerService  :BusinessPartnerService,
   private warehouseService :WarehouseService,
   private locationService :LocationService,
   private categoryService :CategoryService,
   private productService : ProductService,
   private injector: Injector
    )
    {  this.dialog = injector.get(MatDialog);}

   // create Orgnization Form
   openOrgnizationDialog() {
    const dialogRef = this.dialog.open(CreateOrganizationComponent, {
      width: '740px',
    });
      dialogRef.afterClosed().subscribe(() => {
      this.getOrgnizationTypes();
    })
  }
  getOrgnizationTypes() {
    this.orgnizationService.getOrganizationsDropdown().subscribe((res) => {
     //console.log(res);
      this.orgnizationList.next(res.result);
    })
  }

   // create warehouse Form
   openWarehouseDialog() {
    const dialogRef = this.dialog.open(CreateWarehouseComponent, {
      width: '740px',
    });
      dialogRef.afterClosed().subscribe(() => {
      this.getWarehouseTypes();
    })
  }
  getWarehouseTypes() {
    this.warehouseService.getWarehousesDropdown().subscribe((res) => {
      //console.log(res);
      this.warehouseList.next(res.result);
    })
  }

  
   // create category Form
   openCategoryDialog() {
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      width: '740px',
    });
      dialogRef.afterClosed().subscribe(() => {
      this.getCategoryTypes();
    })
  }
  getCategoryTypes() {
    this.categoryService.getCategoriesDropdown().subscribe((res) => {
      //console.log(res);
      this.categoryList.next(res.result);
    })
  }

  
   // create business partner Form
   openBuinessPartnerDialog() {
    const dialogRef = this.dialog.open(CreateBusinessPartnerComponent, {
      width: '740px',
    });
      dialogRef.afterClosed().subscribe(() => {
      this.getBusinessPartnerTypes();
    })
  }
  getBusinessPartnerTypes() {
    this.partnerService.getBusinessPartnersDropdown().subscribe((res) => {
      //console.log(res);
      this.partnerList.next(res.result);
    })
  }
   // create warehouse location Form
   openLocationDialog() {
    const dialogRef = this.dialog.open(CreateLocationComponent, {
      width: '740px',
    });
      dialogRef.afterClosed().subscribe(() => {
      this.getLocationTypes();
      this.getLocationList();
    })
  }
  getLocationTypes() {
    this.warehouseService.getWarehousesDropdown().subscribe((res) => {
     // console.log(res);
      this.warehouseLocationList.next(res.result);
    })
  }
  getLocationList() {
    this.locationService.getLocationsDropdown().subscribe((res) => {
      //console.log(res);
      this.locationList.next(res.result);
    })
  }
   // create product (item) Form
   openProductDialog() {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '740px',
    });
      dialogRef.afterClosed().subscribe(() => {
      this.getProductTypes();
    })
  }
  getProductTypes() {
    this.productService.getProductsDropdown().subscribe((res) => {
      //console.log(res);
      this.productList.next(res.result);
    })
  }
}
