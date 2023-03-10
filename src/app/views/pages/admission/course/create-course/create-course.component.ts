import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ICourse } from '../model/ICourse';

@Component({
  selector: 'kt-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent extends AppComponentBase  implements OnInit {


 // for permissions
 public permissions = Permissions;

 //Loader
 isLoading: boolean;

 //variable for warehouse Form
 CourseForm: FormGroup;

 //warehouse Model
 Course: ICourse= {} as ICourse;

 title: string = 'Create Course'

 //show Buttons
 showButtons: boolean = true; 

 //for resetting form
 @ViewChild('formDirective') private formDirective: NgForm;

 //validation messages
 validationMessages = {
  course: {
    required: 'Course is required.'
  },
  courseCode:{
    required: 'Course Code is required.'
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

 //error keys
 formErrors = {
  course: '',
  courseCode: '',
  creditHour: '',
  totalMarks: ''
 }

 //Injecting dependencies
 constructor(
   @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
   public dialogRef: MatDialogRef<CreateCourseComponent>,
   private fb: FormBuilder,    
   public ngxsService:NgxsCustomService,
   public addButtonService:AddModalButtonService,
   private cdRef : ChangeDetectorRef,
   injector: Injector) {
   super(injector);   
 }

 ngOnInit() {
   this.CourseForm = this.fb.group({
    course: ['', [Validators.required]],
    courseCode: ['', [Validators.required]],
    creditHour: ['', [Validators.required, Validators.min(0)]],
    totalMarks: ['', [Validators.required,Validators.min(0)]]
   });

  //  if (this._id) {
  //    this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT)) ? true : false;
  //    this.title = 'Edit Faculty'
  //    this.isLoading = true
  //    this.getFaculty(this._id);
  //  } 

   //Get Data from Store
  //  this.ngxsService.getCampusFromState();
 }

//  getFaculty(id: number) {
//    this.ngxsService.warehouseService.getWarehouse(id)
//    .pipe(
//      take(1),
//       finalize(() => {
//        this.isLoading = false;
//        this.cdRef.detectChanges();
//       })
//     )
//      .subscribe(
//        (warehouse: IApiResponse<IWarehouse>) => {
//          this.editWarehouse(warehouse.result);
//          this.warehouse = warehouse.result;
//        }
//      );
//  }

//  Edit Warehouse form
 editFaculty(Course: ICourse) {
   this.CourseForm.patchValue({
     id: Course.id,
     course: Course.course,
     courseCode:Course.courseCode,
     creditHour: Course.creditHour,
     totalMarks: Course.totalMarks,
   });

   //if user have no permission to edit, so disable all fields
   if(!this.showButtons) {
     this.CourseForm.disable();
   }
 }

 onSubmit() {
   if (this.CourseForm.invalid) {
     return;
   }
   this.isLoading = true;
   this.mapFormValueToClientModel();
  //  if (this.warehouse.id) {
  //    this.ngxsService.warehouseService.updateWarehouse(this.warehouse)
  //    .pipe(
  //      take(1),
  //       finalize(() => {
  //        this.isLoading = false;
  //        this.cdRef.detectChanges();
  //       })
  //     )
  //      .subscribe(() => {            
  //          this.ngxsService.store.dispatch(new IsReloadRequired(WarehouseState, true))
  //          this.toastService.success('Updated Successfully', 'Store')
  //          this.onCloseDialog();
  //        }
  //      );
  //  } else {
  //    delete this.warehouse.id;
  //    this.ngxsService.warehouseService.addWarehouse(this.warehouse)
  //    .pipe(
  //      take(1),
  //       finalize(() => {
  //        this.isLoading = false;
  //        this.cdRef.detectChanges();
  //       })
  //     )
  //      .subscribe(() => {          
  //          this.ngxsService.store.dispatch(new IsReloadRequired(WarehouseState, true))
  //          this.toastService.success('Created Successfully', 'Store')
  //          this.onCloseDialog();
  //        }
  //      );
  //  }
 }
// map form values to the warehouse model
 mapFormValueToClientModel() {
   this.Course.course = this.CourseForm.value.course;
   this.Course.courseCode = this.CourseForm.value.courseCode;
   this.Course.creditHour = this.CourseForm.value.creditHour;
   this.Course.totalMarks = this.CourseForm.value.totalMarks;
 }

 reset() {
   this.formDirective.resetForm();
 }

 // Dialogue close function
 onCloseDialog() {
   this.dialogRef.close();
 }
}


