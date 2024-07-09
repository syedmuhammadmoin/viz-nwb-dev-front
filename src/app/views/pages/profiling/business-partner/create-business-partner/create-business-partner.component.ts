import { NgxsCustomService } from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { IBusinessPartner} from '../model/IBusinessPartner';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { CategoryService} from "../../category/service/category.service";
import { finalize, take } from "rxjs/operators";
import { IsReloadRequired } from '../../store/profiling.action';
import { BusinessPartnerState } from '../store/business-partner.state';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AllBusinessPartnerState } from '../store/All-business-partner.state';

@Component({
  selector: 'kt-create-business-partner',
  templateUrl: './create-business-partner.component.html',
  styleUrls: ['./create-business-partner.component.scss']
})

export class CreateBusinessPartnerComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean;

  //form variable
  businessPartnerForm: FormGroup;

  //Model
  businessPartner: IBusinessPartner = {} as IBusinessPartner;

  title: string = 'Create Business Partner'

  permissions = Permissions

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //show Buttons
  showButtons: boolean = true; 

  //error messages
  validationMessages = {
    name: {
      required: 'Business Partner Name is required.'
    },
    businessPartnerType: {
      required: 'Business Partner Type is required.',
    },
    phone: {
      pattern: 'Please enter only digits.',
    },
    mobile: {
      pattern: 'Please enter only digits.',
    },
    cnic: {
      pattern: 'Please enter 13 digits number.',
    },
    bankAccountNumber: {
      pattern: 'Please enter only digits.',
    },
    salesTaxId: {
      pattern: 'Please enter only digits.',
    },
    incomeTaxId: {
      pattern: 'Please enter only digits.',
    },
    accountPayable: {
      required: 'Account Payable is required.',
    },
    accountReceivable: {
      required: 'Account Receivable is required.',
    },
  };

  //error keys
  formErrors: any = {
    name: '',
    businessPartnerType : '',
    bankAccountNumber: '',
    salesTaxId: '',
    incomeTaxId: '',
    phone: '',
    mobile: '',
    cnic: '',
    accountPayable: '',
    accountReceivable: ''
  };

  //variable for un-subscription
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;


  constructor(
    private fb: FormBuilder,   
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateBusinessPartnerComponent>, injector: Injector,
    public categoryService:CategoryService,
    private cdRef : ChangeDetectorRef,
    public ngxsService:NgxsCustomService,
  ) {
    super(injector);
  }

  //business partner type list
  typeList = [
    {id : 3 , viewValue: 'Supplier'},
    {id : 4 , viewValue: 'Consultant'},
    {id : 5 , viewValue: 'Contractor'},
    {id : 6 , viewValue: 'Student'},
    {id : 7 , viewValue: 'Service Provider'}
  ];

  ngOnInit() {

    this.businessPartnerForm = this.fb.group({
      name: ['', [Validators.required]],
      businessPartnerType: ['' , [Validators.required]],
      address: [''],
      bankName: [''],
      branchCode: [''],
      phone: ['', [Validators.pattern('[0-9]*$')]],
      mobile: ['', [Validators.pattern('[0-9]*$')]],
      cnic: ['', [Validators.pattern('^[0-9]{13}$')]],
      incomeTaxId: ['', [Validators.pattern('[0-9]*$')]],
      salesTaxId: ['', [Validators.pattern('[0-9]*$')]],
      bankAccountTitle: [''],
      bankAccountNumber: ['', [Validators.pattern('[0-9]*$')]],
      accountPayable: ['', [Validators.required]],
      accountReceivable: ['', [Validators.required]],
    });
  
    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.BUSINESSPARTNER_EDIT)) ? true : false;
      this.title = 'Edit Business Partner'
      this.isLoading = true;
      this.getBusinessPartner(this._id);
    }

    //Get Data from Store
    this.ngxsService.getAccountPayableFromState();
    this.ngxsService.getAccountReceivableFromState();
  }

  getBusinessPartner(id: number) {
    this.subscription1$ = this.ngxsService.businessPartnerService.getBusinessPartner(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (businessPartner: IApiResponse<IBusinessPartner>) => {
          this.editBusinessPartner(businessPartner.result);
          this.businessPartner = businessPartner.result
        });
  }

  editBusinessPartner(businessPartner: IBusinessPartner) {
    this.businessPartnerForm.patchValue({
      id: businessPartner.id,
      businessPartnerType: businessPartner.businessPartnerType,
      name: businessPartner.name,
      address: businessPartner.address,
      phone: businessPartner.phone,
      mobile: businessPartner.mobile,
      bankName: businessPartner.bankName,
      branchCode: businessPartner.branchCode,
      incomeTaxId: businessPartner.incomeTaxId,
      salesTaxId: businessPartner.salesTaxId,
      bankAccountTitle: businessPartner.bankAccountTitle,
      bankAccountNumber: businessPartner.bankAccountNumber,
      accountPayable: businessPartner.accountPayableId,
      accountReceivable: businessPartner.accountReceivableId,
      cnic: businessPartner.cnic
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.businessPartnerForm.disable();
    }
  }

  reset(){
    this.formDirective.resetForm();
  }

  onSubmit() {
    if (this.businessPartnerForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Business Partner")
      return;
    }

    this.isLoading = true;
    this.mapFormValueToClientModel();
 
    if (this.businessPartner.id) {
      this.subscription2$ = this.ngxsService.businessPartnerService.updateBusinessPartner(this.businessPartner)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(BusinessPartnerState, true));
            this.ngxsService.store.dispatch(new IsReloadRequired(AllBusinessPartnerState, true));
            this.toastService.success('Updated Successfully', 'Business Partner')
            this.onCloseDialog();
        });
    } else {
      delete this.businessPartner['id'];
      this.subscription3$ = this.ngxsService.businessPartnerService.addBusinessPartner(this.businessPartner)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(BusinessPartnerState, true));
            this.ngxsService.store.dispatch(new IsReloadRequired(AllBusinessPartnerState, true));
            this.toastService.success('Created Successfully', 'Business Partner')
            this.onCloseDialog();
        });
    }
  }

  mapFormValueToClientModel() {
    this.businessPartner.name = this.businessPartnerForm.value.name;
    this.businessPartner.businessPartnerType = this.businessPartnerForm.value.businessPartnerType
    this.businessPartner.address = this.businessPartnerForm.value.address;
    this.businessPartner.phone = this.businessPartnerForm.value.phone;
    this.businessPartner.bankName = this.businessPartnerForm.value.bankName;
    this.businessPartner.branchCode = this.businessPartnerForm.value.branchCode;
    this.businessPartner.mobile = this.businessPartnerForm.value.mobile;
    this.businessPartner.incomeTaxId = this.businessPartnerForm.value.incomeTaxId;
    this.businessPartner.salesTaxId = this.businessPartnerForm.value.salesTaxId;
    this.businessPartner.bankAccountTitle = this.businessPartnerForm.value.bankAccountTitle;
    this.businessPartner.bankAccountNumber = this.businessPartnerForm.value.bankAccountNumber;
    this.businessPartner.accountPayableId = this.businessPartnerForm.value.accountPayable;
    this.businessPartner.accountReceivableId = this.businessPartnerForm.value.accountReceivable;
    this.businessPartner.cnic = this.businessPartnerForm.value.cnic;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}









