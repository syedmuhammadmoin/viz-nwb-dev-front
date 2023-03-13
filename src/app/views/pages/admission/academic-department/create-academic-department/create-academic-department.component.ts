import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IAcademicDepartment } from '../model/IAcademicDepartment';

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

 //variable for warehouse Form
 AcademicDepartmentForm: FormGroup;

 //Department Model
 AcademicDepartment: IAcademicDepartment= {} as IAcademicDepartment;

 title: string = 'Create Academic Department'

 //show Buttons
 showButtons: boolean = true; 

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
   public ngxsService:NgxsCustomService,
   public addButtonService:AddModalButtonService,
   private cdRef : ChangeDetectorRef,
   injector: Injector) {
   super(injector);   
 }

 ngOnInit() {
   this.AcademicDepartmentForm = this.fb.group({
    facultyId: ['', [Validators.required]],
    AcademicDepartment: ['', [Validators.required]],
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

//  Edit AcademicDepartment form
 editAcademicDepartment(ADepartment: IAcademicDepartment) {
   this.AcademicDepartmentForm.patchValue({
     id: ADepartment.id,
     facultyId: ADepartment.facultyId,
     AcademicDepartment: ADepartment.AcademicDepartment
   });

   //if user have no permission to edit, so disable all fields
   if(!this.showButtons) {
     this.AcademicDepartmentForm.disable();
   }
 }

 onSubmit() {
   if (this.AcademicDepartmentForm.invalid) {
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
   this.AcademicDepartment.facultyId = this.AcademicDepartmentForm.value.faculty;
   this.AcademicDepartment.AcademicDepartment = this.AcademicDepartmentForm.value.AcademicDepartment;
 }

 reset() {
   this.formDirective.resetForm();
 }

 // Dialogue close function
 onCloseDialog() {
   this.dialogRef.close();
 }
}

