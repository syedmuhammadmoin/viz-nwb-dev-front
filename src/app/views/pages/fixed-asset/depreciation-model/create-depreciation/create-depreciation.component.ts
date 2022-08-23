import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepreciationMethodService } from '../service/depreciation-method.service';
import { IDepreciation } from '../model/IDepreciation';

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

  // for item type
  //accumulatedDepAccounts = accumulatedDepAccount;

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

  assetAccountTitle: string = 'assetAccount'

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
    depExpenseAccount: {
      required: 'Account is required.',
    },
    accumulatedDepAccount: {
      required: 'Account is required.',
    },
    assetAccount: {
      required: 'Account is required.',
    },
    decliningRate: {
      required: 'Rate is required.',
      min: 'Percentage % range (0 - 100)',
      max: 'Percentage % range (0 - 100)'
    },
    usefulLife: {
      required: 'Life is required.',
    }
  };

  // error keys..
  formErrors = {
    name: '',
    method: '',
    depExpenseAccount: '',
    accumulatedDepAccount: '',
    assetAccount: '',
    decliningRate: '',
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
      method: ['', [Validators.required]],
      depExpenseAccount: ['', [Validators.required]],
      accumulatedDepAccount: [1, [Validators.required]],
      assetAccount: [0, [Validators.required]],
      decliningRate: ['', [Validators.required]],
      usefulLife: ['', [Validators.required]]
    });


    //get Accounts from Accounts State
    //this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getOtherAccountsFromState();

    if (this._id) {
      //this.showButtons = (this.permission.isGranted(this.permissions.CAMPUS_EDIT)) ? true : false;
      this.title = 'Edit Depreciation Model'
      this.isLoading = true
      this.getDepreciation(this._id);
    } else {
      this.depreciationModel = {
        id: null,
        name: '',
        method: null,
        depExpenseAccount: '',
        accumulatedDepAccount: '',
        assetAccount: '',
        decliningRate: null,
        usefulLife: null,
        assetCategoryId: null
      }
    }
    

    // this.methods = [
    //   {id: 0 , assetAccount: 'Basic Pay'},
    //   {id: 1 , assetAccount: 'Increment'},
    //   {id: 2 , assetAccount: 'Deduction'},
    //   {id: 3 , assetAccount: 'Allowances'},
    //   {id: 4 , assetAccount: 'Assignment Allowance'},
    //   {id: 5 , assetAccount: 'Tax Deduction'}
    // ]


     //update FornControl 'assetAccount' Validator on checkbox changed
    //  this.depreciationForm.get('accumulatedDepAccount').assetAccountChanges.subscribe((assetAccount: number) => {
    //     this.updateassetAccountValidators(assetAccount);
    //   })
  }

  // updateassetAccountValidators(assetAccount: number) {
  //   if(assetAccount === 0) {
  //     this.assetAccountTitle = 'assetAccount (%) '
  //     this.depreciationForm.get('assetAccount').setValidators([Validators.required, Validators.min(0) , Validators.max(100)])
  //     this.depreciationForm.get('assetAccount').updateassetAccountAndValidity();
  //   }
  //   else if (assetAccount === 1) {
  //     this.assetAccountTitle = 'assetAccount'
  //     this.depreciationForm.get('assetAccount').setValidators([Validators.required])
  //     this.depreciationForm.get('assetAccount').updateassetAccountAndValidity();
  //   }
  //   this.logValidationErrors(this.depreciationForm, this.formErrors , this.validationMessages)
  // }

  


  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.depreciationForm.get('method').setValue(1)
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
      this.depreciationModel = res.result;
      this.patchDepreciation(res.result);
    });
  }

  // edit Depreciation method
  public patchDepreciation(depreciation: IDepreciation | any) {
    this.depreciationForm.patchValue({
      name: depreciation.name,
      method: depreciation.method,
      accumulatedDepAccount: depreciation.accumulatedDepAccount,
      depExpenseAccount: depreciation.depExpenseAccount,
      assetAccount: depreciation.assetAccount,
      decliningRate: depreciation.decliningRate,
      usefulLife: depreciation.usefulLife,
    });

    this.onToggle({checked: depreciation.usefulLife})
   // this.onmethodChange()
    if(!this.showButtons) this.depreciationForm.disable();
    // //Clearing Amount Validator Initially
    // this.depreciationForm.get('amount').setErrors(null)
    // this.depreciationForm.updateassetAccountAndValidity();
  }

 

  //Submit Form Function
  onSubmit(): void {
   
    if (this.depreciationForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Depreciation Item")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToDepreciationModel();
    console.log(this.depreciationModel)
    if (this.depreciationModel.id) {
      this.depreciationMethodService.updateDepreciation(this.depreciationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IDepreciation>) => {
          this.toastService.success('Updated Successfully', 'Depreciation Item')
          this.cdRef.detectChanges();
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
            this.toastService.success('Created Successfully', 'Depreciation Item')
            //this.router.navigate(['/' + Depreciation_ITEM.LIST])
          }
        );
    }
  }

  // onValueChange() {
  //   if (this.depreciationForm.assetAccount.method === 0 || this.depreciationForm.assetAccount.method === 1) {
  //     this.depreciationForm.get('accumulatedDepAccount').setassetAccount(1);
  //     this.disablePercentage = true;
  //   } else {
  //     this.disablePercentage = false;
  //   }
  // }

  //Mapping assetAccount to model
  mapFormValuesToDepreciationModel() {
    this.depreciationModel.name = this.depreciationForm.value.name;
    this.depreciationModel.method = this.depreciationForm.value.method;
    this.depreciationModel.accumulatedDepAccount = this.depreciationForm.value.accumulatedDepAccount;
    this.depreciationModel.depExpenseAccount = this.depreciationForm.value.depExpenseAccount;
    this.depreciationModel.assetAccount = this.depreciationForm.value.assetAccount;
    this.depreciationModel.decliningRate = this.depreciationForm.value.decliningRate;
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
}






