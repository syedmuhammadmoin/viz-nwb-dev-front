import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, Self, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { IWarehouse} from '../model/IWarehouse';
import { CscService} from 'src/app/views/shared/csc.service';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { finalize, take} from "rxjs/operators";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { WarehouseState } from '../store/warehouse.state';
import { IsReloadRequired } from '../../store/profiling.action';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})

export class CreateWarehouseComponent extends AppComponentBase implements OnInit {
  // for permissions
  public permissions = Permissions;

  //Busy Loading
  isLoading: boolean;

  //variable for warehouse Form
  warehouseForm: FormGroup;

  //warehouse Model
  warehouse: IWarehouse;

  title: string = 'Create Store'

  //show Buttons
  showButtons: boolean = true; 

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //CSV list
  // countryList: ICountry[];
  // stateList: IState[];
  // cityList: ICity[];

  //for optionList dropdown
  // stateList2: Subject<IState[]> = new Subject<IState[]>();
  // cityList2: Subject<ICity[]> = new Subject<ICity[]>();

  //validation messages
  validationMessages = {
    name: {
      required: 'Store Name is required.'
    },
    // country: {
    //   required: 'Country is required'
    // },
    // state: {
    //   required: 'State is required'
    // },
    // city: {
    //   required: 'City is required'
    // },
    // department: {
    //   required: 'Department is required'
    // },
    manager: {
      required: 'Store Officer Or Incharge is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
    // address: {
    //   required: 'Address is required'
    // }
  }

  //error keys
  formErrors = {
    name: '',
    // country: '',
    // state: '',
    // city: '',
    // department: '',
    manager: '',
    campusId: '',
    //address: ''
  }

  //injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateWarehouseComponent>,
    private fb: FormBuilder,    
    public ngxsService:NgxsCustomService,
    public addButtonService:AddModalButtonService,
    private cdRef : ChangeDetectorRef,
    private cscService: CscService,
    injector: Injector) {
    super(injector);   
  }

  ngOnInit() {
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required]],
      // country: ['', [Validators.required]],
      // state: ['', [Validators.required]],
      // city: ['', [Validators.required]],
      //department: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      //address: [''],
    });

    //get country names
    //this.getCountryList();

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.WAREHOUSE_EDIT)) ? true : false;
      this.title = 'Edit Store'
      this.isLoading = true
      this.getWarehouse(this._id);
    } else {
      this.warehouse = {
        id: null,
        name: '',
        // country: '',
        // state: '',
        // city: '',
        storeManager: '',
        campusId: ''
        // address: '',
        // departmentId: null,
      };
    }
    // get department list from state
    this.ngxsService.getCampusFromState();
  }

  getWarehouse(id: number) {
    this.ngxsService.warehouseService.getWarehouse(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (warehouse: IApiResponse<IWarehouse>) => {
          this.editWarehouse(warehouse.result);
          this.warehouse = warehouse.result;
        }
      );
  }

  // getCountryList() {
  //   this.cscService.getCountries().subscribe((data: ICountry[]) => {
  //     this.countryList = data;
  //   });
  // }

  // getStateLists(id: number) {
  //   this.cscService.getStates(id).subscribe((data: IState[]) => {
  //     this.stateList = data;
  //     this.stateList2.next(this.stateList)
  //   });
  // }


  // onChangeCountry(countryId: number) {
  //   if (countryId) {
  //     this.getStateLists(parseInt(countryId.toString()));
  //     this.stateList2.next(this.stateList)
  //   } 
  // }

  // onChangeState(stateId: number) {
  //   if (stateId) {
  //     this.cscService.getCities(parseInt(stateId.toString())).subscribe(
  //       (data: ICity[]) => {
  //         this.cityList = data
  //         this.cityList2.next(this.cityList)
  //       });
  //   }
  // }


  //Edit Warehouse form
  editWarehouse(warehouse: IWarehouse) {
    // this.onChangeCountry(this.countryList.find(c => c.name == warehouse.country).id);
    // this.onChangeState(this.stateList.find(c => c.name == warehouse.state).id)

    this.warehouseForm.patchValue({
      id: warehouse.id,
      name: warehouse.name,
      // country: this.countryList.find(c => c.name == warehouse.country).id,
      // state: this.stateList.find(c => c.name == warehouse.state).id,
      // city: this.cityList.find(c => c.name == warehouse.city).id,
      manager: warehouse.storeManager,
      campusId: warehouse.campusId,
      // address: warehouse.address,
      // department: warehouse.departmentId,
    });

    //if user have no permission to edit, so disable all fields
    if(!this.showButtons) {
      this.warehouseForm.disable();
    }
  }

  onSubmit() {
    if (this.warehouseForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    //console.log(this.warehouse)
    if (this.warehouse.id) {
      this.ngxsService.warehouseService.updateWarehouse(this.warehouse)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {            
            this.ngxsService.store.dispatch(new IsReloadRequired(WarehouseState, true))
            this.toastService.success('Updated Successfully', 'Store')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.warehouse.id;
      this.ngxsService.warehouseService.addWarehouse(this.warehouse)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {          
            this.ngxsService.store.dispatch(new IsReloadRequired(WarehouseState, true))
            this.toastService.success('Created Successfully', 'Store')
            this.onCloseDialog();
          }
        );
    }
  }
// map form values to the warehouse model
  mapFormValueToClientModel() {
    this.warehouse.name = this.warehouseForm.value.name;
    // this.warehouse.country = this.countryList.find(c => c.id == this.warehouseForm.value.country).name;
    // this.warehouse.state = this.stateList.find(c => c.id == this.warehouseForm.value.state).name;
    // this.warehouse.city = this.cityList.find(c => c.id == this.warehouseForm.value.city).name;
    this.warehouse.storeManager = this.warehouseForm.value.manager;
    this.warehouse.campusId = this.warehouseForm.value.campusId;
    // this.warehouse.address = this.warehouseForm.value.address;
    // this.warehouse.departmentId = this.warehouseForm.value.department;
  }

  reset() {
    this.formDirective.resetForm();
  }
  // add new department 
  // openDepartmentDialog() {
  //   if (this.permission.isGranted(this.permissions.DEPARTMENTS_CREATE)) {
  //     this.addButtonService.openDepartmentDialog();
  //   }
  // }
  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}


