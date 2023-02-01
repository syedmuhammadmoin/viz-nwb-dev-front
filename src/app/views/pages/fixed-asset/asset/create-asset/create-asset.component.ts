import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, Inject, Optional, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { FirstDataRenderedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAsset } from '../model/IAsset';
import { AssetService } from '../service/asset.service';
import { ASSET } from 'src/app/views/shared/AppRoutes';
import { AppConst } from 'src/app/views/shared/AppConst';
import { AssetType } from 'src/app/views/shared/AppEnum';
import { DepreciationMethodService } from '../../depreciation-model/service/depreciation-method.service';

@Component({
  selector: 'kt-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.scss']
})
export class CreateAssetComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  assetForm: FormGroup;

  //disable percentage
  disablePercentage: boolean

  //selected Employees to assign
  selectedEmployees: any[] = []

  acquisitionDates: any

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Payroll Model
  assetModel: IAsset;

  title: string = 'Create Asset'

  isActiveChecked = true;

  depApplicabilityToggle =  false;


  modelType =  false;

  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

  //show Buttons
  showButtons: boolean = true; 

  //depreciation method
  method = AppConst.depreciationMethod;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    dateofAcquisition: {
      required: 'Date is required.',
    },
    name: {
      required: 'Name is required.',
    },
    purchaseCost: {
      required: 'Purchase Price is required.',
    },
    categoryId: {
      required: 'Category is required.',
    },
    depreciationId: {
      required: 'Depreciation Ac is required.',
    },
    modelType: {
      required: 'Method is required.',
    },
    assetAccountId: {
      required: 'Asset A/C is required.',
    },
    depreciationExpenseId: {
      required: 'Depreciation Exp A/C is required.',
    },
    accumulatedDepreciationId: {
      required: 'Accumulated Dep A/C is required.',
    },
    useFullLife: {
      required: 'UseFull Life is required.',
    },
    decLiningRate: {
      required: 'Declining Factor is required.',
    },
  };

  // error keys..
  formErrors = {

      dateofAcquisition:'',
      name: '',
      purchaseCost: '',
      categoryId:'',
      depreciationId:'',
      modelType: '',
      assetAccountId:'',
      depreciationExpenseId:'',
      accumulatedDepreciationId: '',
      useFullLife:'',
      decLiningRate:''
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private assetService: AssetService,
    public activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateAssetComponent>,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
    private depreciationService: DepreciationMethodService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.assetForm = this.fb.group({

      dateofAcquisition:['', [Validators.required]],
      name: ['', [Validators.required]],
      purchaseCost: ['', [Validators.required]],
      categoryId:['', [Validators.required]],
      salvageValue:[0],
      depreciationApplicability: [false],
      depreciationId:[null],
      modelType: [0],
      assetAccountId: [null],
      depreciationExpenseId:[null],
      accumulatedDepreciationId: [null],
      useFullLife:[0],
      decLiningRate: [0],
      prorataBasis: [false],
      active: [false]
    });

    this.assetModel = {

    id: null,
    dateofAcquisition:'',
    name: '',
    purchaseCost: null,
    categoryId:null,
    salvageValue:null,
    depreciationApplicability: false,
    depreciationId:null,
    modelType: '',
    assetAccountId: '',
    depreciationExpenseId: '',
    accumulatedDepreciationId: '',
    useFullLife:null,
    decLiningRate: null,
    prorataBasis: true,
    active: false
    }

    console.log(this.data)
    this.onChangeDepApplicability(this.assetForm.value.depreciationApplicability)

    
    

    //get Accounts from Accounts State
    // this.ngxsService.getAccountLevel4FromState();
    // this.ngxsService.getAssetAccountFromState();
    // this.ngxsService.getDepreciationModelFromState()
   // this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getCategoryFromState();
    this.ngxsService.getDepreciationModelFromState();
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getCategoryAssetFromState();

    //getting product data for asset
    // if(this.data.productData) {
    //   //this.isLoading = true;
    //   // this.showButtons = (this.permission.isGranted(this.permissions.PAYROLL_ITEM_EDIT)) ? true : false;
    //    this.title = 'Create Asset'
    //    this.patchAsset(this.data.productData);
    // } 
    // else if (this.data.assetData) {
    //   this.title = 'Edit Asset'
    //   this.assetModel.id = this.data.assetData.id;
    //   this.patchAsset(this.data.assetData);
    // }
    
    // this.activatedRoute.params.subscribe((param) => {
    //   console.log(param)
    //   const id = param.id;
     
    //   if (id) {
    //     this.isLoading = true;
    //    // this.showButtons = (this.permission.isGranted(this.permissions.PAYROLL_ITEM_EDIT)) ? true : false;
    //     this.title = 'Edit Asset'
    //     this.getAsset(id);
    //   }
    // });

     //update FornControl 'Value' Validator on checkbox changed
    //  this.assetForm.get('depreciationModelId').valueChanges.subscribe((value: number) => {
    //     this.updateValueValidators(value);
    //   })
  }

  // updateValueValidators(value: number) {
  //   if(value === 0) {
  //     this.valueTitle = 'Value (%) '
  //     this.assetForm.get('value').setValidators([Validators.required, Validators.min(0) , Validators.max(100)])
  //     this.assetForm.get('value').updateValueAndValidity();
  //   }
  //   else if (value === 1) {
  //     this.valueTitle = 'Value'
  //     this.assetForm.get('value').setValidators([Validators.required])
  //     this.assetForm.get('value').updateValueAndValidity();
  //   }
  //   this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages)
  // }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.depApplicabilityToggle = false;
    //this.assetForm.get('depreciationModelId').setValue(1)
    //this.assetForm.get('isActive').setValue(true);
    //this.onToggle({checked: true})
    // const invoiceLineArray = this.invoiceForm.get('invoiceLines') as FormArray;
    // invoiceLineArray.clear();
    // this.table.renderRows();
  }

  // // OnItemSelected
  // onItemSelected(itemId: number, index: number) {
  //   let arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
  //   if (itemId) {
  //     let price = this.salesItem.find(i => i.id === itemId).salesPrice
  //     let tax = this.salesItem.find(i => i.id === itemId).salesTax
  //     // set values for price & tax
  //     arrayControl.at(index).get('price').setValue(price);
  //     arrayControl.at(index).get('tax').setValue(tax);
  //     // Calculating subtotal
  //     let quantity = arrayControl.at(index).get('quantity').value;
  //     let subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
  //     arrayControl.at(index).get('subTotal').setValue(subTotal);
  //   }
  // }

  // // onChangeEvent for calculating subtotal
  // onChangeEvent(value: unknown, index: number, element?: HTMLElement) {

  //   const arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
  //   const price = (arrayControl.at(index).get('price').value) !== null ? arrayControl.at(index).get('price').value : null;
  //   const tax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
  //   const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

  //   //calculating subTotal
  //   const subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
  //   arrayControl.at(index).get('subTotal').setValue(subTotal);
  //   this.totalCalculation();
  // }




  //Get Asset data from Api
  private getAsset(id: number) {
    this.assetService.getAssetById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.assetModel = res.result;
      this.patchAsset(res.result);
    });
  }

  //Edit Asset Method
  public patchAsset(asset: IAsset | any) {
    console.log(asset.depreciationExpenseId)
    console.log(asset.accumulatedDepreciationId)
    this.assetForm.patchValue({
      dateofAcquisition:asset.acquisitionDate,
      name: asset.name ?? asset.productName,
      purchaseCost: asset.purchasePrice,
      categoryId:asset.categoryId,
      salvageValue: asset.salvageValue,
      depreciationApplicability: asset.depreciationApplicability,
      depreciationId:asset.depreciationId,
      modelType: asset.modelType,
      assetAccountId: asset.assetAccountId,
      depreciationExpenseId: asset.depreciationExpenseId,
      accumulatedDepreciationId: asset.accumulatedDepreciationId,
      useFullLife:asset.useFullLife,
      decLiningRate: asset.decLiningRate,
      prorataBasis: asset.prorataBasis,
      active: asset.active
    });
   
    // this.onToggle({checked: asset.isActive})
    // this.onacquisitionDateChange()
    //if(!this.showButtons) this.assetForm.disable();
    // //Clearing Amount Validator Initially
    // this.assetForm.get('amount').setErrors(null)
    // this.assetForm.updateValueAndValidity();
  }


  //Submit Form Function
  onSubmit(): void {
    console.log(this.assetForm.value)
   
    if (this.assetForm.invalid) {
      console.log(this.assetForm)
      //this.toastService.error("Please fill all required fields!", "Asset")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToAssetModel();
    console.log(this.assetModel)
    if (this.data?.assetData) {
      console.log("edit")
      this.assetService.updateAsset(this.assetModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IAsset>) => {
          this.toastService.success('Updated Successfully', 'Asset')
          this.onCloseDialog();
          this.cdRef.detectChanges();
          this.router.navigate(['/' + ASSET.LIST])
        })

    } else {
      delete this.assetModel.id;
      console.log("create")
      this.assetService.createAsset(this.assetModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IAsset>) => {

            this.toastService.success('Created Successfully', 'Asset')
            this.onCloseDialog();
            this.router.navigate(['/' + ASSET.LIST])
            //this.router.navigate(['/' + PAYROLL_ITEM.LIST])
          }
        );
    }
  }

  onChangeDepApplicability(e){
    this.depApplicabilityToggle = e.checked

    if(e){
      this.assetForm.get('depreciationId').setValidators([Validators.required])
      this.assetForm.get('depreciationId').updateValueAndValidity();
      this.assetForm.get('assetAccountId').setValidators([Validators.required])
      this.assetForm.get('assetAccountId').updateValueAndValidity();
      this.assetForm.get('depreciationExpenseId').setValidators([Validators.required])
      this.assetForm.get('depreciationExpenseId').updateValueAndValidity();
      this.assetForm.get('accumulatedDepreciationId').setValidators([Validators.required])
      this.assetForm.get('accumulatedDepreciationId').updateValueAndValidity();
      this.assetForm.get('useFullLife').setValidators([Validators.required])
      this.assetForm.get('useFullLife').updateValueAndValidity();

    }else{
      this.assetForm.get('depreciationId').clearValidators()
      this.assetForm.get('depreciationId').updateValueAndValidity();
      this.assetForm.get('assetAccountId').clearValidators()
      this.assetForm.get('assetAccountId').updateValueAndValidity();
      this.assetForm.get('depreciationExpenseId').clearValidators()
      this.assetForm.get('depreciationExpenseId').updateValueAndValidity();
      this.assetForm.get('accumulatedDepreciationId').clearValidators()
      this.assetForm.get('accumulatedDepreciationId').updateValueAndValidity();
      this.assetForm.get('useFullLife').clearValidators()
      this.assetForm.get('useFullLife').updateValueAndValidity();


    }

    this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages)
    // getModelType(e)
    

  }

  getModelType(e){

    if(e){
      this.modelType = true;
      this.assetForm.get('decLiningRate').setValidators([Validators.required])
      this.assetForm.get('decLiningRate').updateValueAndValidity();
    }else{
      this.modelType = false;
      this.assetForm.get('decLiningRate').clearValidators()
      this.assetForm.get('decLiningRate').updateValueAndValidity();
    }

    this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages) 

  }

  

  // onacquisitionDateChange() {
  //   if (this.assetForm.value.acquisitionDate === 0 || this.assetForm.value.acquisitionDate === 1) {
  //     this.assetForm.get('depreciationModelId').setValue(1);
  //     this.disablePercentage = true;
  //   } else {
  //     this.disablePercentage = false;
  //   }
  // }

  //Mapping Form Value to Model
  mapFormValuesToAssetModel() {

    this.assetModel.dateofAcquisition = this.dateHelperService.transformDate(this.assetForm.value.dateofAcquisition , 'yyyy-MM-dd'),
    this.assetModel.name = this.assetForm.value.name,
    this.assetModel.purchaseCost =  this.assetForm.value.purchaseCost,
    this.assetModel.categoryId = this.assetForm.value.categoryId,
    this.assetModel.salvageValue = this.assetForm.value.salvageValue,
    this.assetModel.depreciationApplicability =  this.assetForm.value.depreciationApplicability,
    this.assetModel.depreciationId = this.assetForm.value.depreciationId,
    this.assetModel.modelType = this.assetForm.value.modelType,
    this.assetModel.assetAccountId = this.assetForm.value.assetAccountId,
    this.assetModel.depreciationExpenseId =  this.assetForm.value.depreciationExpenseId,
    this.assetModel.accumulatedDepreciationId = this.assetForm.value.accumulatedDepreciationId,
    this.assetModel.useFullLife = this.assetForm.value.useFullLife,
    this.assetModel.decLiningRate =  this.assetForm.value.decLiningRate,
    this.assetModel.prorataBasis =  this.assetForm.value.prorataBasis,
    this.assetModel.active =  this.assetForm.value.active

    
  }

  // onToggle(event) {
  //   if (event.checked) {
  //     this.userStatus = 'Active'
  //   } else {
  //     this.userStatus = 'Inactive'
  //   }
  // }

  //for save or submit
  // isSubmit(val: number) {
  //   this.assetModel.isSubmit = (val === 0) ? false : true;
  // }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    //this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  getDepreciationModel(id: number) {
    this.depreciationService.getDepreciationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.assetForm.patchValue({
        modelType: res.result.modelType,
        useFullLife: res.result.useFullLife,
        decLiningRate: res.result.decliningRate,
        depreciationExpenseId : res.result.depreciationExpenseId,
        accumulatedDepreciationId : res.result.accumulatedDepreciationId,
        assetAccountId : res.result.assetAccountId
      })
      this.getModelType(res.result.modelType)
      this.cdRef.detectChanges()
    })
    
  }

  calculateDepValue() {
    const purchaseCost = this.assetForm.get('purchaseCost').value
    const salvageValue = this.assetForm.get('salvageValue').value
    this.assetForm.get('depreciableValue').setValue(purchaseCost - salvageValue)
  }
  

   // Dialogue close function
   onCloseDialog() {
    this.dialogRef.close();
  }
}






