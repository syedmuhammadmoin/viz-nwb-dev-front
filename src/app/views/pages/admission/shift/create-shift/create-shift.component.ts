import {ChangeDetectorRef, Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Optional} from 'ag-grid-community';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {IShift} from '../model/IShift';
import {Permissions} from '../../../../shared/AppEnum';
import {finalize, take} from 'rxjs/operators';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import {ShiftState} from '../store/shift.state';

@Component({
  selector: 'kt-create-shift',
  templateUrl: './create-shift.component.html',
  styleUrls: ['./create-shift.component.scss']
})
export class CreateShiftComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for shift Form
  shiftForm: FormGroup;

  // shift Model
  shift: IShift = {} as IShift;

  title = 'Create Shift'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Name is required.'
    }
  }

  // error keys
  formErrors = {
    name: '',
  }

  // Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateShiftComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.shiftForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.ADMISSION_SHIFT_EDIT));
      this.title = 'Edit Shift'
      this.isLoading = true
      this.getShift(this._id);
    }

    // Get Data from Shift
    this.ngxsService.getCampusFromState();
  }

  getShift(id: number) {
    this.ngxsService.shiftService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (shift) => {
          this.editShift(shift.result);
          this.shift = shift.result;
        }
      );
  }

//  Edit Warehouse form
  editShift(shift: IShift) {
    this.shiftForm.patchValue({
      id: shift.id,
      name: shift.name,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.shiftForm.disable();
    }
  }

  onSubmit() {
    if (this.shiftForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
     if (this.shift.id) {
       this.ngxsService.shiftService.update(this.shift)
       .pipe(
         take(1),
          finalize(() => {
           this.isLoading = false;
           this.cdRef.detectChanges();
          })
        )
         .subscribe(() => {
             this.ngxsService.store.dispatch(new IsReloadRequired(ShiftState, true))
             this.toastService.success('Updated Successfully', 'Shift')
             this.onCloseDialog();
           }
         );
     } else {
       delete this.shift.id;
       this.ngxsService.shiftService.create(this.shift)
       .pipe(
         take(1),
          finalize(() => {
           this.isLoading = false;
           this.cdRef.detectChanges();
          })
        )
         .subscribe(() => {
           this.ngxsService.store.dispatch(new IsReloadRequired(ShiftState, true))
             this.toastService.success('Created Successfully', 'Shift')
             this.onCloseDialog();
           }
         );
     }
  }

// map form values to the shift model
  mapFormValueToClientModel() {
    this.shift.name = this.shiftForm.value.name;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
