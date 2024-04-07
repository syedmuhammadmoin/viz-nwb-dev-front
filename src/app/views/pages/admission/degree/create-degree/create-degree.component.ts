import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { IDegree } from '../model/IDegree';
import { DegreeService } from '../service/degree.service';
import { DegreeState } from '../store/degree.state';

@Component({
  selector: 'kt-create-degree',
  templateUrl: './create-degree.component.html',
  styleUrls: ['./create-degree.component.scss']
})
export class CreateDegreeComponent extends AppComponentBase implements OnInit {

  // for permissions
  public permissions = Permissions;
 
  //Loader
  isLoading: boolean;
 
  //variable for Degree Form
  DegreeForm: FormGroup;
 
  //Degree Model
  DegreeModel: IDegree= {} as IDegree;
 
  isEditButtonShow: boolean = false;
 
  title: string = 'Create Degree';
 
  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
 
  //validation messages
  validationMessages = {
    degreeName: {
     required: 'Degree name is required.'
   }
  }
 
  //error keys
  formErrors: any = {
    degreeName: '',
  }
 
  //Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateDegreeComponent>,
    private fb: FormBuilder,    
    private degreeService:DegreeService,
    public ngxsService:NgxsCustomService,
    public addButtonService:AddModalButtonService,
    private cdRef : ChangeDetectorRef,
    injector: Injector) {
    super(injector);   
  }
 
  ngOnInit() {
    this.DegreeForm = this.fb.group({
      degreeName: ['', [Validators.required]],
    });
 
    if (this._id) {
     this.isEditButtonShow = true;
     this.title = 'Degree Detail';
     //disable all fields
 
     this.isLoading = true;
     this.DegreeForm.disable();
     this.getDegree(this._id);
   } else {
     this.DegreeModel = {
       id: null,
       name: ''
     };
   }
 
    //Get Data from Store
    this.ngxsService.getDegreeFromState();
  }
 
   //Edit Form
   toggleEdit() {
     this.isEditButtonShow = false;
     this.title = 'Edit Degree'
     this.DegreeForm.enable()
   }
 
  getDegree(id: number) {
    this.ngxsService.degreeService.getDegreeId(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (degree: IApiResponse<IDegree>) => {
          this.editDegree(degree.result);
          this.DegreeModel = degree.result;
        }
      );
  }
 
  //  Edit Degree form
  editDegree(degree: IDegree) {
    this.DegreeForm.patchValue({
      id: degree.id,
      degreeName: degree.name,
    });
 
  }
 
  onSubmit() {

    if (this.DegreeForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValueToClientModel();
 
    if (this.DegreeModel.id) {
      this.isLoading = true;
      this.degreeService.updateDegree(this.DegreeModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
           this.ngxsService.store.dispatch(new IsReloadRequired(DegreeState, true))
           this.toastService.success('Update Successfully', 'Degree')
           this.onCloseDialog();
         }
        );
    } else {
      delete this.DegreeModel['id'];
      this.isLoading = true;
      this.ngxsService.degreeService.createDegree(this.DegreeModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {          
           this.ngxsService.store.dispatch(new IsReloadRequired(DegreeState, true))
           this.toastService.success('Created Successfully', 'Degree')
           this.onCloseDialog();
         }
        );
    }
  }
 
 // map form values to the warehouse model
  mapFormValueToClientModel() {
    this.DegreeModel.name = this.DegreeForm.value.degreeName;
  }
 
  reset() {
    this.formDirective.resetForm();
  }
 
  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
  
}
 
 
 