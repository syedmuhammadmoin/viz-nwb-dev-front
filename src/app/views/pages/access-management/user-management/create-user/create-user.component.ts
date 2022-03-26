import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
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
  //title name
  titleName: string = "Create User ";

  //Hide Submit And Cancel button
  isEditButtonShow: boolean = false;

  isLoading: boolean
  // validation messages
  validationMessages = {
    userName: {
      required: 'username is required.',
    },
    email: {
      required: 'email is required.',
      email: 'Please enter valid Email!'
    },
    password: {
      required: 'Password is required.',
      hasNumber: 'Must contain atleast 1 number is required',
      hasCapitalCase: 'Must contain atleast 1 in Capital Case!',
      hasSmallCase: 'Must contain atleast 1 in Small Case!',
      hasSpecialCharacters: 'Must contain atleast 1 in Special Character!',
      minlength: 'Must be atleast 8 characters long'

    },
    confirmPassword: {
      ConfirmPassword: 'Password & Confirm Password did\'nt\ match'
    },
  };
  // keys for validation
  formErrors = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private accessManagementService: AccessManagementService,
    @Optional() @Inject(MAT_DIALOG_DATA) public _id: any,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getRoles();
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
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
    });

    if (this.userForm.get('password').hasError('hasSpecialCharacters')) {
      window.scrollTo(0,document.body.scrollHeight);
    }

    if (this._id) {
      this.isEditButtonShow = true;
      this.titleName = 'User Details';
      this.isLoading = true;
      //disable all fields
      this.userForm.disable();
      this.getUserById(this._id);
    } else {
      this.userModel = {
        id: null,
        userName: '',
        userRoles: [],
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  }

  getUserById(id: any) {
    this.accessManagementService.getUser(id).subscribe((res) => {
      this.isLoading = false
      // TODO: Update User
      console.log(res.result)
      this.userModel = res.result
      this.patchUser(this.userModel);
    })
  }
  patchUser(userModel: IUserModel) {
    this.userForm.patchValue({ ...userModel })
    console.log(userModel)
    this.userRole = userModel.userRoles;
  }

  getRoles() {
    this.accessManagementService.getRoles().subscribe((res) => {
      res.result.forEach(element => {
        this.userRole.push({ roleName: element.normalizedName, selected: false })
      });
    })
  }

  onSubmit() { 
    console.log(this.userRole)
    if(!this.userRole.some((x) => x.selected === true)) {
      this.toastService.warning('Atleast 1 Role is required', 'Form Error');
      this.currentIndex = 1;
      return
    }

    if (this.userForm.invalid) {
      return
    }
    this.isLoading = true;
    this.userModel = { ...this.userForm.value, id: this._id };
    this.userModel.userRoles = this.userRole;
    console.log("model: ", this.userModel)
    // if (this.userModel.id) {
    //   this.accessManagementService.updateUser(this.userModel).subscribe((res) => {
    //     this.isLoading = false;
    //     this.toastService.success('Updated Successfully', this.userModel.userName + '');
    //     this.onCloseUserDialog();
    //   }, (err) => {
    //     this.isLoading = false;
    //     // console.log(err);
    //     this.toastService.error('' + err?.error?.message, 'Error');
    //   })
    // } else {
    //   console.log("yes eneterd")
    //   this.accessManagementService.createUser(this.userModel).subscribe((res) => {
    //     this.isLoading = false
    //     this.toastService.success('Created Successfully', 'New User');
    //     this.onCloseUserDialog();
    //   }, (err) => {
    //     this.isLoading = false;
    //     // console.log(err);
    //     this.toastService.error('' + err?.error?.message, 'Error');
    //   })
    // }
  }
  onCloseUserDialog() {
    this.dialogRef.close();
  }

  toggleEdit() {
    this.isEditButtonShow = false;
    this.titleName = 'Edit User'
    this.userForm.enable()
    this.userForm.get('password').clearValidators();
    this.userForm.get('confirmPassword').clearValidators();
    this.userForm.get('password').updateValueAndValidity();
    this.userForm.get('confirmPassword').updateValueAndValidity();
  }

  onRoleChange(role: IUserRole, $event: MatCheckboxChange) {
    this.userRole[this.userRole.indexOf(role)].selected = $event.checked
  }

  resetPassword() {
    this.onCloseUserDialog();
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '800px',
      // height: '750px',
      data: this._id
    });
    // Recalling getInvoiceMasterData function on dialog close
    dialogRef.afterClosed().subscribe(() => {
    });
  }
}

