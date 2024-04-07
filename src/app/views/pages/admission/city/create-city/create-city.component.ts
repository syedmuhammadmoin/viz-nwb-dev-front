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
import {ICity} from '../models/ICity';
import {CityState} from '../store/city.state';

@Component({
  selector: 'kt-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss']
})
export class CreateCityComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for city Form
  cityForm: FormGroup;

  // city Model
  city: ICity = {} as ICity;

  title = 'Create City'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Name is required.'
    },
    stateId: {
      required: 'State is required.'
    },
    countryId: {
      required: 'Country is required.'
    },
    courseCode: {
      required: 'city Code is required.'
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
  formErrors: any = {
    name: '',
    stateId: '',
    courseCode: '',
    creditHour: '',
    totalMarks: ''
  }

  // Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateCityComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      // courseCode: ['', [Validators.required]],
      // creditHour: ['', [Validators.required, Validators.min(0)]],
      // totalMarks: ['', [Validators.required, Validators.min(0)]]
    });

    if (this._id) {
      // TODO: check city edit permission
      // this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT));
      this.title = 'Edit City'
      this.isLoading = true
      this.getCourse(this._id);
    }

    // Get Data from Store
    this.ngxsService.getCountryFromState();
    this.ngxsService.getCityFromState();
    this.ngxsService.getCountryStateFromState();
  }

  getCourse(id: number) {
    this.ngxsService.cityService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (city: IApiResponse<ICity>) => {
          this.editCourse(city.result);
          this.city = city.result;
        }
      );
  }

//  Edit city form
  editCourse(city: ICity) {
    this.cityForm.patchValue({
      id: city.id,
      name: city.name,
      stateId: city.stateId,
      // courseCode: city.courseCode,
      // creditHour: city.creditHour,
      // totalMarks: city.totalMarks,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.cityForm.disable();
    }
  }

  onSubmit() {
    if (this.cityForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    if (this.city.id) {
      this.ngxsService.cityService.update(this.city)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CityState, true))
            this.toastService.success('Updated Successfully', 'City')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.city.id;
      this.ngxsService.cityService.create(this.city)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CityState, true))
            this.toastService.success('Created Successfully', 'City')
            this.onCloseDialog();
          }
        );
    }
  }

// map form values to the city model
  mapFormValueToClientModel() {
    this.city.name = this.cityForm.value.name;
    this.city.stateId = this.cityForm.value.stateId;
    // this.city.courseCode = this.CourseForm.value.courseCode;
    // this.city.creditHour = this.CourseForm.value.creditHour;
    // this.city.totalMarks = this.CourseForm.value.totalMarks;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
