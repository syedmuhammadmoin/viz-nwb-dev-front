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
import { ICwip } from '../model/ICwip';
import { CwipService } from '../service/cwip.service';
import { ASSET, CWIP } from 'src/app/views/shared/AppRoutes';
import { AppConst } from 'src/app/views/shared/AppConst';
import { AssetType } from 'src/app/views/shared/AppEnum';
import { DepreciationMethodService } from '../../depreciation-model/service/depreciation-method.service';

@Component({
  selector: 'kt-create-cwip',
  templateUrl: './create-cwip.component.html',
  styleUrls: ['./create-cwip.component.scss']
})
export class CreateCwipComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  cwipForm: FormGroup;

  //disable percentage
  disablePercentage: boolean

  //selected Employees to assign
  selectedEmployees: any[] = []

  acquisitionDates: any

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Payroll Model
  cwipModel: ICwip = {} as ICwip;

  title: string = 'Create CWIP'

  isActiveChecked = true;

  depApplicabilityToggle = false;
  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

  isModelType =  false;

  //show Buttons
  showButtons: boolean = true;

  //depreciation method
  method = AppConst.depreciationMethod;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {

    dateOfAcquisition : {
      required: 'Acquisition Date is required.',
    },
    cwipAccountId : {
      required: 'Account is required.',
    },                        
    costOfAsset : {
      required: 'Cost is required.',
    },
    assetAccountId : {
      required: 'Account is required.',
    },
    depreciationId : {
      required: 'Depreciation Model is required.',
    },
    modelType : {
      required: 'Model Type is required.',
    },
    depreciationExpenseId : {
      required: 'Account is required.',
    },
    accumulatedDepreciationId : {
      required: 'Account is required.',
    },
    useFullLife : {
      required: 'Useful life is required.',
    },
    decLiningRate : {
      required: 'Declining Rate is required.',
    }
  };

  // error keys..
  formErrors = {
    dateOfAcquisition : '',
    cwipAccountId : '',                        
    costOfAsset : '',
    assetAccountId : '',
    depreciationId : '',
    modelType : '',
    depreciationExpenseId : '',
    accumulatedDepreciationId : '',
    useFullLife : '',
    decLiningRate : ''
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private cwipService: CwipService,
    public activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateCwipComponent>,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
    private depreciationService: DepreciationMethodService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.cwipForm = this.fb.group({

      dateOfAcquisition: ['', [Validators.required]],
      cwipAccountId: ['', [Validators.required]],
      costOfAsset: ['', [Validators.required]],
      assetAccountId: ['', [Validators.required]],
      salvageValue: [''],
      depreciationApplicability: [''],
      depreciationId: ['', [Validators.required]],
      modelType: ['', [Validators.required]],
      depreciationExpenseId: ['', [Validators.required]],
      accumulatedDepreciationId: ['', [Validators.required]],
      useFullLife: ['', [Validators.required]],
      quantinty: [''],
      decLiningRate: ['', [Validators.required]],
      prorataBasis: [false],
      active: [false]
    });

    console.log(this.data)




    //get Accounts from Accounts State
    // this.ngxsService.getAccountLevel4FromState();
    // this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getDepreciationModelFromState()
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    // this.ngxsService.getOtherAccountsFromState();
    // this.ngxsService.getCategoryFromState();

    //getting product data for asset
    // if(this.data.productData) {
    //   //this.isLoading = true;
    //   // this.showButtons = (this.permission.isGranted(this.permissions.PAYROLL_ITEM_EDIT)) ? true : false;
    //    this.title = 'Create Asset'
    //    this.patchAsset(this.data.productData);
    // } 
    // else if (this.data.assetData) {
    //   this.title = 'Edit Asset'
    //   this.cwipModel.id = this.data.assetData.id;
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
    //  this.cwipForm.get('depreciationModelId').valueChanges.subscribe((value: number) => {
    //     this.updateValueValidators(value);
    //   })
  }

  // updateValueValidators(value: number) {
  //   if(value === 0) {
  //     this.valueTitle = 'Value (%) '
  //     this.cwipForm.get('value').setValidators([Validators.required, Validators.min(0) , Validators.max(100)])
  //     this.cwipForm.get('value').updateValueAndValidity();
  //   }
  //   else if (value === 1) {
  //     this.valueTitle = 'Value'
  //     this.cwipForm.get('value').setValidators([Validators.required])
  //     this.cwipForm.get('value').updateValueAndValidity();
  //   }
  //   this.logValidationErrors(this.cwipForm, this.formErrors , this.validationMessages)
  // }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.depApplicabilityToggle = false
    //this.cwipForm.get('depreciationModelId').setValue(1)
    //this.cwipForm.get('isActive').setValue(true);
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
  private getCwip(id: number) {
    this.cwipService.getCwipById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.cwipModel = res.result;
        this.patchCwip(res.result);
      });
  }

  //Edit Asset Method
  public patchCwip(cwip: ICwip | any) {
    this.cwipForm.patchValue({
      dateOfAcquisition: cwip.dateofAcquisition,
      cwipAccountId:cwip.cwipAccountId,
      costOfAsset:cwip.costOfAsset,
      assetAccountId:cwip.assetAccountId,
      salvageValue:cwip.salvageValue,
      depreciationApplicability:cwip.depreciationApplicability,
      depreciationId:cwip.depreciationId,
      modelType:cwip.modelType,
      depreciationExpenseId:cwip.depreciationExpenseId,
      accumulatedDepreciationId:cwip.accumulatedDepreciationId,
      useFullLife:cwip.usefulLife,
      quantinty:cwip.quantinty,
      decLiningRate:cwip.decLiningRate,
      prorataBasis: cwip.prorataBasis,
      active:cwip.active 
    });

    // this.onToggle({checked: asset.isActive})
    // this.onacquisitionDateChange()
    //if(!this.showButtons) this.cwipForm.disable();
    // //Clearing Amount Validator Initially
    // this.cwipForm.get('amount').setErrors(null)
    // this.cwipForm.updateValueAndValidity();
  }


  //Submit Form Function
  onSubmit(): void {
    console.log(this.cwipForm.value)

    if (this.cwipForm.invalid) {
      //this.toastService.error("Please fill all required fields!", "Asset")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesTocwipModel();
    console.log(this.cwipModel)
    if (this.data.cwipData) {
      console.log("edit")
      this.cwipService.updateCwip(this.cwipModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<ICwip>) => {
          this.toastService.success('Updated Successfully', 'Asset')
          this.onCloseDialog();
          this.cdRef.detectChanges();
          this.router.navigate(['/' + CWIP.LIST])
        })

    } else {
      delete this.cwipModel.id;
      console.log("create")
      this.cwipService.createCwip(this.cwipModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<ICwip>) => {
          this.toastService.success('Created Successfully', 'CWIP')
          this.onCloseDialog();
          this.router.navigate(['/' + CWIP.LIST])
          //this.router.navigate(['/' + PAYROLL_ITEM.LIST])
        }
        );
    }
  }

  onChangeDepApplicability(e){
    this.depApplicabilityToggle = e.checked

    if(e){
      this.cwipForm.get('depreciationId').setValidators([Validators.required])
      this.cwipForm.get('depreciationId').updateValueAndValidity();
      this.cwipForm.get('modelType').setValidators([Validators.required])
      this.cwipForm.get('modelType').updateValueAndValidity();
      this.cwipForm.get('assetAccountId').setValidators([Validators.required])
      this.cwipForm.get('assetAccountId').updateValueAndValidity();
      this.cwipForm.get('depreciationExpenseId').setValidators([Validators.required])
      this.cwipForm.get('depreciationExpenseId').updateValueAndValidity();
      this.cwipForm.get('accumulatedDepreciationId').setValidators([Validators.required])
      this.cwipForm.get('accumulatedDepreciationId').updateValueAndValidity();
      this.cwipForm.get('useFullLife').setValidators([Validators.required])
      this.cwipForm.get('useFullLife').updateValueAndValidity();

    }else{
      this.cwipForm.get('depreciationId').clearValidators()
      this.cwipForm.get('depreciationId').updateValueAndValidity();
      this.cwipForm.get('modelType').clearValidators()
      this.cwipForm.get('modelType').updateValueAndValidity();
      this.cwipForm.get('assetAccountId').clearValidators()
      this.cwipForm.get('assetAccountId').updateValueAndValidity();
      this.cwipForm.get('depreciationExpenseId').clearValidators()
      this.cwipForm.get('depreciationExpenseId').updateValueAndValidity();
      this.cwipForm.get('accumulatedDepreciationId').clearValidators()
      this.cwipForm.get('accumulatedDepreciationId').updateValueAndValidity();
      this.cwipForm.get('useFullLife').clearValidators()
      this.cwipForm.get('useFullLife').updateValueAndValidity();
    }

    this.logValidationErrors(this.cwipForm, this.formErrors , this.validationMessages)
    // getModelType(e)
    

  }

  getModelType(e){

    if(e){
      this.isModelType = true;
      this.cwipForm.get('decLiningRate').setValidators([Validators.required])
      this.cwipForm.get('decLiningRate').updateValueAndValidity();
    }else{
      this.isModelType = false;
      this.cwipForm.get('decLiningRate').clearValidators()
      this.cwipForm.get('decLiningRate').updateValueAndValidity();
    }

    this.logValidationErrors(this.cwipForm, this.formErrors , this.validationMessages) 

  }



  // onacquisitionDateChange() {
  //   if (this.cwipForm.value.acquisitionDate === 0 || this.cwipForm.value.acquisitionDate === 1) {
  //     this.cwipForm.get('depreciationModelId').setValue(1);
  //     this.disablePercentage = true;
  //   } else {
  //     this.disablePercentage = false;
  //   }
  // }

  //Mapping Form Value to Model
  mapFormValuesTocwipModel() {

    this.cwipModel.dateOfAcquisition =  this.dateHelperService.transformDate(this.cwipForm.value.acquisitionDate, 'yyyy-MM-dd');
    this.cwipModel.cwipAccountId = this.cwipForm.value.cwipAccountId
    this.cwipModel.costOfAsset = this.cwipForm.value.costOfAsset
    this.cwipModel.assetAccountId = this.cwipForm.value.assetAccountId,
    this.cwipModel.salvageValue = this.cwipForm.value.salvageValue,
    this.cwipModel.depreciationApplicability = this.cwipForm.value.depreciationApplicability,
    this.cwipModel.depreciationId = this.cwipForm.value.depreciationId,
    this.cwipModel.modelType = this.cwipForm.value.modelType,
    this.cwipModel.depreciationExpenseId = this.cwipForm.value.depreciationExpenseId,
    this.cwipModel.accumulatedDepreciationId = this.cwipForm.value.accumulatedDepreciationId,
    this.cwipModel.useFullLife = this.cwipForm.value.usefulLife,
    this.cwipModel.quantinty = this.cwipForm.value.quantinty,
    this.cwipModel.decLiningRate = this.cwipForm.value.decLiningRate,
    this.cwipModel.prorataBasis =  this.cwipForm.value.prorataBasis,
    this.cwipModel.active = this.cwipForm.value.active 
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
  //   this.cwipModel.isSubmit = (val === 0) ? false : true;
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
        this.cwipForm.patchValue({
          modelType: res.result.modelType,
          useFullLife: res.result.useFullLife,
          decLiningRate: res.result.decliningRate,
          depreciationExpenseId: res.result.depreciationExpenseId,
          accumulatedDepreciationId: res.result.accumulatedDepreciationId,

        })

        this.cdRef.detectChanges()
      })
  }

  calculateDepValue() {
    // const purchasePrice = this.cwipForm.get('purchasePrice').value
    // const salvageValue = this.cwipForm.get('salvageValue').value
    // this.cwipForm.get('depreciableValue').setValue(purchasePrice - salvageValue)
  }


  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}







