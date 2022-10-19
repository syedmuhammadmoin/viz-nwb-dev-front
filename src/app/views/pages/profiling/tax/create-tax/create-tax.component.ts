import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ITax } from '../model/ITax';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { TaxService } from '../service/tax.service';
import { AppConst } from 'src/app/views/shared/AppConst';
import { getuid } from 'process';

@Component({
  selector: 'kt-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.scss']
})

export class CreateTaxComponent extends AppComponentBase implements OnInit {

  //busy loading
  isLoading: boolean

  // tax form declaration
  taxForm: FormGroup;

  // tax model declaration
  taxModel: ITax;

  //get tax data by id
  taxDataByID: ITax | any;

  title: string = 'Create Tax'

  permissions = Permissions

  //show Buttons
  showButtons: boolean = true;

  taxTypeList = AppConst.taxType

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Tax Name is required.',
    },
    taxType: {
      required: 'Tax Type is required.',
    },
    accountId: {
      required: 'Account is required.',
    }
  };

  //error keys
  formErrors = {
    name: '',
    taxType: '',
    accountId: '',
  };

  constructor(private fb: FormBuilder,
    public taxService: TaxService,
    public ngxsService:NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateTaxComponent>,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.taxForm = this.fb.group({
      name: ['' , [Validators.required]],
      taxType: [{value: 0 , disabled: true}, [Validators.required]],
      accountId: ['', [Validators.required]]
    });

    if (this._id) {
      //initialize empty taxModel
      this.taxModel = {} as ITax;

      this.showButtons = (this.permission.isGranted(this.permissions.TAXES_EDIT)) ? true : false;
      this.title = 'Edit tax'
      this.isLoading = true
      this.getTax(this._id);
    } else {
      this.taxModel = {
        id: null,
        accountId: null
      }
    }

    //this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getOtherAccountsFromState();
  }

  // Getting tax values for update
  getTax(id: number) {
    this.taxService.getTax(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (tax: IApiResponse<ITax>) => {
          this.editTax(tax.result);
          this.taxDataByID = tax.result;
        }
      );
  }

  // Patching values to tax form

  
  editTax(tax: ITax | any) {
    this.taxForm.patchValue({
      name: tax.name,
      taxType: tax.taxType,
      accountId: (tax.accountId === '00000000-0000-0000-0000-000000000000') ? null : tax.accountId,
    });

    console.log(tax.accountId.empty)

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.taxForm.disable();
    }
  }

  onSubmit() {
    if (this.taxForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToTaxModel();
    if (this.taxDataByID.id) {
      this.taxService.updateTax(this.taxModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            //this.ngxsService.store.dispatch(new IsReloadRequired(taxState, true))
            this.toastService.success('Updated Successfully', 'Tax')
            this.onCloseDialog();
          }
      );
    }
    // } else {
    //   delete this.tax.id;
    //   this.taxService.addTax(this.tax)
    //   .pipe(
    //     take(1),
    //      finalize(() => {
    //       this.isLoading = false;
    //       this.cdRef.detectChanges();
    //      })
    //    )
    //     .subscribe(() => {        
    //         //this.ngxsService.store.dispatch(new IsReloadRequired(taxState, true))
    //         this.toastService.success('Added Successfully', 'Tax')
    //         this.onCloseDialog();
    //       }
    //   );
    // }
  }

  // Mapping values from tax form to tax model
  mapFormValueToTaxModel() {
    this.taxModel.id = this.taxDataByID.id;
    this.taxModel.accountId = this.taxForm.value.accountId;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}











