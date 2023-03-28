import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize, take} from 'rxjs/operators';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {IApiResponse} from 'src/app/views/shared/IApiResponse';
import {FirstDataRenderedEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IDisposal} from '../model/IDisposal';
import {DisposalService} from '../service/disposal.service';
import {DISPOSAL} from 'src/app/views/shared/AppRoutes';
import {AppConst} from 'src/app/views/shared/AppConst';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {AssetService} from '../../../fixed-asset/asset/service/asset.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'kt-create-disposal',
  templateUrl: './create-disposal.component.html',
  styleUrls: ['./create-disposal.component.scss']
})
export class CreateDisposalComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  disposalForm: FormGroup;

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Payroll Model
  disposalModel: IDisposal = {} as IDisposal;

  warehouseList: any = new BehaviorSubject<any>([])

  title = 'Create Disposal'

  isActiveChecked = true;

  depApplicabilityToggle = false;

  // switch
  userStatus = 'Active'

  valueTitle = 'Value'

  isModelType = false;
  isBPRequired = false;

  // show toast mesasge of on campus select
  showMessage = false;

  // show Buttons
  showButtons = true;

  // depreciation method
  method = AppConst.depreciationMethod;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    fixedAssetId: {
      required: 'Account is required.',
    },
    productId: {
      required: 'Product is required.',
    },
    cost: {
      required: 'Cost is required.',
    },
    salvageValue: {
      required: 'Salvage Value is required.',
    },
    usefulLife: {
      required: 'Usefull Life is required.',
      min: 'Minimum value is 1.',
      max: 'Value is out of range.',
      pattern: 'Please enter only Digits.'
    },
    accumulatedDepreciationId: {
      required: 'Account is required.',
    },
    disposalDate: {
      required: 'Disposal Date is required.',
    },
    disposalValue: {
      required: 'Disposal value is required.',
    },
    warehouseId: {
      required: 'Store is required.',
    },
    businessPartnerId: {
      required: 'Business Partner is required.',
    },
  };

  // error keys..
  formErrors = {
    fixedAssetId: '',
    businessPartnerId: '',
    productId: '',
    cost: '',
    salvageValue: '',
    usefulLife: '',
    accumulatedDepreciationId: '',
    disposalDate: '',
    disposalValue: '',
    warehouseId: ''
  };

  // Injecting in dependencies in constructor
  constructor(
    private fb: FormBuilder,
    private disposalService: DisposalService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateDisposalComponent>,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
    private assetService: AssetService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    this.disposalForm = this.fb.group({
      fixedAssetId: ['', [Validators.required]],
      businessPartnerId: [''],
      productId: [''],
      cost: [''],
      salvageValue: [''],
      usefulLife: [''],
      accumulatedDepreciationId: [''],
      disposalDate: ['', [Validators.required]],
      disposalValue: ['', [Validators.required]],
      warehouseId: ['']
    });

    // get Accounts from Accounts State

    this.ngxsService.getDepreciationModelFromState()
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getCampusFromState();
    this.ngxsService.getDisposaldropdownFromState();
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getBusinessPartnerFromState();

    if (this.data?.id) {
      this.title = 'Edit Disposal'
      this.disposalModel.id = this.data.id;
      this.isLoading = true;
      this.getDisposal(this.data.id);
    }
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.depApplicabilityToggle = false
  }

  // Get Disposal data from Api
  private getDisposal(id: number) {
    this.disposalService.getDisposalById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.disposalModel = res.result;
        this.patchDisposal(res.result);
      });
  }

  // Edit disposal Method
  public patchDisposal(disposal: IDisposal | any) {
    this.disposalForm.patchValue({

      fixedAssetId: disposal.fixedAssetId,
      productId: disposal.productId,
      cost: disposal.cost,
      salvageValue: disposal.salvageValue,
      usefulLife: disposal.useFullLife,
      accumulatedDepreciationId: disposal.accumulatedDepreciationId,
      disposalDate: disposal.disposalDate,
      disposalValue: disposal.disposalValue,
      warehouseId: disposal.warehouseId,

    });
  }


  // Submit Form Function
  onSubmit(): void {

    if (this.disposalForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesTodisposalModel();

    if (this.data?.id) {
      console.log('edit')
      this.disposalService.updateDisposal(this.disposalModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IDisposal>) => {
          this.toastService.success('Updated Successfully', 'Disposal')
          this.onCloseDialog();
          this.cdRef.detectChanges();
          this.router.navigate(['/' + DISPOSAL.LIST])
        })

    } else {
      delete this.disposalModel.id;

      this.disposalService.createDisposal(this.disposalModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IDisposal>) => {
            this.toastService.success('Created Successfully', 'Disposal')
            this.onCloseDialog();
            this.router.navigate(['/' + DISPOSAL.LIST])
          }
        );
    }
  }

  getAssetData(id: number) {
    this.assetService.getAssetById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.disposalForm.patchValue({
          modelType: res.result.modelType,
          productId: res.result.productId,
          cost: res.result.cost,
          salvageValue: res.result.salvageValue,
          usefulLife: res.result.useFullLife,
          accumulatedDepreciationId: res.result.accumulatedDepreciationId,
          warehouseId: res.result.warehouseId,
        })
        // this.disposalForm.get('modelType').disable();
        this.disposalForm.get('productId').disable();
        this.disposalForm.get('cost').disable();
        this.disposalForm.get('salvageValue').disable();
        this.disposalForm.get('usefulLife').disable();
        this.disposalForm.get('accumulatedDepreciationId').disable();
        this.disposalForm.get('warehouseId').disable();

        // this.getModelType(res.result.modelType)
        this.cdRef.detectChanges()
      })
  }


  // Mapping Form Value to Model
  mapFormValuesTodisposalModel() {

    this.disposalModel.fixedAssetId = this.disposalForm.value.fixedAssetId
    this.disposalModel.businessPartnerId = this.disposalForm.value.businessPartnerId
    // this.disposalModel.productId = this.disposalForm.value.productId
    // this.disposalModel.cost = this.disposalForm.value.cost
    // this.disposalModel.salvageValue = this.disposalForm.value.salvageValue
    // this.disposalModel.useFullLife = this.disposalForm.value.usefulLife
    // this.disposalModel.accumulatedDepreciationId = this.disposalForm.value.accumulatedDepreciationId
    this.disposalModel.disposalDate = this.dateHelperService.transformDate(this.disposalForm.value.disposalDate, 'yyyy-MM-dd')
    this.disposalModel.disposalValue = this.disposalForm.value.disposalValue
    // this.disposalModel.warehouseId = this.disposalForm.value.warehouseId
  }


  // for save or submit
  isSubmit(val: number) {
    this.disposalModel.isSubmit = (val !== 0);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

  updateBPValidity($event: any) {
    console.log('updateBPValidity')
    if (this.disposalForm.get('disposalValue').value > 0) {
      console.log('If')
      console.log(this.disposalForm.get('disposalValue').value)
      this.isBPRequired = true
      this.disposalForm.get('businessPartnerId').setValidators([Validators.required])
    } else {
      console.log('Else')
      this.disposalForm.get('businessPartnerId').clearValidators();
      this.disposalForm.updateValueAndValidity();
      this.formErrors.businessPartnerId = ''
      this.isBPRequired = false
    }
  }
}
