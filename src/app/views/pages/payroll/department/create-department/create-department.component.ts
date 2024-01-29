import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { finalize, take} from "rxjs/operators";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IdepartmentInterface } from '../model/idepartment-interface';
import { DepartmentState } from '../store/department.store';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { DepartmentService } from '../service/department.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean

  //employee form declaration
  departmentForm: FormGroup;

  //employee model declaration
  department: IdepartmentInterface = {} as IdepartmentInterface;

  title: string = 'Create Department'

  permissions = Permissions

  //show Buttons
  showButtons: boolean = true;

  // validation messages
  validationMessages = {
    name: {
      required: 'Name is Required.'
    },
    campusId: {
      required: 'Branch is required.'
    }
  };

  //error keys
  formErrors = {
    name: '',
    campusId: '',
  };

  //Injecting Dependencies
  constructor(private fb: FormBuilder,
    public  departmentService: DepartmentService,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateDepartmentComponent>,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required]],
      campusId: ['' , [Validators.required]],
      Id: [1]
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.EMPLOYEE_EDIT)) ? true : false;
      this.title = 'Edit Department'
      this.isLoading = true
      this.getEmployee(this._id);
    }

    //Get Data from Store
    this.ngxsService.getCampusFromState();
  }

  //Getting employee values for update
  getEmployee(id: number) {
    this.departmentService.getdepartmentById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((department: IApiResponse<any>) => {
          this.editEmployee(department.result)
        }
      );
  }
  departmentData :any =[]
  // Patching values to  employee form
  editEmployee(department: IdepartmentInterface) {
    this.departmentForm.patchValue({
      name: department.name,
      campusId: department.campusId
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.departmentForm.disable();
    }
  }

  onSubmit() {
    if (this.departmentForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToEmployeeModel();
    this.departmentData.push(this.department);
    if (this.department.id) {
      this.departmentService.updateDepartment(this.department)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(DepartmentState, true))
            this.toastService.success('Updated Successfully', 'Department')
            this.onCloseDialog();
          }
      );
    }else {
      delete this.department.id;     
      this.departmentService.addDepartment(this.departmentData)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
        () => {
          this.ngxsService.store.dispatch(new IsReloadRequired (DepartmentState , true))
          this.toastService.success('Created Successfully', 'Department')
          this.onCloseDialog()
        }
      );
    }
  }

  // Mapping values from Employee form to  employee model
  mapFormValueToEmployeeModel() {
    this.department.id = this._id;
    this.department.name = this.departmentForm.value.name;
    this.department.campusId = this.departmentForm.value.campusId;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
