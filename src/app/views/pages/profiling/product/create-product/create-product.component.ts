import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { IProduct} from '../model/IProduct';
import { RequireMatch as RequireMatch} from 'src/app/views/shared/requireMatch';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { DepreciationMethod, Permissions } from 'src/app/views/shared/AppEnum';
import { IsReloadRequired } from '../../store/profiling.action';
import { ProductState } from '../store/product.state.state';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { AppConst } from 'src/app/views/shared/AppConst';

@Component({
  selector: 'kt-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
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

  title: string = 'Create Product'

  //show Buttons
  showButtons: boolean = true; 

  //show fixed Asset Fields
  showAssetFields: boolean = false;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  method = AppConst.depreciationMethod;

  // validation messages
  validationMessages = {
    name: {
      required: 'Name is required'
    },
    unit: {
      required: 'Unit is required'
    },
    category: {
      required: 'Category is required',
      incorrect: 'Please select valid category'
    },
    // salesPrice: {
    //   required: 'sales Price is required'
    // },
    // purchasePrice: {
    //   required: 'purchasePrice is required'
    // },
    // salesTax: {
    //   required: 'sales Tax is required'
    // },
  }

  //error keys
  formErrors = {
    name: '',
    unit: '',
    category: '',
    // salesPrice: '',
    // purchasePrice: '',
    // salesTax: '',
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
      unit: [null, [Validators.required]],
      salesPrice: [0],
      purchasePrice: [0],
      salesTax: [0],
      barcode: [''],
      acquisitionDate: [''],
      depreciationModelId: [null],
      depreciableValue: [0],
      salvageValue: [0],
      depreciationMethod: [null],
      usefulLife: [null],
      prorataBasis: [false],
      decliningRate: [null]
    });


    //initialize empty product model
    this.product = {} as IProduct;

    // checking router params for edit product
    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.PRODUCT_EDIT)) ? true : false;
      this.title = 'Edit Product'
      this.isLoading = true;
      this.getProduct(this._id);
    }
    //else {
    //   this.product = {
    //     id: null,
    //     productName: '',
    //     productType: null,
    //     unitOfMeasurementId: null,
    //     categoryId: null,
    //     salesPrice: null,
    //     purchasePrice: null,
    //     salesTax: null,
    //     barcode: '',
    //     acquisitionDate: null,
    //     depreciationModelId: null,
    //     salvageValue: null,
    //     depreciableValue: null,
    //     method: null,
    //     usefulLife: null,
    //     decliningRate: null,
    //     prorataBasis: null
    //   }
    // }
    //get categoryList from state
      this.ngxsService.getCategoryFromState()
      // this.ngxsService.getDepreciationModelFromState();
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
          this.product.id = product.result.id;
          this.editProduct(product.result);
          // this.product = product.result;
        }
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
      barcode: product.barcode,
      acquisitionDate: product.acquisitionDate,
      depreciationModelId: product.depreciationModelId,
      salvageValue: product.salvageValue,
      depreciableValue: product.depreciableValue,
      depreciationMethod: product.method,
      usefulLife: product.usefulLife,
      decliningRate: product.decliningRate,
      prorataBasis: product.prorataBasis
    });

    this.methodChange({source : {} as MatRadioButton , value: product.productType})

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.productForm.disable();
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToProductModel();
    console.log(this.product)
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
            this.toastService.success('Added Successfully', 'Product')
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
    this.product.acquisitionDate = this.dateHelperService.transformDate(this.productForm.value.acquisitionDate , 'yyyy-MM-dd');
    this.product.depreciationModelId = this.productForm.value.depreciationModelId;
    this.product.salvageValue = this.productForm.value.salvageValue;
    this.product.depreciableValue = this.productForm.value.depreciableValue;
    this.product.method = this.productForm.value.depreciationMethod;
    this.product.usefulLife = this.productForm.value.usefulLife;
    this.product.decliningRate = this.productForm.value.decliningRate;
    this.product.prorataBasis = this.productForm.value.prorataBasis;
  }

  reset() {
      this.formDirective.resetForm();
      this.productForm.get('productType').setValue(0);
      this.showAssetFields = false;
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

  methodChange(event : MatRadioChange) {
    if(event.value === 2) {
      this.showAssetFields = true;
    }
    else {
      this.showAssetFields = false;
    }
  }
}
