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
  //accumulatedDepAccountIds = accumulatedDepAccountId;

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

  // Validation messages..
  validationMessages = {
    name: {
      required: 'Name is required.',
    },
    method: {
      required: 'Method is required.',
    },
    depExpenseAccountId: {
      required: 'Account is required.',
    },
    accumulatedDepAccountId: {
      required: 'Account is required.',
    },
    assetAccountId: {
      required: 'Account is required.',
    },
    // decliningRate: {
    //   required: 'Rate is required.',
    //   min: 'Percentage % range (0 - 100)',
    //   max: 'Percentage % range (0 - 100)'
    // },
    usefulLife: {
      required: 'Life is required.',
    },
    // assetCategoryId: {
    //   required: 'Category is required.'
    // }
  };

  // error keys..
  formErrors = {
    name: '',
    method: '',
    depExpenseAccountId: '',
    accumulatedDepAccountId: '',
    assetAccountId: '',
    //decliningRate: '',
    //assetCategoryId: '',
    usefulLife: '',
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
      name: ['', [Validators.required]],
      method: [0, [Validators.required]],
      depExpenseAccountId: ['', [Validators.required]],
      accumulatedDepAccountId: ['', [Validators.required]],
      assetAccountId: ['', [Validators.required]],
      // decliningRate: ['', [Validators.required]],
      decliningRate: [null],
      //assetCategoryId: ['', [Validators.required]],
      usefulLife: ['', [Validators.required]]
    });


    //get Accounts from Accounts State
    //this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getOtherAccountsFromState();
    // this.ngxsService.getAssetCategoryFromState();

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
        name: '',
        method: null,
        depExpenseAccountId: null,
        accumulatedDepAccountId: null,
        assetAccountId: null,
        decliningRate: null,
        usefulLife: null,
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
    //  this.depreciationForm.get('accumulatedDepAccountId').assetAccountIdChanges.subscribe((assetAccountId: number) => {
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
    this.depreciationForm.get('method').setValue(0)
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

  // edit Depreciation method
  public patchDepreciation(depreciation: IDepreciation | any) {
    this.depreciationForm.patchValue({
      name: depreciation.name,
      method: depreciation.method,
      accumulatedDepAccountId: depreciation.accumulatedDepAccountId,
      depExpenseAccountId: depreciation.depExpenseAccountId,
      assetAccountId: depreciation.assetAccountId,
      decliningRate: depreciation.decliningRate,
      //assetCategoryId: depreciation.assetCategoryId,
      usefulLife: depreciation.usefulLife,
    });

    this.onToggle({checked: depreciation.usefulLife})
    this.methodChange({source : {} as MatRadioButton , value: depreciation.method})
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
  //     this.depreciationForm.get('accumulatedDepAccountId').setassetAccountId(1);
  //     this.disablePercentage = true;
  //   } else {
  //     this.disablePercentage = false;
  //   }
  // }

  //Mapping assetAccountId to model
  mapFormValuesToDepreciationModel() {
    this.depreciationModel.id = this._id;
    this.depreciationModel.name = this.depreciationForm.value.name;
    this.depreciationModel.method = this.depreciationForm.value.method;
    this.depreciationModel.accumulatedDepAccountId = this.depreciationForm.value.accumulatedDepAccountId;
    this.depreciationModel.depExpenseAccountId = this.depreciationForm.value.depExpenseAccountId;
    this.depreciationModel.assetAccountId = this.depreciationForm.value.assetAccountId;
    this.depreciationModel.decliningRate = this.depreciationForm.value.decliningRate;
    //this.depreciationModel.assetCategoryId = this.depreciationForm.value.assetCategoryId;
    this.depreciationModel.usefulLife = this.depreciationForm.value.usefulLife; 
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
      this.depreciationForm.get('decliningRate').setValue(null)
      this.isDeclining = false;
    }
  }
}





