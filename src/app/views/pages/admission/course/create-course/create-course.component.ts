import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {ICourse} from '../model/ICourse';
import {Permissions} from '../../../../shared/AppEnum';
import {finalize, take} from 'rxjs/operators';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import {CourseState} from '../store/course.state';

@Component({
  selector: 'kt-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for course Form
  CourseForm: FormGroup;

  // course Model
  course: ICourse = {} as ICourse;

  title = 'Create course'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'course is required.'
    },
    courseCode: {
      required: 'course Code is required.'
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
    public dialogRef: MatDialogRef<CreateCourseComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.CourseForm = this.fb.group({
      name: ['', [Validators.required]],
      // courseCode: ['', [Validators.required]],
      // creditHour: ['', [Validators.required, Validators.min(0)]],
      // totalMarks: ['', [Validators.required, Validators.min(0)]]
    });

    if (this._id) {
      // TODO: check course edit permission
      // this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT));
      this.title = 'Edit Course'
      this.isLoading = true
      this.getCourse(this._id);
    }

    // Get Data from Store
    this.ngxsService.getCampusFromState();
  }

 getCourse(id: number) {
   this.ngxsService.courseService.getById(id)
   .pipe(
     take(1),
      finalize(() => {
       this.isLoading = false;
       this.cdRef.detectChanges();
      })
    )
     .subscribe(
       (course: IApiResponse<ICourse>) => {
         this.editCourse(course.result);
         this.course = course.result;
       }
     );
 }

//  Edit course form
  editCourse(course: ICourse) {
    this.CourseForm.patchValue({
      id: course.id,
      name: course.name,
      // courseCode: course.courseCode,
      // creditHour: course.creditHour,
      // totalMarks: course.totalMarks,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.CourseForm.disable();
    }
  }

  onSubmit() {
    if (this.CourseForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
     if (this.course.id) {
       this.ngxsService.courseService.update(this.course)
       .pipe(
         take(1),
          finalize(() => {
           this.isLoading = false;
           this.cdRef.detectChanges();
          })
        )
         .subscribe(() => {
             this.ngxsService.store.dispatch(new IsReloadRequired(CourseState, true))
             this.toastService.success('Updated Successfully', 'Course')
             this.onCloseDialog();
           }
         );
     } else {
       delete this.course.id;
       this.ngxsService.courseService.create(this.course)
       .pipe(
         take(1),
          finalize(() => {
           this.isLoading = false;
           this.cdRef.detectChanges();
          })
        )
         .subscribe(() => {
             this.ngxsService.store.dispatch(new IsReloadRequired(CourseState, true))
             this.toastService.success('Created Successfully', 'Course')
             this.onCloseDialog();
           }
         );
     }
  }

// map form values to the course model
  mapFormValueToClientModel() {
    this.course.name = this.CourseForm.value.name;
    // this.course.courseCode = this.CourseForm.value.courseCode;
    // this.course.creditHour = this.CourseForm.value.creditHour;
    // this.course.totalMarks = this.CourseForm.value.totalMarks;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
