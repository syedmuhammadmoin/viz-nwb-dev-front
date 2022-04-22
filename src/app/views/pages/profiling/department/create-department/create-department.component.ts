import { Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { IDepartment} from '../model/IDepartment';
import { IState } from 'src/app/views/shared/models/state';
import { ICity} from 'src/app/views/shared/models/city';
import { ICountry } from 'src/app/views/shared/models/country';
import { CscService} from 'src/app/views/shared/csc.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { Subject } from 'rxjs';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IsReloadRequired } from '../../store/profiling.action';
import { DepartmentState } from '../store/department.state';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})

export class CreateDepartmentComponent extends AppComponentBase implements OnInit {

    //for permissions
    public permissions = Permissions;
    //busy loading
    isLoading: boolean;
  
    //variable for department
    deptForm: FormGroup;
  
    //department model
    department: IDepartment;
  
    //country , state and city list
    countryList: ICountry[] = [];
    stateList: IState[] = [];
    cityList: ICity[] = [];
  
    //for optionList dropdown
    stateList2: Subject<IState[]> = new Subject<IState[]>();
    cityList2: Subject<ICity[]> = new Subject<ICity[]>();
  
    //validation messages
    validationMessages = {
      'name': {
        'required': 'Name is required'
      },
      'country': {
        'required': 'Country is required'
      },
      'state': {
        'required': 'State is required'
      },
      'city': {
        'required': 'City is required'
      },
      'address': {
        'required': 'Address is required'
      },
      'organization': {
        'required': 'Organization is required'
      },
      // 'headOfDept': {
      //   'required': 'HOD is required'
      // }
    }
  
    //error keys
    formErrors = {
      'name': '',
      'country': '',
      'state': '',
      'city': '',
      'address': '',
      'organization': '',
      //'headOfDept': ''
    }
  
    //injecting dependencies
    constructor( private fb: FormBuilder,
                 @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
                 public dialogRef: MatDialogRef<CreateDepartmentComponent>,
                 public ngxsService:NgxsCustomService,
                 public addButtonService:AddModalButtonService,
                 private cscService: CscService, // Country, State, City
                 injector: Injector)
                 {
                   super(injector);
                 }
  
    ngOnInit() {
      this.deptForm = this.fb.group({
        name: ['', [Validators.required]],
        country: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        address: ['', [Validators.required]],
        organization: ['', [Validators.required]],
        headOfDept: [''],
      });
  
      this.getCountryList();
  
      if (this._id) {
        this.isLoading = true;
        this.getDepartment(this._id);
      } else {
        this.department = {
          id: null,
          name: '',
          country: '',
          state: '',
          city: '',
          address: '',
          headOfDept: '',
          organizationId: null,
        };
      }
      //get orgnizationList from state      
      //this.ngxsService.getOrganizationFromState();
    }
  
  // get department by id
    getDepartment(id: number) {
      this.ngxsService.departmentService.getDepartment(id)
        .subscribe(
          (department: IApiResponse<IDepartment>) => {
            this.isLoading = false;
            this.editDepartment(department.result);
            this.department = department.result
          },
          (err) => console.log(err)
        );
    }
  // get country list
    getCountryList() {
      this.cscService.getCountries().subscribe((data: ICountry[]) => {
        this.countryList = data;
      });
    }
  // get state list
    getStateLists(id: number) {
      this.cscService.getStates(id).subscribe((data: IState[]) => {
        this.stateList = data;
        this.stateList2.next(this.stateList)
      });
    }  
  // method called when country is changed
    onChangeCountry(countryId: number) {
      if (countryId) {
        this.getStateLists(parseInt(countryId.toString()));
        this.stateList2.next(this.stateList)
      } 
    }
   // method called when state is changed
    onChangeState(stateId: number) {
      if (stateId) {
        this.cscService.getCities(parseInt(stateId.toString())).subscribe(
          (data: ICity[]) => {
            this.cityList = data
            this.cityList2.next(this.cityList)
          });
      }
    }
  
    //edit department
    editDepartment(department: IDepartment) {
      console.log(department)
      this.onChangeCountry(this.countryList.find(c => c.name == department.country).id);
      this.onChangeState(this.stateList.find(c => c.name == department.state).id)
  
      this.deptForm.patchValue({
        id: department.id,
        name: department.name,
        country: this.countryList.find(c => c.name == department.country).id,
        state: this.stateList.find(c => c.name == department.state).id,
        city: this.cityList.find(c => c.name == department.city).id,
        address: department.address,
        headOfDept: department.headOfDept,
        organization: department.organizationId,
      });
    }
  
    // form submition
    onSubmit() {
      if (this.deptForm.invalid) {
        return;
      }
      this.isLoading = true;
      this.mapFormValueToClientModel();
      if (this.department.id) {
        this.ngxsService.departmentService.updateDepartment(this.department)
          .pipe(
            take(1),
            finalize(() => this.isLoading = false))
          .subscribe(() => {           
              this.ngxsService.store.dispatch(new IsReloadRequired(DepartmentState, true))
              this.toastService.success('Updated Successfully', 'Department')
              this.onCloseDialog();
            },          
          (err) => this.toastService.error('Something went wrong', 'Department')
        );
      } else {
        delete this.department['id'];
        this.ngxsService.departmentService.addDepartment(this.department)
          .pipe(
            take(1),
            finalize(() => this.isLoading = false))
          .subscribe(
            () => {           
              this.ngxsService.store.dispatch(new IsReloadRequired(DepartmentState, true))
              this.toastService.success('Created Successfully', 'Department')
              this.onCloseDialog();
            },            
          (err) => this.toastService.error('Something went wrong', 'Department')
        );
      }
      this.dialogRef.close()
    }
  //mapping form values to the model
    mapFormValueToClientModel() {
      this.department.name = this.deptForm.value.name;
      this.department.country = this.countryList.find(c => c.id == this.deptForm.value.country).name;
      this.department.state = this.stateList.find(c => c.id == this.deptForm.value.state).name;
      this.department.city = this.cityList.find(c => c.id == this.deptForm.value.city).name;
      this.department.address = this.deptForm.value.address;
      this.department.headOfDept = this.deptForm.value.headOfDept;
      this.department.organizationId = this.deptForm.value.organization;
    }
    // add new orgnization
    openOrgnizationDialog() {
      if (this.permission.isGranted(this.permissions.ORGANIZATION_CREATE)) {
        this.addButtonService.openOrgnizationDialog();
      }
    }
    // Dialogue close function
    onCloseDialog() {
      this.dialogRef.close();
    }
  }
  




