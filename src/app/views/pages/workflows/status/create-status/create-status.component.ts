import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IStatus } from '../model/IStatus';
import { StatusService } from '../service/status.service';

@Component({
  selector: 'kt-create-status',
  templateUrl: './create-status.component.html',
  styleUrls: ['./create-status.component.scss']
})
export class CreateStatusComponent extends AppComponentBase implements OnInit {

  workflowStates = AppConst.workflowStates
  titleName: string = "Create Status";
  //For Loading
  isLoading: boolean;
  //Hide Submit And Cancel button
  isEditButtonShow: boolean = false;
  //state form variable
  statusForm: FormGroup;

  //state Model
  statusModel: IStatus;


  //Error Messages
  validationMessages = {
    status: {
      required: 'Status is required!'
    },
    state: {
      required: 'State is required'
    },
  }

  //Error keys
  formErrors = {
    status: '',
    state: '',
  }

  constructor(
    private fb: FormBuilder,
    private statusService: StatusService,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateStatusComponent>,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit() {
    this.statusForm = this.fb.group({
      status: ['', [Validators.required]],
      state: ['', [Validators.required]]
    })

    if (this._id) {
      this.isEditButtonShow = true;
      this.titleName = 'Status Details';
      //disable all fields

      this.isLoading = true;
      this.statusForm.disable();
      this.getStatus(this._id);
    } else {
      this.statusModel = {
        id: null,
        status: '',
        state: null,
      };
    }
  }

  //Edit Form
  toggleEdit() {
    this.isEditButtonShow = false;
    this.titleName = 'Edit Status'
    this.statusForm.enable()
  }

  //Get state by id
  getStatus(id: number) {
    this.statusService.getStatus(id)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.editState(res.result),
            this.statusModel = res.result;
        },
        (err: any) => console.log(err)
      );
  }

  //Edit state
  editState(status: IStatus) {
    this.statusForm.patchValue({
      id: status.id,
      status: status.status,
      state: status.state,
    });
  }

  //submitting state Form
  onSubmit() {
    console.log('submitted');
    if (this.statusForm.invalid) {
      return
    }

    this.mapStatusformValuesToModel();
    console.log(this.statusModel);
    if (this.statusModel.id) {
      console.log('update')
      this.isLoading = true;
      this.statusService.updateStatus(this.statusModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          () => {
            this.toastService.success('Updated Successfully', 'Status')
            this.onCloseStatusDialog();
          },
          (err) => {
            this.toastService.error('Something went wrong, please try again later.', 'Error Updating')
            console.log(err)
          }
        );
    } else {
      console.log('created')
      delete this.statusModel['id'];
      this.isLoading = true;
      this.statusService.createStatus(this.statusModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          () => {
            this.toastService.success('Created Successfully', 'State')
            this.onCloseStatusDialog();
          },
          (err: any) => {
            this.toastService.error('Something went wrong, please try again later.', 'Error Creating')
            console.log(err)
          }
        );
    }
  }
  mapStatusformValuesToModel() {
    console.log(this.statusModel);
    this.statusModel.state = this.statusForm.value.state;
    this.statusModel.status = this.statusForm.value.status;
  }


  //Dialogue close function
  onCloseStatusDialog() {
    this.dialogRef.close();
  }

}
