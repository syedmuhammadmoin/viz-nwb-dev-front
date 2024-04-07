import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { IFaculty } from '../model/IFaculty';
import { FacultyService } from '../service/faculty.service';
import { FacultyState } from '../store/faculty.state';

@Component({
  selector: 'kt-create-faculty',
  templateUrl: './create-faculty.component.html',
  styleUrls: ['./create-faculty.component.scss']
})
export class CreateFacultyComponent extends AppComponentBase implements OnInit {

 // for permissions
 public permissions = Permissions;

 //Loader
 isLoading: boolean;

 //variable for Faculty Form
 FacultyForm: FormGroup;

 //Faculty Model
 Faculty: IFaculty= {} as IFaculty;

 isEditButtonShow: boolean = false;

 title: string = 'Create Faculty';

 //for resetting form
 @ViewChild('formDirective') private formDirective: NgForm;

 //validation messages
 validationMessages = {
  faculty: {
    required: 'Faculty Name is required.'
  }
 }

 //error keys
 formErrors: any = {
  faculty: '',
 }

 //Injecting dependencies
 constructor(
   @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
   public dialogRef: MatDialogRef<CreateFacultyComponent>,
   private fb: FormBuilder,    
   private facultyService:FacultyService,
   public ngxsService:NgxsCustomService,
   public addButtonService:AddModalButtonService,
   private cdRef : ChangeDetectorRef,
   injector: Injector) {
   super(injector);   
 }

 ngOnInit() {
   this.FacultyForm = this.fb.group({
    faculty: ['', [Validators.required]],
   });

   if (this._id) {
    this.isEditButtonShow = true;
    this.title = 'Faculty Detail';
    //disable all fields

    this.isLoading = true;
    this.FacultyForm.disable();
    this.getFaculty(this._id);
  } else {
    this.Faculty = {
      id: null,
      name: ''
    };
  }

   //Get Data from Store
   this.ngxsService.getFacultyFromState();
 }

  //Edit Form
  toggleEdit() {
    this.isEditButtonShow = false;
    this.title = 'Edit Faculty'
    this.FacultyForm.enable()
  }

 getFaculty(id: number) {
   this.ngxsService.facultyService.getFacultyById(id)
   .pipe(
     take(1),
      finalize(() => {
       this.isLoading = false;
       this.cdRef.detectChanges();
      })
    )
     .subscribe(
       (faculty: IApiResponse<IFaculty>) => {
         this.editFaculty(faculty.result);
         this.Faculty = faculty.result;
       }
     );
 }

 //  Edit Faculty form
 editFaculty(Faculty: IFaculty) {
   this.FacultyForm.patchValue({
     id: Faculty.id,
     faculty: Faculty.name,
   });

   
 }

 onSubmit() {
   if (this.FacultyForm.invalid) {
     return;
   }
   this.isLoading = true;
   this.mapFormValueToClientModel();

   if (this.Faculty.id) {
     this.isLoading = true;
     this.facultyService.updateFaculty(this.Faculty)
     .pipe(
       take(1),
        finalize(() => {
         this.isLoading = false;
         this.cdRef.detectChanges();
        })
      )
       .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired(FacultyState, true))
          this.toastService.success('Update Successfully', 'Faculty')
          this.onCloseDialog();
        }
       );
   } else {
     delete this.Faculty['id'];
     this.isLoading = true;
     this.ngxsService.facultyService.createFaculty(this.Faculty)
     .pipe(
       take(1),
        finalize(() => {
         this.isLoading = false;
         this.cdRef.detectChanges();
        })
      )
       .subscribe(() => {          
          this.ngxsService.store.dispatch(new IsReloadRequired(FacultyState, true))
          this.toastService.success('Created Successfully', 'Faculty')
          this.onCloseDialog();
        }
       );
   }
 }

// map form values to the warehouse model
 mapFormValueToClientModel() {
   this.Faculty.name = this.FacultyForm.value.faculty;
 }

 reset() {
   this.formDirective.resetForm();
 }

 // Dialogue close function
 onCloseDialog() {
   this.dialogRef.close();
 }
}


