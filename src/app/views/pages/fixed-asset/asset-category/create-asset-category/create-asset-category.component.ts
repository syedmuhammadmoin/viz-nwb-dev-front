import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAssetCategory } from '../model/IAssetCategory';
import { AssetCategoryService } from '../service/asset-category.service';


@Component({
  selector: 'kt-create-asset-category',
  templateUrl: './create-asset-category.component.html',
  styleUrls: ['./create-asset-category.component.scss']
})

export class CreateAssetCategoryComponent extends AppComponentBase  implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  assetCategoryForm: FormGroup;

  // for item type
  //accumulatedDepAccounts = accumulatedDepAccount;

  //disable percentage
  disablePercentage: boolean

  //selected Employees to assign
  selectedEmployees: any[] = []

  methods: any

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  //Asset Category Model
  assetCategoryModel: IAssetCategory;

  title: string = 'Create Asset Category'

  isActiveChecked = true;
  // switch
  userStatus = 'Active'

  assetAccountTitle: string = 'Asset Account'

   //show Buttons
   showButtons: boolean = true; 

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    name: {
      required: 'Name is required.',
    },
    description: {
      required: 'Description is required.'
    }
  };

  // error keys..
  formErrors = {
    name: '',
    description: ''
  };


  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private assetCategoryService: AssetCategoryService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<CreateAssetCategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.assetCategoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    if (this._id) {
      //this.showButtons = (this.permission.isGranted(this.permissions.CAMPUS_EDIT)) ? true : false;
      this.title = 'Edit assetCategory Model'
      this.isLoading = true
      this.getAssetCategory(this._id);
    } else {
      this.assetCategoryModel = {
        id: null,
        name: '',
        description: null
      }
    }
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
  }


  //Get Asset Category data from Api
  private getAssetCategory(id: number) {
    this.assetCategoryService.getAssetCategoryById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.assetCategoryModel = res.result;
      this.patchassetCategory(res.result);
    });
  }

  //Edit Asset Category method
  public patchassetCategory(assetCategory: IAssetCategory | any) {
    this.assetCategoryForm.patchValue({
      name: assetCategory.name,
      description: assetCategory.description
    });

    if(!this.showButtons) this.assetCategoryForm.disable();
  }

 

  //Submit Form Function
  onSubmit(): void {
   
    if (this.assetCategoryForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToassetCategoryModel();
    console.log(this.assetCategoryModel)
    if (this.assetCategoryModel.id) {
      this.assetCategoryService.updateAssetCategory(this.assetCategoryModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IAssetCategory>) => {
          this.toastService.success('Updated Successfully', 'Asset Category')
          this.cdRef.detectChanges();
          //this.router.navigate(['/' + assetCategory_ITEM.LIST])
        })

    } else {
      delete this.assetCategoryModel.id;
      this.assetCategoryService.createAssetCategory(this.assetCategoryModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IAssetCategory>) => {
            this.toastService.success('Created Successfully', 'Asset Category')
            //this.router.navigate(['/' + assetCategory_ITEM.LIST])
          }
        );
    }
  }

  //Mapping Asset Category Form to Model
  mapFormValuesToassetCategoryModel() {
    this.assetCategoryModel.name = this.assetCategoryForm.value.name;
    this.assetCategoryModel.description = this.assetCategoryForm.value.description;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}









