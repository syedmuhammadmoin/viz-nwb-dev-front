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
import { AssetType, DocType } from 'src/app/views/shared/AppEnum';
import { DepreciationMethodService } from '../../depreciation-model/service/depreciation-method.service';
import {IGRN} from '../../../inventory/goods-received-note/model/IGRN';
import {IGRNLines} from '../../../inventory/goods-received-note/model/IGRNLines';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { DisposalDropdownState } from '../store/disposal-dropdown.state';

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


  isModelType =  false;

  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

  // per product cost
  perProductCost : number;

  //show Buttons
  showButtons: boolean = true;

  //show hide quantity button
  isQuantity: boolean = false;

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
    cost: {
      required: 'Cost is required.',
      min: 'Minimum value is 0.',
    },
    quantity: {
      required: 'Quantinty is required.',
      min : 'Minimum value is 1.',
      max : 'Maximum value is 1000.',
    },
    productId: {
      required: 'Product is required.',
    },
    warehouseId: {
      required: 'Store is required.',
    },
    depreciationModelId: {
      required: 'Depreciation Model is required.',
    },
    modelType: {
      required: 'Method is required.',
    },
    assetAccountId: {
      required: 'Account is required.',
    },
    depreciationExpenseId: {
      required: 'Account is required.',
    },
    accumulatedDepreciationId: {
      required: 'Account is required.',
    },
    useFullLife: {
      required: 'Life is required.',
      min : 'Minimum value is 1.',
      max : 'Value is out of range.',
      pattern : 'Please enter only Digits.'
    },
    decLiningRate: {
      required: 'Declining Rate is required.',
    },
  };

  // error keys..
  formErrors = {

      dateofAcquisition:'',
      name: '',
      cost: '',
      quantity: '',
      productId:'',
      warehouseId:'',
      depreciationModelId:'',
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
      cost: ['', [Validators.required , Validators.min(0)]],
      quantity: [''],
      productId:['', [Validators.required]],
      salvageValue:[0],
      warehouseId:['' , [Validators.required]],
      depreciationApplicability: [false],
      depreciationModelId:[null],
      modelType: [0],
      assetAccountId: [null],
      depreciationExpenseId:[null],
      accumulatedDepreciationId: [null],
      useFullLife:[0],
      decLiningRate: [0],
      prorataBasis: [false],
      isActive: [false]
    });



    this.assetModel = {

    id : null,
    dateofAcquisition:'',
    name: '',
    cost: null,
    productId:null,
    warehouseId:null,
    salvageValue:null,
    depreciationApplicability: false,
    depreciationModelId:null,
    useFullLife:null,
    assetAccountId: '',
    depreciationExpenseId: '',
    accumulatedDepreciationId: '',
    modelType: '',
    decLiningRate: null,
    prorataBasis: false,
    isActive: false,
    docId: null,
    doctype: null,
    quantity : null,
    isSubmit: false,

    }

    console.log(this.data)
    this.onChangeDepApplicability(this.assetForm.value.depreciationApplicability)
    this.assetForm.get('quantity').setValidators([Validators.required , Validators.min(1) , Validators.max(1000)])
    this.isQuantity = true



    //get Accounts from Accounts State

    this.ngxsService.getCategoryFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getDepreciationModelFromState();
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getCategoryAssetFromState();
    this.ngxsService.getWarehouseFromState();

    // getting product data for asset

    // if(this.data.productData) {
    //   this.isLoading = true;
    //   // this.showButtons = (this.permission.isGranted(this.permissions.PAYROLL_ITEM_EDIT)) ? true : false;
    //    this.title = 'Create Asset'
    //    this.patchAsset(this.data.productData);


    // }

    if (this.data?.grnData) {
      this.patchGrnData(this.data?.grnData, this.data?.grnLine);
    }

    if (this.data?.id) {
      this.title = 'Edit Asset'
      this.assetModel.id = this.data.id;
      this.isLoading = true;
      this.getAsset(this.data.id);
      this.isQuantity = false;
      this.assetForm.get('quantity').clearValidators();
      this.assetForm.get('quantity').updateValueAndValidity();
      this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages);
    }

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
    this.isModelType = false;
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
      this.depApplicabilityToggle = res.result.depreciationApplicability;
      console.log(res.result)
    });

  }

  //Edit Asset Method
  public patchAsset(asset: IAsset | any) {
    this.assetForm.patchValue({
      dateofAcquisition:asset.dateofAcquisition,
      name: asset.name,
      cost: asset.cost,
      quantity: asset.quantity,
      productId:asset.productId,
      salvageValue: asset.salvageValue,
      warehouseId: asset.warehouseId,
      depreciationApplicability: asset.depreciationApplicability,
      depreciationModelId:asset.depreciationModelId,
      modelType: asset.modelType,
      assetAccountId: asset.assetAccountId,
      depreciationExpenseId: asset.depreciationExpenseId,
      accumulatedDepreciationId: asset.accumulatedDepreciationId,
      useFullLife:asset.useFullLife,
      decLiningRate: asset.decLiningRate,
      prorataBasis: asset.prorataBasis,
      isActive: asset.isActive

    });

    this.getModelType(asset.modelType)
    this.onChangeDepApplicability({checked : asset.depreciationApplicability})


// accumulatedDepreciation: null
// accumulatedDepreciationId: "00000000-0000-0000-0000-000000000000"
// active: false
// assetAccount: null
// assetAccountId: "00000000-0000-0000-0000-000000000000"
// assetCode: "FXA-007"
// categoryId: 5
// categoryName: "Category 5"
// dateofAcquisition: "2023-02-02T00:00:00"
// decLiningRate: 0
// depreciation: null
// depreciationApplicability: false
// depreciationExpense: null
// depreciationExpenseId: "00000000-0000-0000-0000-000000000000"
// depreciationId: 0
// id: 7
// modelType: 0
// name: "Asset 6"
// prorataBasis: false
// purchaseCost: 6000
// salvageValue: 12
// useFullLife: 0

    // this.onToggle({checked: asset.isActive})
    // this.onacquisitionDateChange()
    //if(!this.showButtons) this.assetForm.disable();
    // //Clearing Amount Validator Initially
    // this.assetForm.get('amount').setErrors(null)
    // this.assetForm.updateValueAndValidity();
  }


  //Submit Form Function
  onSubmit(): void {
    console.log(this.assetForm)
    if (this.assetForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.enableControls();
    this.mapFormValuesToAssetModel();
    if (this.data?.id) {
      // this.onChangeDepApplicability(this.data.assetData.depreciationApplicability)
      this.assetService.updateAsset(this.assetModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IAsset>) => {
          this.ngxsService.store.dispatch(new IsReloadRequired (DisposalDropdownState , true))
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
          this.ngxsService.store.dispatch(new IsReloadRequired (DisposalDropdownState , true))
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

    if(e.checked){
      this.assetForm.get('useFullLife').setValidators([Validators.required , Validators.min(1) , Validators.max(2147483647) , Validators.pattern('[0-9]*$')])
    }
    if(!e.checked){
      this.resetFields(this.assetForm , 'depreciationModelId','depreciationExpenseId', 'accumulatedDepreciationId' , 'assetAccountId', 'useFullLife' , 'decLiningRate')
      this.assetForm.get('prorataBasis').setValue(false);
      this.assetForm.get('isActive').setValue(false);
      this.assetForm.get('modelType').setValue(0);
      this.getModelType(0)
      this.assetForm.get('useFullLife').clearValidators();
      this.assetForm.get('useFullLife').updateValueAndValidity();
    }
    this.conditionalValidation(this.assetForm, e.checked , ['depreciationModelId','depreciationExpenseId', 'accumulatedDepreciationId','assetAccountId'])
    this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages);

  }

  getModelType(e){
    console.log(e)
    if(e){
      console.log(e + 'true')
      this.isModelType = true;
    }else{
      console.log(e + 'false')
      this.isModelType = false;
      this.assetForm.get('decLiningRate').setValue(0)
    }

    this.conditionalValidation(this.assetForm, e , ['decLiningRate'])
    this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages)

  }


  // onChangeDepApplicability(e){
  //   this.depApplicabilityToggle = e.checked
  //   if(!e.checked){
  //     this.resetFields(this.assetForm , 'depreciationId','assetAccountId','depreciationExpenseId', 'accumulatedDepreciationId' , 'useFullLife' , 'prorataBasis','active', 'decLiningRate')
  //   }
  //   this.conditionalValidation(this.assetForm, e.checked , ['depreciationId','assetAccountId','depreciationExpenseId', 'accumulatedDepreciationId' , 'useFullLife'])
  //   this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages)
  // }

  // getModelType(e){
  //   console.log(e)
  //   if(e){this.modelType = true;}
  //   else{this.modelType = false;}

  //   this.conditionalValidation(this.assetForm, e , ['decLiningRate'])
  //   this.logValidationErrors(this.assetForm, this.formErrors , this.validationMessages)

  // }



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
    this.assetModel.cost =  this.assetForm.value.cost,
    this.assetModel.quantity =  this.assetForm.value.quantity,
    this.assetModel.productId = this.assetForm.value.productId,
    this.assetModel.salvageValue = (this.assetForm.value.salvageValue) ? this.assetForm.value.salvageValue : 0,
    this.assetModel.warehouseId = this.assetForm.value.warehouseId,
    this.assetModel.depreciationApplicability =  this.assetForm.value.depreciationApplicability,
    this.assetModel.depreciationModelId = this.assetForm.value.depreciationModelId,
    this.assetModel.modelType = this.assetForm.value.modelType,
    this.assetModel.assetAccountId = this.assetForm.value.assetAccountId,
    this.assetModel.depreciationExpenseId =  this.assetForm.value.depreciationExpenseId,
    this.assetModel.accumulatedDepreciationId = this.assetForm.value.accumulatedDepreciationId,
    this.assetModel.useFullLife = this.assetForm.value.useFullLife,
    this.assetModel.decLiningRate =  this.assetForm.value.decLiningRate,
    this.assetModel.prorataBasis =  this.assetForm.value.prorataBasis,
    this.assetModel.isActive =  this.assetForm.value.isActive


  }

  // onToggle(event) {
  //   if (event.checked) {
  //     this.userStatus = 'Active'
  //   } else {
  //     this.userStatus = 'Inactive'
  //   }
  // }

  //for save or submit
  isSubmit(val: number) {
    this.assetModel.isSubmit = (val === 0) ? false : true;
  }

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
    // const purchaseCost = this.assetForm.get('purchaseCost').value
    // const salvageValue = this.assetForm.get('salvageValue').value
    // this.assetForm.get('depreciableValue').setValue(purchaseCost - salvageValue)
  }

  // calculateCost(event){

  //   const purchaseCost = this.assetForm.get('purchaseCost').value
  //   // const quantinty = this.assetForm.get('quantinty').value
  //   console.log(purchaseCost)
  //   console.log(event)
  // }


   // Dialogue close function
   onCloseDialog() {
    this.dialogRef.close();
  }

  private patchGrnData(grnData: IGRN, grnLine: any) {
    this.assetForm.patchValue({
      dateofAcquisition: grnData.grnDate,
      name: grnLine.item ,
      cost: grnLine.cost,
      quantity: grnLine.quantity,
      productId: grnLine.itemId,
      warehouseId: grnLine.warehouseId,
      depreciationApplicability: true,
    })

    this.onChangeDepApplicability({checked: true});

    this.assetForm.get('dateofAcquisition').disable();
    this.assetForm.get('name').disable();
    this.assetForm.get('cost').disable();
    this.assetForm.get('quantity').disable();
    this.assetForm.get('productId').disable();
    this.assetForm.get('warehouseId').disable();
    this.assetForm.get('depreciationApplicability').disable();

    this.assetModel.docId = grnData.id
    this.assetModel.doctype = DocType.GRN
    this.cdRef.detectChanges()
  }

  private enableControls() {
    this.assetForm.get('dateofAcquisition').enable();
    this.assetForm.get('name').enable();
    this.assetForm.get('cost').enable();
    this.assetForm.get('quantity').enable();
    this.assetForm.get('productId').enable();
    this.assetForm.get('warehouseId').enable();
    this.assetForm.get('depreciationApplicability').enable();
  }

  getCost(e){
    
    if((this.assetForm.get('cost').value)  && (this.assetForm.get('quantity').value)){
      this.perProductCost = (this.assetForm.get('cost').value) / (this.assetForm.get('quantity').value)
      console.log(this.perProductCost);
      
    }
  }
}






