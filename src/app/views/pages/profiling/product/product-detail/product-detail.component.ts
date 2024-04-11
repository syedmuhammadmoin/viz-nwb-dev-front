import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ProductService } from '../service/product.service';
import { IProduct } from '../model/IProduct';
import { CreateAssetComponent } from '../../../fixed-asset/asset/create-asset/create-asset.component';
import { CreateProductComponent } from '../create-product/create-product.component';


@Component({
  selector: 'kt-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent extends AppComponentBase implements OnInit  {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  productMaster: IProduct | any

  //For ag grid
  gridOptions: any;
  defaultColDef: ColDef;

  //Loader
  isLoading: boolean;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.getProductData(id);
        this.cdRef.markForCheck();
      }
    });
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Product Master data
  getProductData(id: number) {
    this.productService.getProduct(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IProduct>) => {
      this.productMaster = res.result;
      this.cdRef.detectChanges();
    });
  }

  addAsset(isWIP: boolean): void {
    const dialogRef = this.dialog.open(CreateAssetComponent, {
      width: '800px',
      data:  {
        productData: this.productMaster,
        wip: isWIP
      }
    });
    //Recalling getAsset function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.cdRef.detectChanges();
    });
  }

  editProduct(): void {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '800px',
      data: this.productMaster.id
    });
    // Recalling getProducts function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getProductData(this.productMaster.id)
      this.cdRef.detectChanges();
    });
  }
}





  

