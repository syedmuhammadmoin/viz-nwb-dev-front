import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { IsReloadRequired } from '../../store/profiling.action';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICampus } from '../model/ICampus';
import { CampusState } from '../store/campus.state';

@Component({
  selector: 'kt-create-campus',
  templateUrl: './create-campus.component.html',
  styleUrls: ['./create-campus.component.scss'],
  providers:[NgxsCustomService]
})

export class CreateCampusComponent extends AppComponentBase implements OnInit {

  //busy loading
  isLoading: boolean

  // campus form declaration
  campusForm: FormGroup;

  // campus model declaration
  campusModel: ICampus;

  title: string = 'Create Campus'

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
      .subscribe(
        (campus: IApiResponse<ICampus>) => {
          this.isLoading = false;
          this.editCampus(campus.result);
          this.campusModel = campus.result;
        },
        (err) => console.log(err)
      );
  }

  // Patching values to campus form
  editCampus(campus: ICampus) {
    this.campusForm.patchValue({
      id: campus.id,
      name: campus.name
    });
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
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(CampusState, true))
            this.toastService.success('Updated Successfully', 'Campus')
            this.onCloseDialog();
          },       
        (err) => this.toastService.error('Something went wrong', 'Campus')
      );
    } else {
      delete this.campusModel.id;
      this.ngxsService.campusService.addCampus(this.campusModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {        
            this.ngxsService.store.dispatch(new IsReloadRequired(CampusState, true))
            this.toastService.success('Added Successfully', 'Campus')
            this.onCloseDialog();
          },
       
        (err) => this.toastService.error('Something went wrong', 'Campus')
      );
    }
  }

  // Mapping values from campus form to campus model
  mapFormValueToCampusModel() {
    this.campusModel.name = this.campusForm.value.name;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}

