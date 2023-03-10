import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IBatch } from '../model/IBatch';

@Component({
  selector: 'kt-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss']
})
export class CreateBatchComponent extends AppComponentBase implements OnInit {



 // for permissions
 public permissions = Permissions;

 //Loader
 isLoading: boolean;

 //variable for warehouse Form 
 BatchForm: FormGroup;

 //warehouse Model
 Batch: IBatch= {} as IBatch;

 title: string = 'Create Batch'

 //show Buttons
 showButtons: boolean = true; 

 //for resetting form
 @ViewChild('formDirective') private formDirective: NgForm;

 //validation messages
 validationMessages = {
  batch: {
    required: 'Batch name is required.'
  },
  batchType: {
    required: 'BatchType is required.'
  }
 }

 //error keys
 formErrors = {
  batch: '',
  batchType: ''
 }

 //Injecting dependencies
 constructor(
   @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
   public dialogRef: MatDialogRef<CreateBatchComponent>,
   private fb: FormBuilder,    
   public ngxsService:NgxsCustomService,
   public addButtonService:AddModalButtonService,
   private cdRef : ChangeDetectorRef,
   injector: Injector) {
   super(injector);   
 }

 ngOnInit() {
   this.BatchForm = this.fb.group({
    batch: ['', [Validators.required]],
    batchType: ['', [Validators.required]],
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
 editFaculty(Batch: IBatch) {
   this.BatchForm.patchValue({
     id: Batch.id,
     batch: Batch.batch,
     batchType: Batch.batchTypeId
   });

   //if user have no permission to edit, so disable all fields
   if(!this.showButtons) {
     this.BatchForm.disable();
   }
 }

 onSubmit() {
   if (this.BatchForm.invalid) {
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
   this.Batch.batch = this.BatchForm.value.batch;
   this.Batch.batchTypeId = this.BatchForm.value.batchType;
 }

 reset() {
   this.formDirective.resetForm();
 }

 // Dialogue close function
 onCloseDialog() {
   this.dialogRef.close();
 }
}
