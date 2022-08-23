import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { FirstDataRenderedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { IAsset } from '../model/IAsset';
import { AssetService } from '../service/asset.service';

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
  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

   //show Buttons
   showButtons: boolean = true; 

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    name: {
      required: 'Name is required.',
    },
    acquisitionDate: {
      required: 'Date is required.',
    },
    depreciationId: {
      required: 'Model is required.',
    },
    purchaseCost: {
      required: 'Cost is required.',
    },
    salvageValue: {
      required: 'Value is required.',
    },
    depreciableValue: {
      required: 'Value is required.',
    },
    depreciationMethod: {
      required: 'Method is required.',
    },
    usefulLife: {
      required: 'Life is required.',
    }
  };

  // error keys..
  formErrors = {
    name: '',
    acquisitionDate: '',
    depreciationId: '',
    depreciableValue: '',
    salvageValue: '',
    depreciationMethod: '',
    purchaseCost: '',
    usefulLife: ''
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private assetService: AssetService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
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
      name: ['', [Validators.required]],
      acquisitionDate: ['', [Validators.required]],
      depreciationId: ['', [Validators.required]],
      purchaseCost: ['', [Validators.required]],
      depreciableValue: ['', [Validators.required]],
      salvageValue: ['', [Validators.required]],
      depreciationMethod: ['', [Validators.required]],
      usefulLife: ['', [Validators.required]],
      prorataBasis: [false]
    });

    this.assetModel = {
      id: null,
      name: '',
      acquisitionDate: '',
      depreciationId: null,
      purchaseCost: null,
      salvageValue: null,
      depValue: null,
      depMethod: '',
      usefulLife: null,
      prorataBasis: false,
    }

    //get Accounts from Accounts State
    //this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getOtherAccountsFromState();
    
    this.activatedRoute.params.subscribe((param) => {
      console.log(param)
      const id = param.id;
     
      if (id) {
        this.isLoading = true;
       // this.showButtons = (this.permission.isGranted(this.permissions.PAYROLL_ITEM_EDIT)) ? true : false;
        this.title = 'Edit Asset'
        this.getAsset(id);
      }
    });

     //update FornControl 'Value' Validator on checkbox changed
    //  this.assetForm.get('depreciationId').valueChanges.subscribe((value: number) => {
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
    this.assetForm.get('depreciationId').setValue(1)
    this.assetForm.get('isActive').setValue(true);
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
  public patchAsset(asset: IAsset) {
    this.assetForm.patchValue({
      name: asset.name,
      acquisitionDate: asset.acquisitionDate,
      depreciationId: asset.depreciationId,
      purchaseCost: asset.purchaseCost,
      depreciationValue: asset.depValue,
      salvageValue: asset.salvageValue,
      depreciationMethod: asset.depMethod,
      usefulLife: asset.usefulLife,
      prorataBasis: asset.prorataBasis,
    });
   
    // this.onToggle({checked: asset.isActive})
    // this.onacquisitionDateChange()
    if(!this.showButtons) this.assetForm.disable();
    // //Clearing Amount Validator Initially
    // this.assetForm.get('amount').setErrors(null)
    // this.assetForm.updateValueAndValidity();
  }


  //Submit Form Function
  onSubmit(): void {
   
    // if (this.assetForm.invalid) {
    //   //this.toastService.error("Please fill all required fields!", "Asset")
    //   return;
    // }

   // this.isLoading = true;
    this.mapFormValuesToAssetModel();
    console.log(this.assetModel)
    if (this.assetModel.id) {
      // this.assetService.updateAsset(this.assetModel)
      // .pipe(
      //   take(1),
      //    finalize(() => {
      //     this.isLoading = false;
      //     this.cdRef.detectChanges();
      //    })
      //  )
      //   .subscribe((res: IApiResponse<IAsset>) => {
      //     this.toastService.success('Updated Successfully', 'Asset')
      //     this.cdRef.detectChanges();
      //     //this.router.navigate(['/' + PAYROLL_ITEM.LIST])
      //   })

    } else {
      // delete this.assetModel.id;
      // this.assetService.createAsset(this.assetModel)
      // .pipe(
      //   take(1),
      //    finalize(() => {
      //     this.isLoading = false;
      //     this.cdRef.detectChanges();
      //    })
      //  )
      //   .subscribe((res: IApiResponse<IAsset>) => {
      //       this.toastService.success('Created Successfully', 'Asset')
      //       //this.router.navigate(['/' + PAYROLL_ITEM.LIST])
      //     }
      //   );
    }
  }

  // onacquisitionDateChange() {
  //   if (this.assetForm.value.acquisitionDate === 0 || this.assetForm.value.acquisitionDate === 1) {
  //     this.assetForm.get('depreciationId').setValue(1);
  //     this.disablePercentage = true;
  //   } else {
  //     this.disablePercentage = false;
  //   }
  // }

  //Mapping Form Value to Model
  mapFormValuesToAssetModel() {
    this.assetModel.name = this.assetForm.value.name;
    this.assetModel.acquisitionDate = this.dateHelperService.transformDate(this.assetForm.value.acquisitionDate , 'yyyy-MM-dd');
    this.assetModel.depreciationId = this.assetForm.value.depreciationId;
    this.assetModel.purchaseCost = this.assetForm.value.purchaseCost;
    this.assetModel.depValue = this.assetForm.value.depreciableValue;
    this.assetModel.salvageValue = this.assetForm.value.salvageValue;
    this.assetModel.depMethod = this.assetForm.value.depreciationMethod;
    this.assetModel.usefulLife = this.assetForm.value.usefulLife;
    this.assetModel.prorataBasis = this.assetForm.value.prorataBasis;
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
}






