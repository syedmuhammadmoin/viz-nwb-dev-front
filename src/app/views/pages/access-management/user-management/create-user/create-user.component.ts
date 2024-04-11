import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControlOptions, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ConfirmPasswordValidator, CustomValidator } from '../../../auth/register/confirm-password.validator';
import { IUserModel } from '../../model/IUserModel';
import { IUserRole } from '../../model/IUserRole';
import { AccessManagementService } from '../../service/access-management.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'kt-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
  
export class CreateUserComponent extends AppComponentBase implements OnInit {

  searchText: string;
  currentIndex = 0
  appConsts = AppConst
  userForm: FormGroup
  userModel: IUserModel
  userRole: IUserRole[] = []
  permissions = Permissions
  //title name
  titleName: string = "Create User ";

  //Hide Submit And Cancel button
  isEditButtonShow: boolean = false;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //show Buttons on Permissions
  showButtons: boolean = true;

  isLoading: boolean

  // validation messages
  validationMessages = {
    employeeId: {
      required: 'Employee is required.',
    },
    email: {
      required: 'Email is required.',
      email: 'Please enter valid Email.'
    },
    password: {
      required: 'Password is required.',
      hasNumber: 'Must contain atleast 1 number is required.',
      hasCapitalCase: 'Must contain atleast 1 in Capital Case.',
      hasSmallCase: 'Must contain atleast 1 in Small Case.',
      hasSpecialCharacters: 'Must contain atleast 1 in Special Character.',
      minlength: 'Must be atleast 8 characters long.'

    },
    confirmPassword: {
      ConfirmPassword: 'Password & Confirm Password did\'nt\ match.'
    },
  };

  //keys for validation
  formErrors: any = {
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  //Injecting Dependencies
  constructor(
    private accessManagementService: AccessManagementService,
    @Optional() @Inject(MAT_DIALOG_DATA) public _id: any,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    public ngxsService: NgxsCustomService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getRoles();
    this.userForm = this.fb.group({
      employeeId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([
        // 1. Password Field is Required
        Validators.required,
        // 2. check whether the entered password has a number
        CustomValidator.patternValidator(/\d/, { hasNumber: true }),
        // 3. check whether the entered password has upper case letter
        CustomValidator.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // 4. check whether the entered password has a lower-case letter
        CustomValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // 5. check whether the entered password has a special character
        CustomValidator.patternValidator(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, { hasSpecialCharacters: true }),
        // 6. Has a minimum length of 8 characters
        Validators.minLength(8)  
      ])],
      confirmPassword: ['']
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    } as FormControlOptions);

    if (this.userForm.get('password').hasError('hasSpecialCharacters')) {
      window.scrollTo(0,document.body.scrollHeight);
    }

    //get employees from state
    this.ngxsService.getEmployeeFromState();

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.AUTH_EDIT)) ? true : false;
      this.isEditButtonShow = (this.permission.isGranted(this.permissions.AUTH_EDIT)) ? true : false;
      this.titleName = 'User Details';
      this.isLoading = true;
      this.getUserById(this._id);
      //disable fields
      this.userForm.disable()
    } else {
      this.userModel = {
        id: null,
        employeeId: null,
        userRoles: [],
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  }

  getUserById(id: any) {
    this.accessManagementService.getUser(id)
    .pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    )
    .subscribe((res) => {
      this.userModel = res.result
      this.patchUser(this.userModel);
    })
  }

  patchUser(userModel: IUserModel) {
    this.userForm.patchValue({
        employeeId: userModel.employeeId,
        email: userModel.email,
      })
    
    this.userRole = userModel.userRoles;
    if(!this.showButtons) this.userForm.disable()
  }

  getRoles() {
    this.accessManagementService.getRoles().subscribe((res) => {
      res.result.forEach(element => {
        this.userRole.push({ roleName: element.normalizedName, selected: false })
      });
    })
  }

  onSubmit() { 
    if(!this.userRole.some((x) => x.selected === true)) {
      this.toastService.warning('Atleast 1 Role is required', 'User');
      this.currentIndex = 1;
      return
    }

    if (this.userForm.invalid) {
      this.currentIndex = 0;
      return
    }
    this.isLoading = true;
    if(this._id) {
      this.userModel.userId = this.userModel?.userId;
      this.userModel.userName = this.userModel?.userName;
      this.userModel.email = this.userModel?.email;
    }
    else {
      this.userModel = { ...this.userForm.value };
      this.userModel.employeeId = this.userForm.getRawValue().employeeId;
      this.userModel.email = this.userForm.getRawValue().email;
    }
    this.userModel.userRoles = this.userRole;

    if (this.userModel.userId) {
      this.accessManagementService.updateUser(this.userModel)
      .pipe(
       take(1),
        finalize(() => {
         this.isLoading = false;
         this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.toastService.success('Updated Successfully', "User");
        this.onCloseDialog();
      })
    } else {
      this.accessManagementService.createUser(this.userModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
      .subscribe((res) => {
        this.toastService.success('Created Successfully', 'User');
        this.onCloseDialog();
      })
    }
  }
  onCloseDialog() {
    this.dialogRef.close();
  }

  toggleEdit() {
    this.isEditButtonShow = false;
    this.titleName = 'Edit User'
    this.userForm.enable()
    this.disableFields(this.userForm , "employeeId", "email")
    this.userForm.get('password').clearValidators();
    this.userForm.get('confirmPassword').clearValidators();
    this.userForm.get('password').updateValueAndValidity();
    this.userForm.get('confirmPassword').updateValueAndValidity();
  }

  onRoleChange(role: IUserRole, $event: MatCheckboxChange) {
    this.userRole[this.userRole.indexOf(role)].selected = $event.checked
  }

  resetPassword() {
    this.onCloseDialog();
    this.dialog.open(ResetPasswordComponent, {
      width: '800px',
      data: this._id
    });
  }

  reset() {
    this.formDirective.resetForm();
    this.userRole = [];
    this.getRoles();
  }
}

