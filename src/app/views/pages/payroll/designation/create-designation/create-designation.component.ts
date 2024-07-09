import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { finalize, take} from "rxjs/operators";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { IDesignationModel } from '../model/IDesignationModel';
import { DesignationState } from '../store/designation.store';
import { DesignationService } from '../service/designation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-create-designation',
  templateUrl: './create-designation.component.html',
  styleUrls: ['./create-designation.component.scss']
})
export class CreateDesignationComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean

  //employee form declaration
  designationForm: FormGroup;

  //employee model declaration
  designation: IDesignationModel = {} as IDesignationModel;
  

  title: string = 'Create Designation'

  permissions = Permissions

  //show Buttons
  showButtons: boolean = true;

  // validation messages
  validationMessages = {
    Name: {
      required : 'Designation Name is Required.'
    },   
  };

  //error keys
  formErrors: any = {
    Name: '',
  };

  dateLimit: Date = new Date()

  //Injecting Dependencies
  constructor(private fb: FormBuilder,
    public  designationService: DesignationService,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateDesignationComponent>,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.designationForm = this.fb.group({
      Name: ['', [Validators.required]],     
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.DEPARTMENTS_EDIT)) ? true : false;
      this.title = 'Edit Designation'
      this.isLoading = true
       this.getDesignation(this._id);
    }

    
  }

  //Getting designation values for update
  getDesignation(id: number) {
    this.designationService.getdesignationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((employee: IApiResponse<any>) => {
          this.editDesignation(employee.result)
        }
      );
  }

  // Patching values to  designation form
  editDesignation(designation:any) {
    
    this.designationForm.patchValue({
      Name: designation.name,     
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.designationForm.disable();
    }
  }

 employeeData :any =[]
  onSubmit() {
    if (this.designationForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValueToDesignationModel();
    this.employeeData.push(this.designation);
    if (this.designation.id) {
      this.designationService.updateDesignation(this.designation)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(DesignationState, true))
            this.toastService.success('Updated Successfully', 'Designation')
            this.onCloseDialog();
          }
      );
    }else {
      delete this.designation['id'];     
      this.designationService.addDesignation(this.employeeData)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
        () => {
          this.ngxsService.store.dispatch(new IsReloadRequired (DesignationState , true))
          this.toastService.success('Created Successfully', 'Designation')
          this.onCloseDialog()
        }
      );
    }
  }

  // Mapping values from Employee form to  employee model
  mapFormValueToDesignationModel() {
    this.designation.id = this._id;
    this.designation.Name = this.designationForm.value.Name;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }


}
