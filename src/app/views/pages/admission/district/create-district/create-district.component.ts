import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { finalize, take } from 'rxjs/operators';
import { DistrictService } from '../service/district.service';
import { IDistrict } from '../model/IDistrict';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { DistrictState } from '../store/district.state';

@Component({
  selector: 'kt-create-district',
  templateUrl: './create-district.component.html',
  styleUrls: ['./create-district.component.scss']
})
export class CreateDistrictComponent extends AppComponentBase implements OnInit {



  // for permissions
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  //variable for DistrictForm 
  DistrictForm: FormGroup;

  //District Model
  District: IDistrict = {} as IDistrict;

  title: string = 'Create District'

  //show Buttons
  isEditButtonShow: boolean = false;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //validation messages
  validationMessages = {
    name: {
      required: 'District is required.'
    },
    cityId: {
      required: 'City is required.'
    }
  }

  //error keys
  formErrors = {
    name: '',
    cityId: ''
  }

  //Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateDistrictComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    private districtService: DistrictService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.DistrictForm = this.fb.group({
      name: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
    });


    if (this._id) {
      this.isEditButtonShow = true;
      this.title = 'District Detail';

      //disable all fields
      this.isLoading = true;
      this.DistrictForm.disable();
      this.getDistrict(this._id);
    } else {
      this.District = {
        id: null,
        name: '',
        cityId: null
      };
    }
    //Get Data from Store
    this.ngxsService.getDistrictFromState();
    this.ngxsService.getDomicileFromState();
    this.ngxsService.getFacultyFromState();
  }

  //Edit Form
  toggleEdit() {
    this.isEditButtonShow = false;
    this.title = 'Edit District'
    this.DistrictForm.enable()
  }

  getDistrict(id: number) {
    this.districtService.getDistrictById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (res) => {
          this.editDistrict(res.result),
            this.District = res.result;
        }
      );
  }

  //  Edit District form
  editDistrict(ADepartment: IDistrict) {
    this.DistrictForm.patchValue({
      id: ADepartment.id,
      name: ADepartment.name,
      cityId: ADepartment.cityId
    });

  };

  onSubmit() {

    if (this.DistrictForm.invalid) {
      return;
    }

    this.isLoading = true
    this.mapFormValueToClientModel();

    if (this.District.id) {
      this.ngxsService.districtService.updateDistrict(this.District)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired(DistrictState, true))
          this.toastService.success('Updated Successfully', 'District')
          this.onCloseDialog();
        }
        );
    } else {
      delete this.District.id;
      this.ngxsService.districtService.createDistrict(this.District)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired(DistrictState, true))
          this.toastService.success('Created Successfully', 'District')
          this.onCloseDialog();
        }
        );
    }
  }

  // map form values to the District model
  mapFormValueToClientModel() {
    this.District.name = this.DistrictForm.value.name;
    this.District.cityId = this.DistrictForm.value.cityId;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
