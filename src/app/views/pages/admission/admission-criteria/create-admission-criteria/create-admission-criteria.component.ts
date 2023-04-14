import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {Permissions} from '../../../../shared/AppEnum';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxsCustomService} from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import {AddModalButtonService} from '../../../../shared/services/add-modal-button/add-modal-button.service';
import {finalize, take} from 'rxjs/operators';
import {IAdmissionCriteria} from '../model/IAdmissionCriteria';

@Component({
  selector: 'kt-create-admission-criteria',
  templateUrl: './create-admission-criteria.component.html',
  styleUrls: ['./create-admission-criteria.component.scss']
})
export class CreateAdmissionCriteriaComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for admissionCriteria Form
  admissionCriteriaForm: FormGroup;

  // admissionCriteria Model
  admissionCriteria: IAdmissionCriteria = {} as IAdmissionCriteria;

  title = 'Create Admission Criteria'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    programId: {
      required: 'Program is required.'
    },
    description: {
      required: 'Description is required.'
    },
    qualificationId: {
      required: 'Qualification is required.'
    },
    subjectId: {
      required: 'Subject is required.'
    },
    qualificationRequriedMarks: {
      required: 'Qualification Marks are required.'
    },
    isEntryTestRequired: {
      required: 'Entry Test is required.'
    },
    entryTestDate: {
      required: 'Entry Test Date is required.'
    },
    entryTestRequriedMarks: {
      required: 'Entry Test Marks are required.'
    },
    interviewDate: {
      required: 'Interview Date is required.'
    },
    isInterviewRequired: {
      required: 'Interview is required.',
    },
  }

  // error keys
  formErrors = {
    programId: '',
    description: '',
    qualificationId: '',
    subjectId: '',
    qualificationRequriedMarks: '',
    isEntryTestRequired: '',
    entryTestDate: '',
    entryTestRequriedMarks: '',
    interviewDate: '',
    isInterviewRequired: '',
  }

  // Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateAdmissionCriteriaComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.admissionCriteriaForm = this.fb.group({
      programId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      qualificationId: ['', [Validators.required]],
      subjectId: ['', [Validators.required]],
      qualificationRequriedMarks: ['', [Validators.required]],
      isEntryTestRequired: ['', [Validators.required]],
      entryTestDate: ['', [Validators.required]],
      entryTestRequriedMarks: ['', [Validators.required]],
      interviewDate: ['', [Validators.required]],
      isInterviewRequired: ['', [Validators.required]],

    });

    if (this._id) {
      // TODO: check admissionCriteria edit permission
      this.showButtons = (this.permission.isGranted(this.permissions.ADMISSION_CRITERIA_EDIT));
      this.title = 'Edit Admission Criteria'
      this.isLoading = true
      this.getAdmissionCriteria(this._id);
    }

    // Get Data from Store
    this.ngxsService.getProgramsFromState();
    this.ngxsService.getSubjectFromState();
    this.ngxsService.getQualificationFromState();
  }

  getAdmissionCriteria(id: number) {
    this.ngxsService.admissionCriteriaService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (admissionCriteria) => {
          this.editAdmissionCriteria(admissionCriteria.result);
          this.admissionCriteria = admissionCriteria.result;
        }
      );
  }

//  Edit admissionCriteria form
  editAdmissionCriteria(admissionCriteria: IAdmissionCriteria) {
    this.admissionCriteriaForm.patchValue({
      id: admissionCriteria.id,
      programId: admissionCriteria.programId,
      description: admissionCriteria.description,
      qualificationId: admissionCriteria.qualificationId,
      qualificationRequriedMarks: admissionCriteria.qualificationRequriedMarks,
      subjectId: admissionCriteria.subjectId,
      isEntryTestRequired: admissionCriteria.isEntryTestRequired,
      entryTestDate: admissionCriteria.entryTestDate,
      entryTestRequriedMarks: admissionCriteria.entryTestRequriedMarks,
      interviewDate: admissionCriteria.interviewDate,
      isInterviewRequired: admissionCriteria.isInterviewRequired,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.admissionCriteriaForm.disable();
    }
  }

  onSubmit() {
    if (this.admissionCriteriaForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    if (this.admissionCriteria.id) {
      this.ngxsService.admissionCriteriaService.update(this.admissionCriteria)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            // this.ngxsService.store.dispatch(new IsReloadRequired(FeeItemState, true))
            this.toastService.success('Updated Successfully', 'Admission Criteria')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.admissionCriteria.id;
      this.ngxsService.admissionCriteriaService.create(this.admissionCriteria)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            // this.ngxsService.store.dispatch(new IsReloadRequired(FeeItemState, true))
            this.toastService.success('Created Successfully', 'Admission Criteria')
            this.onCloseDialog();
          }
        );
    }
  }

// map form values to the admissionCriteria model
  mapFormValueToClientModel() {
    this.admissionCriteria.programId = this.admissionCriteriaForm.value.programId;
    this.admissionCriteria.description = this.admissionCriteriaForm.value.description;
    this.admissionCriteria.qualificationId = this.admissionCriteriaForm.value.qualificationId;
    this.admissionCriteria.qualificationRequriedMarks = this.admissionCriteriaForm.value.qualificationRequriedMarks;
    this.admissionCriteria.subjectId = this.admissionCriteriaForm.value.subjectId;
    this.admissionCriteria.isEntryTestRequired = this.admissionCriteriaForm.value.isEntryTestRequired;
    this.admissionCriteria.entryTestDate = this.transformDate(this.admissionCriteriaForm.value.entryTestDate, 'yyyy-MM-dd');
    this.admissionCriteria.entryTestRequriedMarks = this.admissionCriteriaForm.value.entryTestRequriedMarks;
    this.admissionCriteria.interviewDate = this.transformDate(this.admissionCriteriaForm.value.interviewDate, 'yyyy-MM-dd');
    this.admissionCriteria.isInterviewRequired = this.admissionCriteriaForm.value.isInterviewRequired;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
