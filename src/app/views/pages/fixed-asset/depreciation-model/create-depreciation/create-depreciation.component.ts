import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, take} from 'rxjs/operators';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {DepreciationMethod, Permissions} from 'src/app/views/shared/AppEnum';
import {IApiResponse} from 'src/app/views/shared/IApiResponse';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DepreciationMethodService} from '../service/depreciation-method.service';
import {IDepreciation} from '../model/IDepreciation';
import {MatRadioButton, MatRadioChange} from '@angular/material/radio';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import {DepreciationModelState} from '../store/depreciation-model.state';

@Component({
  selector: 'kt-create-depreciation',
  templateUrl: './create-depreciation.component.html',
  styleUrls: ['./create-depreciation.component.scss']
})
export class CreateDepreciationComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  depreciationForm: FormGroup;

  // to show declining field on condition
  isDeclining = false;

  // for item type
  // accumulatedDepreciationIds = accumulatedDepreciationId;

  // Depreciation Method
  method = DepreciationMethod

  // disable percentage
  disablePercentage: boolean

  // selected Employees to assign
  selectedEmployees: any[] = []

  methods: any

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Depreciation Model
  depreciationModel: IDepreciation;

  title = 'Create Depreciation Model'

  isActiveChecked = true;
  // switch
  userStatus = 'Active'

  // assetAccountIdTitle: string = 'assetAccountId'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;


  // Validation messages..
  validationMessages = {
    modelName: {
      required: 'Name is required.',
      minLength: 'Name can\'t be less than 3 characters.',
      maxLength: 'Name can\'t be more than 50 characters.',
    },
    modelType: {
      required: 'Method is required.',
    },
    depreciationExpenseId: {
      required: 'Account is required.',
    },
    accumulatedDepreciationId: {
      required: 'Account is required.',
    },
    assetAccountId: {
      required: 'Account is required.',
    },
    decliningRate: {
      required: 'Declining Rate is required.',
      min: 'Percentage % range (1 - 100).',
      max: 'Percentage % range (1 - 100).'
    },
    useFullLife: {
      required: 'Usefull Life is required.',
      min: 'Minimum value is 1.',
      max: 'Value is out of range.',
      pattern: 'Please enter only Digits.'
    }
  };

  // error keys..
  formErrors: any = {
    modelName: '',
    modelType: '',
    depreciationExpenseId: '',
    accumulatedDepreciationId: '',
    assetAccountId: '',
    useFullLife: '',
  };


  // Injecting in dependencies in constructor
  constructor(
    private fb: FormBuilder,
    private depreciationMethodService: DepreciationMethodService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<CreateDepreciationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public addButtonService: AddModalButtonService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    // Creating Forms
    this.depreciationForm = this.fb.group({
      modelName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      modelType: [0, [Validators.required]],
      depreciationExpenseId: ['', [Validators.required]],
      accumulatedDepreciationId: ['', [Validators.required]],
      assetAccountId: ['', [Validators.required]],
      decliningRate: [1, [Validators.max(100), Validators.min(1), Validators.required]],
      useFullLife: ['', [Validators.required, Validators.min(1), Validators.max(2147483647), Validators.pattern('[0-9]*$')]]
    });

    // get Accounts from Accounts State
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getExpenseAccountsFromState();
    this.ngxsService.getLiabilityAccountsFromState();
    this.ngxsService.getAssetAccountFromState();

    if (this._id) {
      this.title = 'Edit Depreciation Model'
      this.isLoading = true
      this.depreciationModel = {} as IDepreciation
      this.getDepreciation(this._id);

    } else {
      this.depreciationModel = {
        id: null,
        modelName: '',
        modelType: null,
        depreciationExpenseId: null,
        accumulatedDepreciationId: null,
        assetAccountId: null,
        decliningRate: null,
        useFullLife: null,
      }
      // console.log(this.depreciationForm.get('modelType').value);
      this.methodChange({source: {} as MatRadioButton, value: this.depreciationForm.get('modelType').value})
    }
  }


  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.isDeclining = false;
    this.depreciationForm.get('modelType').setValue(0)
    this.onToggle({checked: true})
  }


  // get Depreciation data from Api
  private getDepreciation(id: number) {
    this.depreciationMethodService.getDepreciationById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.patchDepreciation(res.result);
      });
  }

  // edit Depreciation modelType
  public patchDepreciation(depreciation: IDepreciation | any) {
    this.depreciationForm.patchValue({
      modelName: depreciation.modelName,
      modelType: depreciation.modelType,
      accumulatedDepreciationId: depreciation.accumulatedDepreciationId,
      depreciationExpenseId: depreciation.depreciationExpenseId,
      assetAccountId: depreciation.assetAccountId,
      decliningRate: depreciation.decliningRate,
      useFullLife: depreciation.useFullLife,
    });

    this.onToggle({checked: depreciation.useFullLife})
    this.methodChange({source: {} as MatRadioButton, value: depreciation.modelType})
    if (!this.showButtons) this.depreciationForm.disable();
  }


  // Submit Form Function
  onSubmit(): void {
    if (this.depreciationForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToDepreciationModel();

    if (this._id) {
      this.depreciationMethodService.updateDepreciation(this.depreciationModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IDepreciation>) => {
          this.ngxsService.store.dispatch(new IsReloadRequired(DepreciationModelState, true))
          this.toastService.success('Updated Successfully', 'Depreciation Model')
          this.cdRef.detectChanges();
          this.onCloseDialog();
        })

    } else {
      delete this.depreciationModel.id;
      this.depreciationMethodService.createDepreciation(this.depreciationModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IDepreciation>) => {
            this.ngxsService.store.dispatch(new IsReloadRequired(DepreciationModelState, true))
            this.toastService.success('Created Successfully', 'Depreciation Model');
            this.onCloseDialog();
          }
        );
    }
  }

  // Mapping assetAccountId to model
  mapFormValuesToDepreciationModel() {
    this.depreciationModel.id = this._id;
    this.depreciationModel.modelName = this.depreciationForm.value.modelName;
    this.depreciationModel.modelType = this.depreciationForm.value.modelType;
    this.depreciationModel.accumulatedDepreciationId = this.depreciationForm.value.accumulatedDepreciationId;
    this.depreciationModel.depreciationExpenseId = this.depreciationForm.value.depreciationExpenseId;
    this.depreciationModel.assetAccountId = this.depreciationForm.value.assetAccountId;
    this.depreciationModel.decliningRate = this.depreciationForm.value.decliningRate;
    this.depreciationModel.useFullLife = this.depreciationForm.value.useFullLife;
  }

  onToggle(event) {
    if (event.checked) {
      this.userStatus = 'Active'
    } else {
      this.userStatus = 'Inactive'
    }
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

  methodChange(event: MatRadioChange) {
    if (event.value) {
      this.depreciationForm.get('decliningRate').setValidators([Validators.max(100), Validators.min(1), Validators.required])
      this.isDeclining = true;
    } else {
      this.depreciationForm.get('decliningRate').clearValidators();
      this.depreciationForm.get('decliningRate').updateValueAndValidity();
      this.depreciationForm.get('decliningRate').setValue(0)
      this.isDeclining = false;
    }
  }
}
