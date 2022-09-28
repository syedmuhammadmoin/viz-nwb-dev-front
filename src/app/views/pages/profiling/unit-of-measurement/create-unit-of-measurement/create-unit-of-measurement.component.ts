import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, take} from "rxjs/operators";
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IUnitOfMeasurement } from '../model/IUnitOfMeasurement';
import { UnitOfMeasurementService } from '../service/unit-of-measurement.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IsReloadRequired } from '../../store/profiling.action';
import { UnitOfMeasurementState } from '../store/unit.state';

@Component({
  selector: 'kt-create-unit-of-measurement',
  templateUrl: './create-unit-of-measurement.component.html',
  styleUrls: ['./create-unit-of-measurement.component.scss']
})

export class CreateUnitOfMeasurementComponent extends AppComponentBase implements OnInit {

  //busy loading
  isLoading: boolean

  // unitOfMeasurement form declaration
  unitOfMeasurementForm: FormGroup;

  // unitOfMeasurement model declaration
  unitOfMeasurement: IUnitOfMeasurement;

  title: string = 'Create Unit Of Measurement'

  permissions = Permissions

  //show Buttons
  showButtons: boolean = true;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Unit is required.',
    }
  };

  //error keys
  formErrors = {
    name: ''
  };

  constructor(private fb: FormBuilder,
    public unitOfMeasurementService: UnitOfMeasurementService,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateUnitOfMeasurementComponent>,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.unitOfMeasurementForm = this.fb.group({
      name: ['', Validators.required],
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.UNIT_OF_MEASUREMENT_EDIT)) ? true : false;
      this.title = 'Edit Unit Of Measurement'
      this.isLoading = true
      this.getunitOfMeasurement(this._id);
    } else {
      this.unitOfMeasurement = {
        id: null,
        name: ''
      }
    }
  }

  // Getting unitOfMeasurement values for update
  getunitOfMeasurement(id: number) {
    this.unitOfMeasurementService.getUnitOfMeasurement(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (unitOfMeasurement: IApiResponse<IUnitOfMeasurement>) => {
          this.editUnitOfMeasurement(unitOfMeasurement.result);
          this.unitOfMeasurement = unitOfMeasurement.result;
        }
      );
  }

  // Patching values to Unit Of Measurement form
  editUnitOfMeasurement(unitOfMeasurement: IUnitOfMeasurement) {
    this.unitOfMeasurementForm.patchValue({
      id: unitOfMeasurement.id,
      name: unitOfMeasurement.name
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.unitOfMeasurementForm.disable();
    }
  }

  onSubmit() {
    if (this.unitOfMeasurementForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueTounitOfMeasurementModel();
    if (this.unitOfMeasurement.id) {
      this.unitOfMeasurementService.updateUnitOfMeasurement(this.unitOfMeasurement)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(UnitOfMeasurementState, true))
            this.toastService.success('Updated Successfully', 'Unit Of Measurement')
            this.onCloseDialog();
          }
      );
    } else {
      delete this.unitOfMeasurement.id;
      this.unitOfMeasurementService.addUnitOfMeasurement(this.unitOfMeasurement)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {        
          this.ngxsService.store.dispatch(new IsReloadRequired(UnitOfMeasurementState, true))
            this.toastService.success('Added Successfully', 'Unit Of Measurement')
            this.onCloseDialog();
          }
      );
    }
  }

  // Mapping values from unitOfMeasurement form to unitOfMeasurement model
  mapFormValueTounitOfMeasurementModel() {
    this.unitOfMeasurement.name = this.unitOfMeasurementForm.value.name;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
