import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IBatch } from '../model/IBatch';

@Component({
  selector: 'kt-create-batch-type',
  templateUrl: './create-batch-type.component.html',
  styleUrls: ['./create-batch-type.component.scss']
})
export class CreateBatchTypeComponent extends AppComponentBase implements OnInit {

 // for permissions
 public permissions = Permissions;

 //Loader
 isLoading: boolean;

 //variable for warehouse Form
 BatchTypeForm: FormGroup;

 //warehouse Model
 BatchType: IBatch= {} as IBatch;

 title: string = 'Create BatchType'

 //show Buttons
 showButtons: boolean = true; 

 //for resetting form
 @ViewChild('formDirective') private formDirective: NgForm;

 //validation messages
 validationMessages = {
  batchType: {
     required: 'BatchType is required.'
   }
 }

 //error keys
 formErrors = {
  batchType: '',
 }

 //Injecting dependencies
 constructor(
   @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
   public dialogRef: MatDialogRef<CreateBatchTypeComponent>,
   private fb: FormBuilder,    
   public ngxsService:NgxsCustomService,
   public addButtonService:AddModalButtonService,
   private cdRef : ChangeDetectorRef,
   injector: Injector) {
   super(injector);   
 }

 ngOnInit() {
   this.BatchTypeForm = this.fb.group({
     batchType: ['', [Validators.required]],
   });

  //  if (this._id) {
  //    this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT)) ? true : false;
  //    this.title = 'Edit Faculty'
  //    this.isLoading = true
  //    this.getFaculty(this._id);
  //  } 

   //Get Data from Store
   this.ngxsService.getCampusFromState();
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
 editFaculty(BatchType: IBatch) {
   this.BatchTypeForm.patchValue({
     id: BatchType.id,
     batchType: BatchType.batchType,
   });

   //if user have no permission to edit, so disable all fields
   if(!this.showButtons) {
     this.BatchTypeForm.disable();
   }
 }

 onSubmit() {
   if (this.BatchTypeForm.invalid) {
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
   this.BatchType.batchType = this.BatchTypeForm.value.batchType;
 }

 reset() {
   this.formDirective.resetForm();
 }

 // Dialogue close function
 onCloseDialog() {
   this.dialogRef.close();
 }
}

