import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {AcademicDepartmentService} from '../service/academic-department.service';
import {finalize, take} from 'rxjs/operators';
import {ICreateAcademicDepartment} from '../model/ICreateAcademicDepartment';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import {FeeItemState} from '../../fee-item/store/fee-item.state';
import {AcademicDepartmentState} from '../store/academic-department.state';

@Component({
  selector: 'kt-create-academic-department',
  templateUrl: './create-academic-department.component.html',
  styleUrls: ['./create-academic-department.component.scss']
})
export class CreateAcademicDepartmentComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  //variable for SubjectForm
  AcademicDepartmentForm: FormGroup;

  //Department Model
  AcademicDepartment: ICreateAcademicDepartment = {} as ICreateAcademicDepartment;

  title: string = 'Create Academic Department'

  //show Buttons
  isEditButtonShow: boolean = false;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //validation messages
  validationMessages = {
    facultyId: {
      required: 'Faculty Name is required.'
    },
    AcademicDepartment: {
      required: 'Academic Department is required.'
    }
  }

  //error keys
  formErrors = {
    facultyId: '',
    AcademicDepartment: ''
  }

  //Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateAcademicDepartmentComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    private academicDepartmentService: AcademicDepartmentService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.AcademicDepartmentForm = this.fb.group({
      facultyId: ['', [Validators.required]],
      AcademicDepartment: ['', [Validators.required]],
    });

    console.log(this.editAcademicDepartment);


    if (this._id) {
      this.isEditButtonShow = true;
      this.title = 'Academic Department Detail';

      //disable all fields
      this.isLoading = true;
      this.AcademicDepartmentForm.disable();
      this.getAcademicDepartment(this._id);
    } else {
      this.AcademicDepartment = {
        id: null,
        name: '',
        facultyId: null
      };
    }
    //Get Data from Store
    this.ngxsService.getFacultyFromState();
  }

  //Edit Form
  toggleEdit() {
    this.isEditButtonShow = false;
    this.title = 'Edit Academic Department'
    this.AcademicDepartmentForm.enable()
  }

  getAcademicDepartment(id: number) {
    this.academicDepartmentService.getAcademicDepartmentById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (res) => {
          this.editAcademicDepartment(res.result),
            this.AcademicDepartment = res.result;
          console.log(res, 'this is getDrpartment');
        }
      );
  }

//  Edit AcademicDepartment form
  editAcademicDepartment(ADepartment: ICreateAcademicDepartment) {
    this.AcademicDepartmentForm.patchValue({
      id: ADepartment.id,
      facultyId: ADepartment.facultyId,
      AcademicDepartment: ADepartment.name
    });

  };

  onSubmit() {

    if (this.AcademicDepartmentForm.invalid) {
      return;
    }

    this.isLoading = true
    this.mapFormValueToClientModel();

    if (this.AcademicDepartment.id) {
      this.isLoading = true;
      this.academicDepartmentService.updateAcademicDepartment(this.AcademicDepartment)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired(AcademicDepartmentState, true))
          this.toastService.success('Update Successfully', 'Academic Department')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.AcademicDepartment['id'];
      this.isLoading = true;
      this.academicDepartmentService.createAcademicDepartment(this.AcademicDepartment)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res) => {
          this.ngxsService.store.dispatch(new IsReloadRequired(AcademicDepartmentState, true))
          this.toastService.success('Created Successfully', 'Academic Department');
          this.onCloseDialog();
        });

    }
  }

// map form values to the academivDepartment model
  mapFormValueToClientModel() {
    this.AcademicDepartment.name = this.AcademicDepartmentForm.value.AcademicDepartment;
    this.AcademicDepartment.facultyId = this.AcademicDepartmentForm.value.facultyId;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
