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


@Component({
  selector: 'kt-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})

export class CreateCategoryComponent extends AppComponentBase implements OnInit {

  //busy loading
  isLoading: boolean

  // category form declaration
  categoryForm: FormGroup;

  // category model declaration
  category: ICategory;

  title: string = 'Create Category'

  permissions = Permissions

  //show Buttons
  showButtons: boolean = true;

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
      //incorrect: 'Please select valid Revenue Account'
    },
    costAccount: {
      required: 'Cost Account is required.',
      //incorrect: 'Please select valid Cost Account'
    },
  };

  //error keys
  formErrors = {
    name: '',
    inventoryAccount: '',
    revenueAccount: '',
    costAccount: '',
  };

  constructor(private fb: FormBuilder,
    public categoryService:CategoryService,
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
      costAccount: ['', [Validators.required]]
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.CATEGORIES_EDIT)) ? true : false;
      this.title = 'Edit Category'
      this.isLoading = true
      this.getCategory(this._id);
    } else {
      this.category = {
        id: null,
        name: '',
        inventoryAccountId: null,
        revenueAccountId: null,
        costAccountId: null,
      }
    }

    //this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getOtherAccountsFromState();
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
    //console.log(category)
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      inventoryAccount: category.inventoryAccountId,
      revenueAccount: category.revenueAccountId,
      costAccount: category.costAccountId,
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.categoryForm.disable();
    }
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
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}

