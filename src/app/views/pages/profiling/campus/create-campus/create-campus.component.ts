import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { IsReloadRequired } from '../../store/profiling.action';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICampus } from '../model/ICampus';
import { CampusState } from '../store/campus.state';
import { Permissions } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-create-campus',
  templateUrl: './create-campus.component.html',
  styleUrls: ['./create-campus.component.scss']
})

export class CreateCampusComponent extends AppComponentBase implements OnInit {

  //busy loading
  isLoading: boolean

  // campus form declaration
  campusForm: FormGroup;

  // campus model declaration
  campusModel: ICampus;

  permissions = Permissions

  title: string = 'Create Campus'

  //show Buttons
  showButtons: boolean = true; 

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Name is required.',
    }
  };

  //error keys
  formErrors = {
    name: ''
  };

  constructor(private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() public dialogRef: MatDialogRef<CreateCampusComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.campusForm = this.fb.group({
      name: ['', Validators.required]
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.CAMPUS_EDIT)) ? true : false;
      this.title = 'Edit Campus'
      this.isLoading = true
      this.getCampus(this._id);
    } else {
      this.campusModel = {
        id: null,
        name: '',
      }
    }

    this.ngxsService.getAccountLevel4FromState()
  }

  // Getting Campus Model values for update
  getCampus(id: number) {
    this.ngxsService.campusService.getCampusById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (campus: IApiResponse<ICampus>) => {
          this.editCampus(campus.result);
          this.campusModel = campus.result;
        }
      );
  }

  // Patching values to campus form
  editCampus(campus: ICampus) {
    this.campusForm.patchValue({
      id: campus.id,
      name: campus.name
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.campusForm.disable();
    }
  }

  onSubmit() {
    if (this.campusForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToCampusModel();
    if (this.campusModel.id) {
      this.ngxsService.campusService.updateCampus(this.campusModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CampusState, true))
            this.toastService.success('Updated Successfully', 'Campus')
            this.onCloseDialog();
          }
      );
    } else {
      delete this.campusModel.id;
      this.ngxsService.campusService.addCampus(this.campusModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {        
            this.ngxsService.store.dispatch(new IsReloadRequired(CampusState, true))
            this.toastService.success('Added Successfully', 'Campus')
            this.onCloseDialog();
          }
      );
    }
  }

  // Mapping values from campus form to campus model
  mapFormValueToCampusModel() {
    this.campusModel.name = this.campusForm.value.name;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}

