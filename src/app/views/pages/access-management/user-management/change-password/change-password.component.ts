import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControlOptions, FormGroup, NgForm, Validators} from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ConfirmPasswordValidator, CustomValidator} from '../../../auth/register/confirm-password.validator';
import { AccessManagementService } from '../../service/access-management.service';
import { AuthSingletonService } from '../../../auth/service/auth-singleton.service';
import { IResetPassword} from '../../model/IResetPassword';
import { AuthenticationService} from '../../../auth/service/authentication.service';
import { Router} from '@angular/router';
import { APP_ROUTES, AUTH } from 'src/app/views/shared/AppRoutes';
import { finalize, take } from 'rxjs/operators';


@Component({
  selector: 'kt-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent extends AppComponentBase implements OnInit {

  isLoading: any;
  changePassForm: FormGroup;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  validationMessages = {
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
    currentPassword: {
      required: 'Current Password is required.'
    }
  };

  //Keys for validation messages
  formErrors: any = {
    password: '',
    confirmPassword: '',
    currentPassword: ''
  };

  //Injecting Dependencies
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private accessManagementService: AccessManagementService,
    private cdRef: ChangeDetectorRef,
    private authSingletonService: AuthSingletonService,
    private authService: AuthenticationService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.changePassForm = this.fb.group({
      currentPassword: ['', Validators.required],
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
    } as FormControlOptions)
  }

  onSubmit() {
    if (this.changePassForm.invalid) {
      return;
    }
    if (!this.authSingletonService.getCurrentUser()) {
      return;
    }
    this.isLoading = true
    const body = { ...this.changePassForm.value } as IResetPassword
    body.loginUserId = this.authSingletonService.getCurrentUser().id.toString()

    this.accessManagementService.changePassword(body)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.toastService.success('' + res.message, 'Changed Successfully!')
      this.authService.signOut().subscribe((result) => {
        if (result) {
          this.router.navigate(['/' + APP_ROUTES.AUTH + '/' + AUTH.LOGIN])
        }
      });
    })
  }

  reset() {
    this.formDirective.resetForm();
  }
}
