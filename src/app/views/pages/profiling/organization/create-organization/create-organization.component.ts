import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { IOrganization} from '../model/IOrganization';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import { finalize, take} from "rxjs/operators";
import { IsReloadRequired } from '../../store/profiling.action';
import { OrganizationState } from '../store/organization.state';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss']
})

export class CreateOrganizationComponent extends AppComponentBase implements OnInit {

  //busy Loading
  isLoading: boolean

  //Variable for Organization form
  organizationForm: FormGroup;

  //Organization Model
  organization: IOrganization;

  validationMessages = {
    'name': {
      'required': 'Name is required.',
    },
    'website': {
      'pattern': 'Website pattern is not correct.'
    },
    'startDate': {
      'required': 'Start Date is required.',
    },
    'endDate': {
      'required': 'End Date is required.',
    },
  };

  formErrors: any = {
    'name': '',
    'website': '',
    'startDate': '',
    'endDate': '',
  };

  constructor(
    private fb: FormBuilder,
    public ngxsService:NgxsCustomService,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateOrganizationComponent>,
    injector: Injector) {
    super(injector);
  }


  ngOnInit() {
    const websitePattern = '((https?://)?||www.)?([\\a-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    this.organizationForm = this.fb.group({
      name: ['', [Validators.required]],
      country: [''],
      state: [''],
      city: [''],
      phone: [''],
      address: [''],
      fax: [''],
      email: [''], 
      website: ['', [Validators.pattern(websitePattern)]],
      industry: [''],
      legalStatus: [''],
      incomeTaxId: [''],
      gstRegistrationNo: [''],
      startDate: ['',[Validators.required]],
      endDate: ['',[Validators.required]],
      clientId: [1]
    });

    if (this._id) {
      this.isLoading = true;
      this.getOrganization(this._id);
    } else {
      this.organization = {
        id: null,
        name: '',
        country: '',
        state: '',
        city: '',
        phone: null,
        fax: '',
        email: '',
        website: '',
        address: '',
        industry: '',
        legalStatus: '',
        incomeTaxId: '',
        gstRegistrationNo: '',
        startDate: null,
        endDate: null,
        clientId: null
      };
    }
  }


  getOrganization(id: number) {
    this.ngxsService.organizationService.getOrganization(id)
      .subscribe(
        (organization: IApiResponse<IOrganization>) => {
          this.isLoading = false;
          this.editOrganization(organization.result)
          this.organization = organization.result
        },
        (err) => console.log(err)
      );
  }

  //edit organization
  editOrganization(organization: IOrganization) {
    this.organizationForm.patchValue({
      id: organization.id,
      name: organization.name,
      phone: organization.phone,
      address: organization.address,
      fax: organization.fax,
      email: organization.email,
      website: organization.website,
      industry: organization.industry,
      legalStatus: organization.legalStatus,
      incomeTaxId: organization.incomeTaxId,
      gstRegistrationNo: organization.gstRegistrationNo,
      startDate: new Date(organization.startDate),
      endDate: new Date(organization.endDate),
      clientId: organization.clientId,
    });
  }

  onSubmit() {
    if (this.organizationForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    if (this.organization.id) {
      this.ngxsService.organizationService.updateOrganization(this.organization)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(OrganizationState, true))
            this.toastService.success('Updated Successfully', 'Campus')
            this.onCloseDialog();
          },
          (err) => this.toastService.error('Something went wrong', 'Organization')
        )
    } else {
      delete this.organization['id'];
      this.ngxsService.organizationService.addOrganization(this.organization)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(OrganizationState, true))
            this.toastService.success('Created Successfully', 'Campus')
            this.onCloseDialog();
          },
          (err) => this.toastService.error('Something went wrong', 'Organization')
        );
    }
  }

  mapFormValueToClientModel() {
    this.organization.name = this.organizationForm.value.name;
    this.organization.phone = this.organizationForm.value.phone;
    this.organization.fax = this.organizationForm.value.fax;
    this.organization.email = this.organizationForm.value.email;
    this.organization.address = this.organizationForm.value.address;
    this.organization.website = this.organizationForm.value.website;
    this.organization.industry = this.organizationForm.value.industry;
    this.organization.legalStatus = this.organizationForm.value.legalStatus;
    this.organization.incomeTaxId = this.organizationForm.value.incomeTaxId;
    this.organization.gstRegistrationNo = this.organizationForm.value.gstRegistrationNo;
    this.organization.startDate = this.transformDate(this.organizationForm.value.startDate, 'yyyy-MM-dd');
    this.organization.endDate = this.transformDate(this.organizationForm.value.endDate, 'yyyy-MM-dd');
    this.organization.clientId = 1 || this.organizationForm.value.clientId;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}


