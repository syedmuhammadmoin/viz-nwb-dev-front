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
import {ISemester} from '../model/ISemester';
import {SemesterState} from '../store/semester.state';

@Component({
  selector: 'kt-create-semester',
  templateUrl: './create-semester.component.html',
  styleUrls: ['./create-semester.component.scss']
})
export class CreateSemesterComponent extends AppComponentBase implements OnInit {

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for semester Form
  semesterForm: FormGroup;

  // semester Model
  semester: ISemester = {} as ISemester;

  title = 'Create Semester'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'semester is required.'
    },
    season: {
      required: 'Season is required.'
    },
    startDate: {
      required: 'Start Date is required.'
    },
    endDate: {
      required: 'End Date is required.'
    },
    isOpenForEnrollment: {
      required: 'Open for Enrollment is required.',
    },
    isActive: {
      required: 'Active is required.',
    },
  }

  // error keys
  formErrors = {
    name: '',
    season: '',
    startDate: '',
    endDate: '',
    isOpenForEnrollment: '',
    isActive: '',
  }

  // Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateSemesterComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.semesterForm = this.fb.group({
      name: ['', [Validators.required]],
      season: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isOpenForEnrollment: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
    });

    if (this._id) {
      // TODO: check semester edit permission
      this.showButtons = (this.permission.isGranted(this.permissions.ADMISSION_SEMESTER_EDIT));
      this.title = 'Edit Semester'
      this.isLoading = true
      this.getCourse(this._id);
    }

    // Get Data from Store
    // this.ngxsService.getCampusFromState();

    this.semesterForm.get('startDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.semesterForm.get('endDate').value < this.semesterForm.get('startDate').value
    })
  }

  getCourse(id: number) {
    this.ngxsService.semesterService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (semester: IApiResponse<ISemester>) => {
          this.editCourse(semester.result);
          this.semester = semester.result;
        }
      );
  }

//  Edit semester form
  editCourse(semester: ISemester) {
    this.semesterForm.patchValue({
      id: semester.id,
      name: semester.name,
      season: semester.season,
      endDate: semester.endDate,
      startDate: semester.startDate,
      isOpenForEnrollment: semester.isOpenForEnrollment,
      isActive: semester.isActive,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.semesterForm.disable();
    }
  }

  onSubmit() {
    if (this.semesterForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    if (this.semester.id) {
      this.ngxsService.semesterService.update(this.semester)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(SemesterState, true))
            this.toastService.success('Updated Successfully', 'Semester')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.semester.id;
      this.ngxsService.semesterService.create(this.semester)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(SemesterState, true))
            this.toastService.success('Created Successfully', 'Semester')
            this.onCloseDialog();
          }
        );
    }
  }

// map form values to the semester model
  mapFormValueToClientModel() {
    this.semester.name = this.semesterForm.value.name;
    this.semester.season = this.semesterForm.value.season;
    this.semester.startDate = this.transformDate(this.semesterForm.value.startDate, 'yyyy-MM-dd');
    this.semester.endDate = this.transformDate(this.semesterForm.value.endDate, 'yyyy-MM-dd');
    this.semester.isOpenForEnrollment = this.semesterForm.value.isOpenForEnrollment;
    this.semester.isActive = this.semesterForm.value.isActive;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
