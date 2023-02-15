import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { IProduct} from '../model/IProduct';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IsReloadRequired } from '../../store/profiling.action';
import { ProductState } from '../store/product.state.state';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})

export class CreateProductComponent extends AppComponentBase implements OnInit {

  // for permissions
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  //Product form declaration
  productForm: FormGroup;

  //product model declaration
  product: IProduct = {} as IProduct;

  title: string = 'Create Product'

  //show Buttons
  showButtons: boolean = true; 


  //show Buttons
  isFixedAsset: boolean = false; 



  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Product Name is required.'
    },
    unit: {
      required: 'Unit is required.',
    },
    category: {
      required: 'Category is required.',
    },
    salesPrice: {
      min: 'Please insert correct value.',
    },
    purchasePrice: {
      min: 'Please insert correct value.',
    },
    salesTax: {
      min: 'Percentage % range (0 - 100).',
      max: 'Percentage % range (0 - 100).'
    }
  }

  //error keys
  formErrors = {
    name: '',
    unit: '',    
    category: '',
    salesPrice: '',
    purchasePrice: '',
    salesTax: '',
  }

  constructor(
    private fb: FormBuilder,
    public ngxsService:NgxsCustomService,
    public addButtonService:AddModalButtonService,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    private cdRef : ChangeDetectorRef,
    public dialogRef: MatDialogRef<CreateProductComponent>, injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      productType: [0, [Validators.required]],
      category: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      salesPrice: [0 , [Validators.min(0)]],
      purchasePrice: [0 , [Validators.min(0)]],
      salesTax: [0 , [Validators.min(0), Validators.max(100)]],
      barcode: ['']
    });

    
    

    // checking router params for edit product
    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.PRODUCT_EDIT)) ? true : false;
      this.title = 'Edit Product'
      this.isLoading = true;
      this.getProduct(this._id);
    } 

      //Get Data From Store
      this.ngxsService.getCategoryFromState()
      this.ngxsService.getUnitsFromState()
  }

  // Getting product values for update
  getProduct(id: number) {
    this.ngxsService.productService.getProduct(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (product: IApiResponse<IProduct>) => {
          this.editProduct(product.result);
          this.product = product.result;
        },
        (err) => console.log(err)
      );
  }

  // Patching values to product form
  editProduct(product: IProduct) {
    this.productForm.patchValue({
      id: product.id,
      name: product.productName,
      productType: product.productType,
      category: product.categoryId,
      salesPrice: product.salesPrice,
      unit: product.unitOfMeasurementId,
      purchasePrice: product.purchasePrice,
      salesTax: product.salesTax,
      barcode: product.barcode
    });

    this.onItemSelected(product.categoryId)
    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.productForm.disable();
    }
  }

  onItemSelected(e){
    console.log(e);
    this.ngxsService.categories$.subscribe(res => {
      this.isFixedAsset = res.find(x => e === x.id)?.isFixedAsset;
    })
    // this.isFixedAsset = e.isFixedAsset;
    if(this.isFixedAsset){
      this.productForm.get('productType').setValue(2);
    }
    else{
      this.productForm.get('productType').setValue(0);
    }


  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToProductModel();
    if (this.product.id) {
      this.ngxsService.productService.updateProduct(this.product)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(ProductState, true))
            this.toastService.success('Updated Successfully', 'Product')
            this.onCloseDialog();
          }
        )
    } else {
      delete this.product.id;
      this.ngxsService.productService.addProduct(this.product)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(ProductState, true))
            this.toastService.success('Created Successfully', 'Product')
            this.onCloseDialog();
          }
        );
    }
  }

  

  // Mapping value from product form to product model
  mapFormValueToProductModel() {
    this.product.productName = this.productForm.value.name;
    this.product.productType = this.productForm.value.productType;
    this.product.categoryId = this.productForm.value.category;
    this.product.unitOfMeasurementId = this.productForm.value.unit;
    this.product.salesPrice = (this.productForm.value.salesPrice) ? this.productForm.value.salesPrice : 0;
    this.product.purchasePrice = (this.productForm.value.purchasePrice) ? this.productForm.value.purchasePrice : 0 ;
    this.product.salesTax = (this.productForm.value.salesTax) ?  this.productForm.value.salesTax : 0;
    this.product.barcode = this.productForm.value.barcode;
  }

  reset() {
      this.formDirective.resetForm();
      this.productForm.get('productType').setValue(0);
      this.isFixedAsset = false;
  }

  //create new category
  openCategoryDialog() {
    if (this.permission.isGranted(this.permissions.CATEGORIES_CREATE)) {
      this.addButtonService.openCategoryDialog();
    }
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
