import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { IOrganization} from '../model/IOrganization';
import { IState } from 'src/app/views/shared/models/state';
import { ICity} from 'src/app/views/shared/models/city';
import { ICountry } from 'src/app/views/shared/models/country';
import { CscService} from 'src/app/views/shared/csc.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import { finalize, take} from "rxjs/operators";
import { Subject } from 'rxjs';
import { IsReloadRequired } from '../../store/profiling.action';
import { OrganizationState } from '../store/organization.state';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
  providers:[NgxsCustomService]
})

export class CreateOrganizationComponent extends AppComponentBase implements OnInit {

  //busy Loading
  isLoading: boolean

  //Variable for Organization form
  organizationForm: FormGroup;

  //Organization Model
  organization: IOrganization;

  //country , state and city list
  countryList: ICountry[] = [];
  stateList: IState[] = [];
  cityList: ICity[] = [];

  //for optionList dropdown
  stateList2: Subject<IState[]> = new Subject<IState[]>();
  cityList2: Subject<ICity[]> = new Subject<ICity[]>();

  validationMessages = {
    'name': {
      'required': 'Name is required.',
    },
    // 'country': {
    //   'required': 'Country is required.',
    // },
    // 'state': {
    //   'required': 'State is required.',
    // },
    // 'city': {
    //   'required': 'City is required.'
    // },
    // 'phone': {
    //   'required': 'Phone is required.',
    // },
    // 'fax': {
    //   'required': 'Fax is required.',
    // },
    // 'email': {
    //   'required': 'Email is required.',
    //   'email': 'Email is not valid.',
    // },
    'website': {
      'pattern': 'Website pattern is not correct.'
    },
    // 'industry': {
    //   'required': 'Industry is required.',
    // },
    // 'legalStatus': {
    //   'required': 'Legal Status is required.',
    // },
    // 'incomeTaxId': {
    //   'required': 'Income Tax ID is required.',
    // },
    // 'salesTaxId': {
    //   'required': 'sales Tax ID is required.',
    // },
    'startDate': {
      'required': 'Start Date is required.',
    },
    'endDate': {
      'required': 'End Date is required.',
    },
    // 'description': {
    //   'required': 'Description is required.',
    // },
  };

  formErrors = {
    'name': '',
    // 'country': '',
    // 'state': '',
    // 'city': '',
    // 'phone': '',
    // 'fax': '',
    // 'email': '',
    'website': '',
    // 'industry': '',
    // 'legalStatus': '',
    // 'incomeTaxId': '',
    // 'salesTaxId': '',
    'startDate': '',
    'endDate': '',
  };

  constructor(
    private fb: FormBuilder,
    public ngxsService:NgxsCustomService,
    private cscService: CscService,
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
      email: [''], //[Validators.required, Validators.email]
      website: ['', [Validators.pattern(websitePattern)]], //[Validators.required,Validators.pattern(websitePattern)]
      industry: [''],
      legalStatus: [''],
      incomeTaxId: [''],
      gstRegistrationNo: [''],
      startDate: ['',[Validators.required]],
      endDate: ['',[Validators.required]],
      clientId: [1]
    });

    this.getCountryList();

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


  getCountryList() {
    this.cscService.getCountries().subscribe((data: ICountry[]) => {
      this.countryList = data;
    });
  }

  getStateLists(id: number) {
    this.cscService.getStates(id).subscribe((data: IState[]) => {
      this.stateList = data;
      this.stateList2.next(this.stateList)
    });
  }


  onChangeCountry(countryId: number) {
    if (countryId) {
      this.getStateLists(parseInt(countryId.toString()));
      this.stateList2.next(this.stateList)
    }
  }

  onChangeState(stateId: number) {
    if (stateId) {
      this.cscService.getCities(parseInt(stateId.toString())).subscribe(
        (data: ICity[]) => {
          this.cityList = data
          this.cityList2.next(this.cityList)
        });
    }
  }

  //edit organization
  editOrganization(organization: IOrganization) {
    this.onChangeCountry(this.countryList.find(c => c.name == organization.country).id);
    this.onChangeState(this.stateList.find(c => c.name == organization.state).id)

    this.organizationForm.patchValue({
      id: organization.id,
      name: organization.name,
      country: (organization.country) ? this.countryList.find(c => c.name == organization.country).id : null,
      state: (organization.state) ? this.stateList.find(c => c.name == organization.state).id : null,
      city: (organization.city) ? this.cityList.find(c => c.name == organization.city).id : null,
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
    console.log(this.organization)
    if (this.organization.id) {
      this.ngxsService.organizationService.updateOrganization(this.organization)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(OrganizationState, true))
            // this.toastService.success('Updated Successfully', 'Organization')
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
            // this.toastService.success('Created Successfully', 'Organization')
            this.toastService.success('Created Successfully', 'Campus')
            this.onCloseDialog();
          },
          (err) => this.toastService.error('Something went wrong', 'Organization')
        );
    }
  }

  mapFormValueToClientModel() {
    this.organization.name = this.organizationForm.value.name;
    // this.organization.country = this.countryList.find(c => c.id == this.organizationForm.value.country).name;
    // this.organization.state = this.stateList.find(c => c.id == this.organizationForm.value.state).name;
    // this.organization.city = this.cityList.find(c => c.id == this.organizationForm.value.city).name;
    this.organization.country = (this.organizationForm.value.country) ? this.countryList.find(c => c.id == this.organizationForm.value.country).name : null;
    this.organization.state = (this.organizationForm.value.state) ? this.stateList.find(c => c.id == this.organizationForm.value.state).name : null;
    this.organization.city = (this.organizationForm.value.city) ? this.cityList.find(c => c.id == this.organizationForm.value.city).name : null;
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


