import { ChangeDetectorRef, Component, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IDepartment } from '../model/IDepartment';

@Component({
  selector: 'kt-create-addmission-department',
  templateUrl: './create-addmission-department.component.html',
  styleUrls: ['./create-addmission-department.component.scss']
})
export class CreateAddmissionDepartmentComponent extends AppComponentBase implements OnInit {


 // for permissions
 public permissions = Permissions;

 //Loader
 isLoading: boolean;

 //variable for warehouse Form
 AdmissionDepartmentForm: FormGroup;

 //warehouse Model
 Department: IDepartment= {} as IDepartment;

 title: string = 'Create Department'

 //show Buttons
 showButtons: boolean = true; 

 //for resetting form
 @ViewChild('formDirective') private formDirective: NgForm;

 //validation messages
 validationMessages = {
  facultyId: {
    required: 'Faculty Name is required.'
  },
  department: {
    required: 'Department is required.'
  }
 }

 //error keys
 formErrors = {
  facultyId: '',
  department: ''
 }

 //Injecting dependencies
 constructor(
   @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
   public dialogRef: MatDialogRef<CreateAddmissionDepartmentComponent>,
   private fb: FormBuilder,    
   public ngxsService:NgxsCustomService,
   public addButtonService:AddModalButtonService,
   private cdRef : ChangeDetectorRef,
   injector: Injector) {
   super(injector);   
 }

 ngOnInit() {
   this.AdmissionDepartmentForm = this.fb.group({
    facultyId: ['', [Validators.required]],
    department: ['', [Validators.required]],
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
 editFaculty(Department: IDepartment) {
   this.AdmissionDepartmentForm.patchValue({
     id: Department.id,
     facultyId: Department.facultyId,
     department: Department.department
   });

   //if user have no permission to edit, so disable all fields
   if(!this.showButtons) {
     this.AdmissionDepartmentForm.disable();
   }
 }

 onSubmit() {
   if (this.AdmissionDepartmentForm.invalid) {
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
   this.Department.facultyId = this.AdmissionDepartmentForm.value.faculty;
 }

 reset() {
   this.formDirective.resetForm();
 }

 // Dialogue close function
 onCloseDialog() {
   this.dialogRef.close();
 }
}

