import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatCheckboxChange} from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IOrganizationAccessLevel } from '../../model/IOrganizationAccessLevel';
import { IRoleClaim} from '../../model/IRoleClaim';
import { IRoleModel} from '../../model/IRoleModel';
import { AccessManagementService } from '../../service/access-management.service';
import { UserAccessLevelComponent } from '../user-access-level/user-access-level.component';

@Component({
  selector: 'kt-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
  
export class CreateRoleComponent extends AppComponentBase implements OnInit {

  @ViewChild(UserAccessLevelComponent) accessLevelComponent!: UserAccessLevelComponent;

  searchText: string
  currentIndex = 0
  appConsts = AppConst
  roleForm: FormGroup
  roleModel: IRoleModel
  roleClaims: IRoleClaim[] = []
  //locationIds: number[] = []
  permissions = Permissions
  //title name
  titleName: string = "Create Role ";

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //show Buttons
  showButtons: boolean = true;

  //Hide Submit And Cancel button
  isEditButtonShow: boolean = false;

  //accessLevelModel: IOrganizationAccessLevel[]

  isLoading: boolean
  // validation messages
  validationMessages = {
    roleName: {
      required: 'Role name is required.',
    },
  };
  // keys for validation
  formErrors = {
    roleName: '',
  };

  constructor(
    private accessManagementService: AccessManagementService,
    @Optional() @Inject(MAT_DIALOG_DATA) readonly _id: any,
    public dialogRef: MatDialogRef<CreateRoleComponent>,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.AUTH_EDIT)) ? true : false;
      // this.isEditButtonShow = true;
      this.titleName = 'Edit Role';
      this.isLoading = true;
      this.getRoleById(this._id);
    } else {
      this.getClaims();
      this.roleModel = {
        id: null,
        roleName: '',
        roleClaims: [],
        //locationIds: []
      }
    }
  }

  getRoleById(id: any) {
    this.accessManagementService.getRole(id)
    .pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    )
    .subscribe((arg) => {
      this.roleModel = arg.result;
      this.patchRole(this.roleModel);
    });
  }

  patchRole(roleModel: IRoleModel) {
    this.roleForm.patchValue({
      roleName: roleModel.roleName,
    })
    this.roleClaims = roleModel.roleClaims.map(x => {
      x.viewValue = this.appConsts.PermissionsDisplayName[x.value]
      return x;
    });
    this.roleModel.id = this._id;

    if(!this.showButtons) this.roleForm.disable()
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      return
    }

    if (this.roleClaims.filter(x => x.selected === true).length < 2) {
      this.toastService.warning('Atleast 2 Permissions is required !', 'Form Error');
      this.currentIndex = 1;
      return
    }

    // if(!this.accessLevelComponent.checklistSelection.selected.length){
    //   this.toastService.warning('Atleast 1 Access Level is required', 'Form Error');
    //   this.currentIndex = 2;
    //   return
    // }

    this.isLoading = true;
    this.roleModel = {...this.roleForm.value, id: this._id};
    this.roleModel.roleClaims = this.roleClaims;

    //get access Level location ids
    // this.accessLevelComponent.checklistSelection.selected.map((node: any) => {
    //   if(node.level === 3){
    //      this.locationIds.push(node.id)
    //   }
    // })
    //this.roleModel.locationIds = this.locationIds

    //console.log("Rolle Model: ", this.roleModel)
    if (this.roleModel.id) {
      this.accessManagementService.updateRole(this.roleModel)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.toastService.success('Updated Successfully', this.roleModel.roleName + '');
        this.onRoleDialogClose();
      })
    } else {
     // console.log('created');
      this.accessManagementService.createRole(this.roleModel)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.toastService.success('Created Successfully', 'New Role');
        this.onRoleDialogClose();
      })
    }
  }

  onRoleDialogClose() {
    this.dialogRef.close();
  }

  // toggleEdit() {
  //   this.isEditButtonShow = false;
  //   this.titleName = 'Edit Role'
  //   this.roleForm.enable()
  // }

  getClaims() {
    this.accessManagementService.getClaims().subscribe((res) => {
      res.result.forEach(element => {
        this.roleClaims.push(
          {
            type: 'permission',
            value: element,
            selected: false,
            viewValue: this.appConsts.PermissionsDisplayName[element]
          })
      });
      // this.roleClaims = res.result;
    })
  }

  reset() {
    this.formDirective.resetForm();
    this.roleClaims = [];
    this.getClaims();
  }

  onPermissionChange(permission: IRoleClaim, $event: MatCheckboxChange) {
    this.roleClaims[this.roleClaims.indexOf(permission)].selected = $event.checked
  }
}

