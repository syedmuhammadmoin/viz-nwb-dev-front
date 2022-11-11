import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IEmployee } from '../model/IEmployee';
import { EmployeeService } from '../service/employee.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { EmployeeState } from '../store/employee.state';

@Component({
  selector: 'kt-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})

export class CreateEmployeeComponent extends AppComponentBase implements OnInit {

  //busy loading
  isLoading: boolean

  //employee form declaration
  employeeForm: FormGroup;

  //employee model declaration
  employee: IEmployee = {} as IEmployee;

  title: string = 'Edit Employee'

  permissions = Permissions

  //show Buttons
  showButtons: boolean = true;

  // validation messages
  validationMessages = {
    noOfIncrements: {
      min: 'Minimum increment is 1.'
    },
    accountPayableId: {
      required: 'Account Payable is required.'
    }
  };

  //error keys
  formErrors = {
    noOfIncrements: '',
    accountPayableId: '',
  };

  constructor(private fb: FormBuilder,
    public  employeeService: EmployeeService,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateEmployeeComponent>,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      noOfIncrements: ['', [Validators.min(1)]],
      accountPayableId: ['' , [Validators.required]]
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.EMPLOYEE_EDIT)) ? true : false;
      this.title = 'Edit Employee'
      this.isLoading = true
      this.getEmployee(this._id);
    }

    //Get Account Payables from Store
    this.ngxsService.getAccountPayableFromState();
  }

  //Getting employee values for update
  getEmployee(id: number) {
    this.employeeService.getEmployeeById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((employee: IApiResponse<any>) => {
          //this.edi  employee.result;
          //this.employee =  employee.result;
          this.editEmployee(employee.result)
        }
      );
  }

  // Patching values to  employee form
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      noOfIncrements: employee.noOfIncrements,
      accountPayableId: employee.accountPayableId
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.employeeForm.disable();
    }
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToEmployeeModel();
    console.log(this.employee)
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(EmployeeState, true))
            this.toastService.success('Updated Successfully', 'Employee')
            this.onCloseDialog();
          }
      );
    }
  }

  // Mapping values from Employee form to  employee model
  mapFormValueToEmployeeModel() {
    this.employee.id = this._id;
    this.employee.noOfIncrements = this.employeeForm.value.noOfIncrements;
    this.employee.accountPayableId = this.employeeForm.value.accountPayableId;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
