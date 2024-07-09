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
import {IState} from '../models/IState';
import {CountryStateState} from '../store/country-state.state';

@Component({
  selector: 'kt-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.scss']
})
export class CreateStateComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for state Form
  stateForm: FormGroup;

  // state Model
  state: IState = {} as IState;

  title = 'Create State'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'state is required.'
    },
    countryId: {
      required: 'country is required.'
    },
    courseCode: {
      required: 'state Code is required.'
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
    countryId: '',
    courseCode: '',
    creditHour: '',
    totalMarks: ''
  }

  // Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateStateComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.stateForm = this.fb.group({
      name: ['', [Validators.required]],
      countryId: ['', Validators.required]
      // courseCode: ['', [Validators.required]],
      // creditHour: ['', [Validators.required, Validators.min(0)]],
      // totalMarks: ['', [Validators.required, Validators.min(0)]]
    });

    if (this._id) {
      // TODO: check state edit permission
      // this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT));
      this.title = 'Edit State'
      this.isLoading = true
      this.getCourse(this._id);
    }

    // Get Data from Store
    this.ngxsService.getCountryFromState();
  }

  getCourse(id: number) {
    this.ngxsService.stateService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (state: IApiResponse<IState>) => {
          this.editCourse(state.result);
          this.state = state.result;
        }
      );
  }

//  Edit state form
  editCourse(state: IState) {
    this.stateForm.patchValue({
      id: state.id,
      name: state.name,
      countryId: state.countryId
      // courseCode: state.courseCode,
      // creditHour: state.creditHour,
      // totalMarks: state.totalMarks,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.stateForm.disable();
    }
  }

  onSubmit() {
    if (this.stateForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    if (this.state.id) {
      this.ngxsService.stateService.update(this.state)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CountryStateState, true))
            this.toastService.success('Updated Successfully', 'State')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.state.id;
      this.ngxsService.stateService.create(this.state)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CountryStateState, true))
            this.toastService.success('Created Successfully', 'State')
            this.onCloseDialog();
          }
        );
    }
  }

// map form values to the state model
  mapFormValueToClientModel() {
    this.state.name = this.stateForm.value.name;
    this.state.countryId = this.stateForm.value.countryId
    // this.state.courseCode = this.CourseForm.value.courseCode;
    // this.state.creditHour = this.CourseForm.value.creditHour;
    // this.state.totalMarks = this.CourseForm.value.totalMarks;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
