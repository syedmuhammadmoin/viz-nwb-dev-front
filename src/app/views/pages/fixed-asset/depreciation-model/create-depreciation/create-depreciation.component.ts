import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { DepreciationMethod, Permissions } from 'src/app/views/shared/AppEnum';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepreciationMethodService } from '../service/depreciation-method.service';
import { IDepreciation } from '../model/IDepreciation';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { DepreciationModelState } from '../store/depreciation-model.state';

@Component({
  selector: 'kt-create-depreciation',
  templateUrl: './create-depreciation.component.html',
  styleUrls: ['./create-depreciation.component.scss']
})
export class CreateDepreciationComponent extends AppComponentBase  implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  depreciationForm: FormGroup;

  //to show declining field on condition
  isDeclining: boolean = false;

  // for item type
  //accumulatedDepreciationIds = accumulatedDepreciationId;

  //Depreciation Method
  method = DepreciationMethod

  //disable percentage
  disablePercentage: boolean

  //selected Employees to assign
  selectedEmployees: any[] = []

  methods: any

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Depreciation Model
  depreciationModel: IDepreciation;

  title: string = 'Create Depreciation Model'

  isActiveChecked = true;
  // switch
  userStatus = 'Active'

  assetAccountIdTitle: string = 'assetAccountId'

   //show Buttons
   showButtons: boolean = true; 

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

    //Decimal validation
    numRegex = /^-?\d*[.,]?\d{0,2}$/;

  // Validation messages..
  validationMessages = {
    modelName: {
      required: 'Name is required.',
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
      min: 'Percentage % range (0 - 100).',
      max: 'Percentage % range (0 - 100).'
    },
    useFullLife: {
      required: 'Life is required.',
      min : 'Minimum value is 1.',
      pattern : 'Decimal Value not Allowed.'
    },
    // assetCategoryId: {
    //   required: 'Category is required.'
    // }
  };

  // error keys..
  formErrors = {
    modelName: '',
    modelType: '',
    depreciationExpenseId: '',
    accumulatedDepreciationId: '',
    assetAccountId: '',
    //decliningRate: '',
    //assetCategoryId: '',
    useFullLife: '',
  };


  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private depreciationMethodService: DepreciationMethodService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<CreateDepreciationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
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
    this.depreciationForm = this.fb.group({
      modelName: ['', [Validators.required]],
      modelType: [0, [Validators.required]],
      depreciationExpenseId: ['', [Validators.required]],
      accumulatedDepreciationId: ['', [Validators.required]],
      assetAccountId: ['', [Validators.required]],
      // decliningRate: ['', [Validators.required]],
      decliningRate: [0 , [Validators.max(100), Validators.min(0) , Validators.required]],
      //assetCategoryId: ['', [Validators.required]],
      useFullLife: ['', [Validators.required , Validators.min(1) , Validators.pattern(this.numRegex)]]
    });


    //get Accounts from Accounts State
    //this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();

    if (this._id) {
      //this.showButtons = (this.permission.isGranted(this.permissions.CAMPUS_EDIT)) ? true : false;
      this.title = 'Edit Depreciation Model'
      this.isLoading = true
      this.depreciationModel = {} as IDepreciation
      console.log(this._id)
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
        //assetCategoryId: null
      }
    }
    

    // this.methods = [
    //   {id: 0 , assetAccountId: 'Basic Pay'},
    //   {id: 1 , assetAccountId: 'Increment'},
    //   {id: 2 , assetAccountId: 'Deduction'},
    //   {id: 3 , assetAccountId: 'Allowances'},
    //   {id: 4 , assetAccountId: 'Assignment Allowance'},
    //   {id: 5 , assetAccountId: 'Tax Deduction'}
    // ]


     //update FornControl 'assetAccountId' Validator on checkbox changed
    //  this.depreciationForm.get('accumulatedDepreciationId').assetAccountIdChanges.subscribe((assetAccountId: number) => {
    //     this.updateassetAccountIdValidators(assetAccountId);
    //   })
  }

  // updateassetAccountIdValidators(assetAccountId: number) {
  //   if(assetAccountId === 0) {
  //     this.assetAccountIdTitle = 'assetAccountId (%) '
  //     this.depreciationForm.get('assetAccountId').setValidators([Validators.required, Validators.min(0) , Validators.max(100)])
  //     this.depreciationForm.get('assetAccountId').updateassetAccountIdAndValidity();
  //   }
  //   else if (assetAccountId === 1) {
  //     this.assetAccountIdTitle = 'assetAccountId'
  //     this.depreciationForm.get('assetAccountId').setValidators([Validators.required])
  //     this.depreciationForm.get('assetAccountId').updateassetAccountIdAndValidity();
  //   }
  //   this.logValidationErrors(this.depreciationForm, this.formErrors , this.validationMessages)
  // }

  


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
      //assetCategoryId: depreciation.assetCategoryId,
      useFullLife: depreciation.useFullLife,
    });

    this.onToggle({checked: depreciation.useFullLife})
    this.methodChange({source : {} as MatRadioButton , value: depreciation.modelType})
    if(!this.showButtons) this.depreciationForm.disable();
    // //Clearing Amount Validator Initially
    // this.depreciationForm.get('amount').setErrors(null)
    // this.depreciationForm.updateassetAccountIdAndValidity();
  }

 

  //Submit Form Function
  onSubmit(): void {
   
    if (this.depreciationForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToDepreciationModel();
    console.log(this.depreciationModel)
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
          this.ngxsService.store.dispatch(new IsReloadRequired (DepreciationModelState , true))
          this.toastService.success('Updated Successfully', 'Depreciation Model')
          this.cdRef.detectChanges();
          this.onCloseDialog();
          //this.router.navigate(['/' + Depreciation_ITEM.LIST])
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
          this.ngxsService.store.dispatch(new IsReloadRequired (DepreciationModelState , true))
            this.toastService.success('Created Successfully', 'Depreciation Model');
            this.onCloseDialog();
            //this.router.navigate(['/' + Depreciation_ITEM.LIST])
          }
        );
    }
  }

  // onValueChange() {
  //   if (this.depreciationForm.assetAccountId.method === 0 || this.depreciationForm.assetAccountId.method === 1) {
  //     this.depreciationForm.get('accumulatedDepreciationId').setassetAccountId(1);
  //     this.disablePercentage = true;
  //   } else {
  //     this.disablePercentage = false;
  //   }
  // }

  //Mapping assetAccountId to model
  mapFormValuesToDepreciationModel() {
    this.depreciationModel.id = this._id;
    this.depreciationModel.modelName = this.depreciationForm.value.modelName;
    this.depreciationModel.modelType = this.depreciationForm.value.modelType;
    this.depreciationModel.accumulatedDepreciationId = this.depreciationForm.value.accumulatedDepreciationId;
    this.depreciationModel.depreciationExpenseId = this.depreciationForm.value.depreciationExpenseId;
    this.depreciationModel.assetAccountId = this.depreciationForm.value.assetAccountId;
    this.depreciationModel.decliningRate = this.depreciationForm.value.decliningRate;
    //this.depreciationModel.assetCategoryId = this.depreciationForm.value.assetCategoryId;
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

  //for save or submit
  // isSubmit(val: number) {
  //   this.depreciationModel.isSubmit = (val === 0) ? false : true;
  // }



// open modal funtion
  // openDialog(id?: number): void {
  //   const dialogRef = this.dialog.open(AssignEmployeeComponent, {
  //     width: '1000px',
  //     data: id
  //   });
  //   // Recalling getEmployees function on dialog close
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if(isEmpty(this.selectedEmployees)) {
  //       this.selectedEmployees = res;
  //     }
  //     else if(!isEmpty(res)) {
  //     //   res.forEach((employee) => {
  //     //  const findDuplicateRecord = this.selectedEmployees.find(x => x.id === employee.id)
  //     //  if(!findDuplicateRecord) {
  //     //   this.selectedEmployees.push(employee)
  //     //  }
  //     res.map((employee) => {
  //      if(!(this.selectedEmployees.find(x => x.id === employee.id))) this.selectedEmployees.push(employee)
  //     })
  //     }
  //     this.gridOptions.api.setRowData(this.selectedEmployees)
  //     this.cdRef.detectChanges();
  //   });
  // }

  methodChange(event : MatRadioChange) {
    if(event.value) {
      this.isDeclining = true;
    }
    else {
      this.depreciationForm.get('decliningRate').setValue(0)
      this.isDeclining = false;
    }
  }
}






