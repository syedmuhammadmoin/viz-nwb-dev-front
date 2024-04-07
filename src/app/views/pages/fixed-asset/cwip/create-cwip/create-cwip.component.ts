import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {finalize, take} from 'rxjs/operators';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {IApiResponse} from 'src/app/views/shared/IApiResponse';
import {FirstDataRenderedEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ICwip} from '../model/ICwip';
import {CwipService} from '../service/cwip.service';
import {CWIP} from 'src/app/views/shared/AppRoutes';
import {AppConst} from 'src/app/views/shared/AppConst';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {DepreciationMethodService} from '../../depreciation-model/service/depreciation-method.service';

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

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Payroll Model
  cwipModel: ICwip = {} as ICwip;

  // warehouseList: any = new BehaviorSubject<any>([])

  title: string = 'Create CWIP'

  isActiveChecked = true;

  depApplicabilityToggle = false;

  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

  isModelType = false;

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  // per product cost
  perProductCost: number;

  //show Buttons
  showButtons: boolean = true;

  //depreciation method
  method = AppConst.depreciationMethod;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {

    dateOfAcquisition: {
      required: 'Acquisition Date is required.',
    },
    cwipAccountId: {
      required: 'Account is required.',
    },
    name: {
      required: 'Account is required.',
    },
    cost: {
      required: 'Cost is required.',
      min: 'Minimum value is 0.',
    },
    assetAccountId: {
      required: 'Account is required.',
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
      required: 'Model Type is required.',
    },
    depreciationExpenseId: {
      required: 'Account is required.',
    },
    accumulatedDepreciationId: {
      required: 'Account is required.',
    },
    useFullLife: {
      required: 'Life is required.',
      min: 'Minimum value is 1.',
      max: 'Value is out of range.',
      pattern: 'Please enter only Digits.'
    },
    quantity: {
      required: 'Quantity is required.',
      min: 'Minimum value is 1.',
      max: 'Maximum value is 1000.',
    },
    decLiningRate: {
      required: 'Declining Rate is required.',
    },
    salvageValue: {
      min: 'Minimum value is 0.',
      max: 'Value should be less than cost per product.'
    },
  };

  // error keys..
  formErrors: any = {
    dateOfAcquisition: '',
    name: '',
    cwipAccountId: '',
    cost: '',
    assetAccountId: '',
    productId: '',
    warehouseId: '',
    depreciationModelId: '',
    modelType: '',
    depreciationExpenseId: '',
    accumulatedDepreciationId: '',
    useFullLife: '',
    quantity: '',
    decLiningRate: '',
    salvageValue: ''

  };

  // Injecting in dependencies in constructor
  constructor(
    private fb: FormBuilder,
    private cwipService: CwipService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateCwipComponent>,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
    private depreciationService: DepreciationMethodService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.cwipForm = this.fb.group({
      dateOfAcquisition: ['', [Validators.required]],
      name: ['', [Validators.required]],
      cwipAccountId: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.min(0)]],
      assetAccountId: ['', [Validators.required]],
      salvageValue: [0, [Validators.min(0)]],
      productId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      depreciationApplicability: [false],
      depreciationModelId: [null],
      modelType: [0],
      depreciationExpenseId: [null],
      accumulatedDepreciationId: [null],
      useFullLife: [0],
      quantity: [0, [Validators.required, Validators.min(1), Validators.max(1000)]],
      decLiningRate: [0],
      prorataBasis: [false],
      isActive: [false]
    });

    //get Accounts from Accounts State

    this.ngxsService.getDepreciationModelFromState()
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getWarehouseFromState();

    if (this.data?.id) {
      this.title = 'Edit Capital Work In progress'
      this.cwipModel.id = this.data.id;
      this.isLoading = true;
      this.getCwip(this.data.id);
    }

  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.depApplicabilityToggle = false
  }

  //Get CWIP data from Api
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
        this.getCost(res.result.cost)
        this.depApplicabilityToggle = res.result.depreciationApplicability;
      });
  }

  //Edit CWIP Method
  public patchCwip(cwip: ICwip | any) {
    this.cwipForm.patchValue({
      dateOfAcquisition: cwip.dateOfAcquisition,
      name: cwip.name,
      cwipAccountId: cwip.cwipAccountId,
      cost: cwip.cost,
      assetAccountId: cwip.assetAccountId,
      salvageValue: cwip.salvageValue,
      productId: cwip.productId,
      warehouseId: cwip.warehouseId,
      depreciationApplicability: cwip.depreciationApplicability,
      depreciationModelId: cwip.depreciationModelId,
      modelType: cwip.modelType,
      depreciationExpenseId: cwip.depreciationExpenseId,
      accumulatedDepreciationId: cwip.accumulatedDepreciationId,
      useFullLife: cwip.useFullLife,
      quantity: cwip.quantity,
      decLiningRate: cwip.decLiningRate,
      prorataBasis: cwip.prorataBasis,
      isActive: cwip.isActive
    });
    this.onChangeDepApplicability({checked: cwip.depreciationApplicability})
    this.getModelType(cwip.modelType)
    // this.onCampusSelected(cwip.productId)
  }


  //Submit Form Function
  onSubmit(): void {

    if (this.cwipForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesTocwipModel();

    if (this.data?.id) {
      console.log('edit')
      this.cwipService.updateCwip(this.cwipModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<ICwip>) => {
          this.toastService.success('Updated Successfully', 'CWIP')
          this.onCloseDialog();
          this.cdRef.detectChanges();
          this.router.navigate(['/' + CWIP.LIST])
        })

    } else {
      delete this.cwipModel.id;

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

  onChangeDepApplicability(e) {

    this.depApplicabilityToggle = e.checked

    if (e.checked) {
      this.cwipForm.get('useFullLife').setValidators([Validators.required, Validators.min(1), Validators.max(2147483647), Validators.pattern('[0-9]*$')])
    }
    if (!e.checked) {
      this.resetFields(this.cwipForm, 'depreciationModelId', 'depreciationExpenseId', 'accumulatedDepreciationId', 'useFullLife', 'decLiningRate')
      this.cwipForm.get('prorataBasis').setValue(false);
      this.cwipForm.get('isActive').setValue(false);
      this.cwipForm.get('modelType').setValue(0);
      this.getModelType(0)
    }
    this.conditionalValidation(this.cwipForm, e.checked, ['depreciationModelId', 'depreciationExpenseId', 'accumulatedDepreciationId', 'useFullLife'])
    this.logValidationErrors(this.cwipForm, this.formErrors, this.validationMessages);
  }

  getModelType(e: any) {

    if (e) {
      this.isModelType = true;
    } else {
      this.isModelType = false;
      this.cwipForm.get('decLiningRate').setValue(0)
    }

    this.conditionalValidation(this.cwipForm, e, ['decLiningRate'])
    this.logValidationErrors(this.cwipForm, this.formErrors, this.validationMessages)

  }

  //Mapping Form Value to Model
  mapFormValuesTocwipModel() {
    this.cwipModel.dateOfAcquisition = this.dateHelperService.transformDate(this.cwipForm.value.dateOfAcquisition, 'yyyy-MM-dd'),
      this.cwipModel.name = this.cwipForm.value.name,
      this.cwipModel.cwipAccountId = this.cwipForm.value.cwipAccountId
    this.cwipModel.cost = this.cwipForm.value.cost,
      this.cwipModel.assetAccountId = this.cwipForm.value.assetAccountId,
      this.cwipModel.salvageValue = (this.cwipForm.value.salvageValue) ? this.cwipForm.value.salvageValue : 0,
      this.cwipModel.productId = this.cwipForm.value.productId,
      this.cwipModel.warehouseId = this.cwipForm.value.warehouseId,
      this.cwipModel.depreciationApplicability = this.cwipForm.value.depreciationApplicability,
      this.cwipModel.depreciationModelId = this.cwipForm.value.depreciationModelId,
      this.cwipModel.modelType = this.cwipForm.value.modelType,
      this.cwipModel.depreciationExpenseId = this.cwipForm.value.depreciationExpenseId,
      this.cwipModel.accumulatedDepreciationId = this.cwipForm.value.accumulatedDepreciationId,
      this.cwipModel.useFullLife = this.cwipForm.value.useFullLife,
      this.cwipModel.quantity = this.cwipForm.value.quantity,
      this.cwipModel.decLiningRate = this.cwipForm.value.decLiningRate,
      this.cwipModel.prorataBasis = this.cwipForm.value.prorataBasis,
      this.cwipModel.isActive = this.cwipForm.value.isActive
  }


  //for save or submit
  isSubmit(val: number) {
    this.cwipModel.isSubmit = (val === 0) ? false : true;
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
        this.cwipForm.patchValue({
          modelType: res.result.modelType,
          useFullLife: res.result.useFullLife,
          decLiningRate: res.result.decliningRate,
          depreciationExpenseId: res.result.depreciationExpenseId,
          accumulatedDepreciationId: res.result.accumulatedDepreciationId,
        })
        this.getModelType(res.result.modelType)
        this.cdRef.detectChanges()
      })
  }

  getCost(e) {

    if ((this.cwipForm.get('cost').value) && (this.cwipForm.get('quantity').value) && (this.cwipForm.get('cost').value > 0)) {
      this.perProductCost = (this.cwipForm.get('cost').value) / (this.cwipForm.get('quantity').value)
      this.cwipForm.get('salvageValue').setValidators(Validators.max(this.perProductCost))
      this.cwipForm.get('salvageValue').updateValueAndValidity({onlySelf: true, emitEvent: true});
      console.log('first')
    } else if ((this.cwipForm.get('cost').value)) {
      this.perProductCost = (this.cwipForm.get('cost').value)
      this.cwipForm.get('salvageValue').setValidators(Validators.max(this.perProductCost))
      this.cwipForm.get('salvageValue').updateValueAndValidity({onlySelf: true, emitEvent: true});
      console.log('second')
    } else {
      this.perProductCost = 0;
      console.log('third')
    }
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
