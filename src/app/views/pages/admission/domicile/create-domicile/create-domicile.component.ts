import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { finalize, take } from 'rxjs/operators';
import { DomicileService } from '../service/domicile.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { IDomicile } from '../model/IDomicile';
import { DomicileState } from '../store/domicile.state';

@Component({
  selector: 'kt-create-domicile',
  templateUrl: './create-domicile.component.html',
  styleUrls: ['./create-domicile.component.scss']
})
export class CreateDomicileComponent extends AppComponentBase implements OnInit {



  // for permissions
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  //variable for DomicileForm 
  DomicileForm: FormGroup;

  //Domicile Model
  Domicile: IDomicile = {} as IDomicile;

  title: string = 'Create Domicile'

  //show Buttons
  isEditButtonShow: boolean = false;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //validation messages
  validationMessages = {
    name: {
      required: 'Domicile is required.'
    },
    district: {
      required: 'District is required.'
    }
  }

  //error keys
  formErrors = {
    name: '',
    district: ''
  }

  //Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateDomicileComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    private domicileService: DomicileService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.DomicileForm = this.fb.group({
      name: ['', [Validators.required]],
      district: ['', [Validators.required]],
    });


    if (this._id) {
      this.isEditButtonShow = true;
      this.title = 'Domicile Detail';

      //disable all fields
      this.isLoading = true;
      this.DomicileForm.disable();
      this.getDomicile(this._id);
    } else {
      this.Domicile = {
        id: null,
        name: '',
        districtId: null
      };
    }
    //Get Data from Store
    this.ngxsService.getDistrictFromState();
  }

  //Edit Form
  toggleEdit() {
    this.isEditButtonShow = false;
    this.title = 'Edit Domicile'
    this.DomicileForm.enable()
  }

  getDomicile(id: number) {
    this.domicileService.getDomicileById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (res) => {
          this.editDomicile(res.result),
            this.Domicile = res.result;
        }
      );
  }

  //  Edit Domicile form
  editDomicile(ADepartment: IDomicile) {
    this.DomicileForm.patchValue({
      id: ADepartment.id,
      name: ADepartment.name,
      district: ADepartment.districtId
    });

  };

  onSubmit() {

    if (this.DomicileForm.invalid) {
      return;
    }

    this.isLoading = true
    this.mapFormValueToClientModel();

    if (this.Domicile.id) {
      this.ngxsService.domicileService.updateDomicile(this.Domicile)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(DomicileState, true))
            this.toastService.success('Updated Successfully', 'Domicile')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.Domicile.id;
      this.ngxsService.domicileService.createDomicile(this.Domicile)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(DomicileState, true))
            this.toastService.success('Created Successfully', 'Domicile')
            this.onCloseDialog();
          }
        );
    }
  }

  // map form values to the Domicile model
  mapFormValueToClientModel() {
    this.Domicile.name = this.DomicileForm.value.name;
    this.Domicile.districtId = this.DomicileForm.value.district;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}

