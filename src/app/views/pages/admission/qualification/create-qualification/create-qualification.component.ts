import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { IQualification } from '../model/IQualification';
import { QualificationService } from '../service/qualification.service';
import { QualificationState } from '../store/qualification.state';

@Component({
  selector: 'kt-create-qualification',
  templateUrl: './create-qualification.component.html',
  styleUrls: ['./create-qualification.component.scss']
})
export class CreateQualificationComponent extends AppComponentBase implements OnInit {

  // for permissions
  public permissions = Permissions;
 
  //Loader
  isLoading: boolean;
 
  //variable for qualification Form
  QualificationForm: FormGroup;
 
  //Qualification Model
  qualificationModel: IQualification= {} as IQualification;
 
  isEditButtonShow: boolean = false;
 
  title: string = 'Create Qualification';
 
  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
 
  //validation messages
  validationMessages = {
    qualification: {
      required: 'Qualification Name is required.'
    }
  }
 
  //error keys
  formErrors: any = {
    qualification: '',
  }
 
  //Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateQualificationComponent>,
    private fb: FormBuilder,    
    private qualificationService:QualificationService,
    public ngxsService:NgxsCustomService,
    public addButtonService:AddModalButtonService,
    private cdRef : ChangeDetectorRef,
    injector: Injector) {
    super(injector);   
  }
 
  ngOnInit() {
    this.QualificationForm = this.fb.group({
      qualification: ['', [Validators.required]],
    });
 
    if (this._id) {
     this.isEditButtonShow = true;
     this.title = 'Qualification Detail';
     //disable all fields
 
     this.isLoading = true;
     this.QualificationForm.disable();
     this.getQualification(this._id);
   } else {
     this.qualificationModel = {
       id: null,
       name: ''
     };
   }
 
    //Get Data from Store
    this.ngxsService.getQualificationFromState();
  }
 
   //Edit Form
   toggleEdit() {
     this.isEditButtonShow = false;
     this.title = 'Edit Qualification'
     this.QualificationForm.enable()
   }
 
  getQualification(id: number) {
    this.ngxsService.qualificationService.getQualificationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (qualification: IApiResponse<IQualification>) => {
          this.editQualification(qualification.result);
          this.qualificationModel = qualification.result;
        }
      );
  }
 
  //  Edit Qualification form
  editQualification(qualification: IQualification) {
    this.QualificationForm.patchValue({
      id: qualification.id,
      qualification: qualification.name,
    });
 
    
  }
 
  onSubmit() {
    if (this.QualificationForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
 
    if (this.qualificationModel.id) {
      this.isLoading = true;
      this.qualificationService.updateQualification(this.qualificationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
           this.ngxsService.store.dispatch(new IsReloadRequired(QualificationState, true))
           this.toastService.success('Update Successfully', 'Qualification')
           this.onCloseDialog();
         }
        );
    } else {
      delete this.qualificationModel['id'];
      this.isLoading = true;
      this.ngxsService.qualificationService.createQualification(this.qualificationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {          
           this.ngxsService.store.dispatch(new IsReloadRequired(QualificationState, true))
           this.toastService.success('Created Successfully', 'Qualification')
           this.onCloseDialog();
         }
        );
    }
  }
 
 // map form values to the warehouse model
  mapFormValueToClientModel() {
    this.qualificationModel.name = this.QualificationForm.value.qualification;
  }
 
  reset() {
    this.formDirective.resetForm();
  }
 
  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

}
 
 

