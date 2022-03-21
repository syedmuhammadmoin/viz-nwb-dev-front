import { Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { IProduct} from '../model/IProduct';
import { RequireMatch as RequireMatch} from 'src/app/views/shared/requireMatch';
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
  styleUrls: ['./create-product.component.scss'],
  providers:[NgxsCustomService]
})

export class CreateProductComponent extends AppComponentBase implements OnInit {

  // for permissions
  public permissions = Permissions;

  //Busy loading
  isLoading: boolean;

  //Product form declaration
  productForm: FormGroup;

  //product model declaration
  product: IProduct;

  // validation messages
  validationMessages = {
    name: {
      required: 'Name is required'
    },
    purchasedOrSold: {
      required: 'purchase or Sold is required'
    },
    productType: {
      required: 'Product Type is required'
    },
    category: {
      required: 'Category is required',
      incorrect: 'Please select valid category'
    },
    salesPrice: {
      required: 'sales Price is required'
    },
    cost: {
      required: 'Cost is required'
    },
    salesTax: {
      required: 'sales Tax is required'
    },
  }

  //error keys
  formErrors = {
    name: '',
    purchasedOrSold: '',
    productType: '',
    category: '',
    salesPrice: '',
    cost: '',
    salesTax: '',
  }

  constructor(
    private fb: FormBuilder,
    public ngxsService:NgxsCustomService,
    public addButtonService:AddModalButtonService,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateProductComponent>, injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      purchasedOrSold: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      category: ['', [RequireMatch, Validators.required]],
      salesPrice: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      salesTax: ['', [Validators.required]],
      barcode: ['']
    });

    // checking router params for edit product
    if (this._id) {
      this.isLoading = true;
      this.getProduct(this._id);
    } else {
      this.product = {
        id: null,
        productName: '',
        purchasedOrSold: '',
        productType: '',
        categoryId: null,
        salesPrice: null,
        cost: null,
        salesTax: null,
        barcode: '',
      }
    }
    //get categoryList from state
      this.ngxsService.getCategoryFromState()
  }

  // Getting product values for update
  getProduct(id: number) {
    this.ngxsService.productService.getProduct(id)
      .subscribe(
        (product: IApiResponse<IProduct>) => {
          this.isLoading = false;
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
      purchasedOrSold: product.purchasedOrSold,
      productType: product.productType,
      category: product.categoryId,
      salesPrice: product.salesPrice,
      cost: product.cost,
      salesTax: product.salesTax,
      barcode: product.barcode
    });

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
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(ProductState, true))
            this.toastService.success('Updated Successfully', 'Product')
            this.onCloseDialog();
          },
          (err) => this.toastService.error('Something went wrong', 'Product')
        );
    } else {
      delete this.product.id;
      this.ngxsService.productService.addProduct(this.product)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(ProductState, true))
            this.toastService.success('Added Successfully', 'Product')
            this.onCloseDialog();
          },
          (err) => this.toastService.error('Something went wrong', 'Product')
        );
    }
  }

  // Mapping value from product form to product model
  mapFormValueToProductModel() {
    this.product.productName = this.productForm.value.name;
    this.product.purchasedOrSold = this.productForm.value.purchasedOrSold;
    this.product.productType = this.productForm.value.productType;
    this.product.categoryId = this.productForm.value.category;
    this.product.salesPrice = this.productForm.value.salesPrice;
    this.product.cost = this.productForm.value.cost;
    this.product.salesTax = this.productForm.value.salesTax;
    this.product.barcode = this.productForm.value.barcode;
  }

  reset() {
    this.formErrors = {
      name: '',
      purchasedOrSold: '',
      productType: '',
      category: '',
      salesPrice: '',
      cost: '',
      salesTax: '',
    }
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
