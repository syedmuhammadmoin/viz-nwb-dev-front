import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {Permissions} from '../../../../shared/AppEnum';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxsCustomService} from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import {AddModalButtonService} from '../../../../shared/services/add-modal-button/add-modal-button.service';
import {finalize, take} from 'rxjs/operators';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import {CountryState} from '../store/country.state';
import { ICountry } from '../models/ICountry';

@Component({
  selector: 'kt-create-country',
  templateUrl: './create-country.component.html',
  styleUrls: ['./create-country.component.scss']
})
export class CreateCountryComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for country Form
  countryForm: FormGroup;

  // country Model
  country: ICountry = {} as ICountry;

  title = 'Create Country'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'country is required.'
    },
    courseCode: {
      required: 'country Code is required.'
    },
    creditHour: {
      required: 'Credit Hour is required.',
      min: 'Minimum Value 1'
    },
    totalMarks: {
      required: 'TotalMarks is required.',
      min: 'Minimum Value 1'
    },
  }

  // error keys
  formErrors = {
    name: '',
    courseCode: '',
    creditHour: '',
    totalMarks: ''
  }

  // Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateCountryComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.countryForm = this.fb.group({
      name: ['', [Validators.required]],
      // courseCode: ['', [Validators.required]],
      // creditHour: ['', [Validators.required, Validators.min(0)]],
      // totalMarks: ['', [Validators.required, Validators.min(0)]]
    });

    if (this._id) {
      // TODO: check country edit permission
      // this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT));
      this.title = 'Edit Country'
      this.isLoading = true
      this.getCourse(this._id);
    }

    // Get Data from Store
    // this.ngxsService.getCampusFromState();
  }

  getCourse(id: number) {
    this.ngxsService.countryService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (country: IApiResponse<ICountry>) => {
          this.editCourse(country.result);
          this.country = country.result;
        }
      );
  }

//  Edit country form
  editCourse(country: ICountry) {
    this.countryForm.patchValue({
      id: country.id,
      name: country.name,
      // courseCode: country.courseCode,
      // creditHour: country.creditHour,
      // totalMarks: country.totalMarks,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.countryForm.disable();
    }
  }

  onSubmit() {
    if (this.countryForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    if (this.country.id) {
      this.ngxsService.countryService.update(this.country)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CountryState, true))
            this.toastService.success('Updated Successfully', 'Country')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.country.id;
      this.ngxsService.countryService.create(this.country)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CountryState, true))
            this.toastService.success('Created Successfully', 'Country')
            this.onCloseDialog();
          }
        );
    }
  }

// map form values to the country model
  mapFormValueToClientModel() {
    this.country.name = this.countryForm.value.name;
    // this.country.courseCode = this.CourseForm.value.courseCode;
    // this.country.creditHour = this.CourseForm.value.creditHour;
    // this.country.totalMarks = this.CourseForm.value.totalMarks;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
