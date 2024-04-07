import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CategoryService } from '../service/category.service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../model/ICategory';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { IsReloadRequired } from '../../store/profiling.action';
import { CategoryState } from '../store/category.state';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { MatRadioButton } from '@angular/material/radio';
import { BehaviorSubject} from 'rxjs';
import { ChartOfAccountService } from '../../../finance/chat-of-account/service/chart-of-account.service'
import { CategoryAssetState } from '../store/categoryAsset.state';


@Component({
  selector: 'kt-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})

export class CreateCategoryComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean

  // category form declaration
  categoryForm: FormGroup;

  // category model declaration
  category: ICategory = {} as ICategory;

  title: string = 'Create Category'

  permissions = Permissions

  //show Buttons
  showButtons: boolean = true;

  // asset Account Dropdown

  propertyValue: string;
  propertyName: string;
  assetAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);

  // hide depreciation model

  showDepreciation: boolean = false;



  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Category Name is required.',
    },
    inventoryAccount: {
      required: 'Asset Account is required.',
    },
    revenueAccount: {
      required: 'Revenue Account is required.',
    },
    costAccount: {
      required: 'Cost Account is required.',
    },
    depreciationModelId: {
      required: 'Depreciation Account is required.',
      //incorrect: 'Please select valid Cost Account'
    },
  };

  //error keys
  formErrors: any = {
    name: '',
    inventoryAccount: '',
    revenueAccount: '',
    costAccount: '',
    depreciationModelId: '',
  };

  constructor(private fb: FormBuilder,
    public categoryService:CategoryService,
    public chartOfAccountService : ChartOfAccountService,
    public ngxsService:NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateCategoryComponent>,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      inventoryAccount: ['', [Validators.required]],
      revenueAccount: ['', [Validators.required]],
      costAccount: ['', [Validators.required]],
      isFixedAsset: [0, [Validators.required]],
      depreciationModelId: [null]
    });

    this.loadAssetList({value: 0});

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.CATEGORIES_EDIT)) ? true : false;
      this.title = 'Edit Category'
      this.isLoading = true
      this.getCategory(this._id);
    }

    //Get Data from Store
    this.ngxsService.getOtherAccountsFromState()
    this.ngxsService.getDepreciationModelFromState();
  }

  // Getting category values for update
  getCategory(id: number) {
    this.ngxsService.categoryService.getCategory(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (category: IApiResponse<ICategory>) => {
          this.editCategory(category.result);
          this.category = category.result;
        }
      );
  }

  // Patching values to category form
  editCategory(category: ICategory) {
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      inventoryAccount: category.inventoryAccountId,
      revenueAccount: category.revenueAccountId,
      costAccount: category.costAccountId,
      isFixedAsset: (category.isFixedAsset === false) ? 0 : 1,
      depreciationModelId: category.depreciationModelId
    });

    this.loadAssetList({value: (category.isFixedAsset === false) ? 0 : 1})

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.categoryForm.disable();
    }
  }

  loadAssetList($event : MatRadioButton | any, id : number = null){

    // this.categoryForm.patchValue({
    //   isFixedAsset : id
    // })

    console.log($event.value);

    if($event.value === 0){
      this.chartOfAccountService.getOtherAccounts().subscribe((res : any) =>{
        console.log(res);
        this.assetAccountList.next(res.result || [])
        this.showDepreciation = false
        this.categoryForm.get('depreciationModelId').clearValidators()
        this.categoryForm.get('depreciationModelId').updateValueAndValidity();
        this.cdRef.markForCheck();
      })
    } else{
      this.chartOfAccountService.getAssetAccounts().subscribe((res : any) =>{
        console.log(res);
        this.assetAccountList.next(res.result || [])
        this.showDepreciation = true
        this.categoryForm.get('depreciationModelId').setValidators([Validators.required])
        this.categoryForm.get('depreciationModelId').updateValueAndValidity();
        this.cdRef.markForCheck();
      })
    }
    this.logValidationErrors(this.categoryForm, this.formErrors , this.validationMessages) 

  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToCategoryModel();
    if (this.category.id) {
      this.ngxsService.categoryService.updateCategory(this.category)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CategoryState, true))
            this.ngxsService.store.dispatch(new IsReloadRequired(CategoryAssetState, true))
            this.toastService.success('Updated Successfully', 'Category')
            this.onCloseDialog();
          }
      );
    } else {
      delete this.category.id;
      this.ngxsService.categoryService.addCategory(this.category)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {        
            this.ngxsService.store.dispatch(new IsReloadRequired(CategoryState, true))
            this.ngxsService.store.dispatch(new IsReloadRequired(CategoryAssetState, true))
            this.toastService.success('Created Successfully', 'Category')
            this.onCloseDialog();
          }
      );
    }
  }

  // Mapping values from category form to category model
  mapFormValueToCategoryModel() {
    this.category.name = this.categoryForm.value.name;
    this.category.inventoryAccountId = this.categoryForm.value.inventoryAccount
    this.category.revenueAccountId = this.categoryForm.value.revenueAccount;
    this.category.costAccountId = this.categoryForm.value.costAccount;
    this.category.isFixedAsset = (this.categoryForm.value.isFixedAsset === 0) ? false : true;
    this.category.depreciationModelId = this.categoryForm.value.depreciationModelId;
  }

  reset() {
    this.formDirective.resetForm();
    this.categoryForm.get('isFixedAsset')?.setValue(0);
    this.loadAssetList({value: 0});
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}

