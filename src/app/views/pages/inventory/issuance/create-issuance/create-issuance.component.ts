import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { ISSUANCE } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IIssuance } from '../model/IIssuance';
import { IssuanceService } from '../service/issuance.service';
import { IIssuanceLines } from '../model/IssuanceLines';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { RequisitionService } from '../../../procurement/requisition/service/requisition.service';
import { IRequisition } from '../../../procurement/requisition/model/IRequisition';
import { EmployeeService } from '../../../payroll/employee/service/employee.service';
import { DropdownComponent } from 'src/app/views/shared/components/dropdown/dropdown.component';

@Component({
  selector: 'kt-create-issuance',
  templateUrl: './create-issuance.component.html',
  styleUrls: ['./create-issuance.component.scss']
})

export class CreateIssuanceComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  // Declaring form variable
  issuanceForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'fixedAssetId', 'description', 'quantity', 'warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Issuance Model
  issuanceModel: IIssuance;

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  // For DropDown
  salesItem: IProduct[];

  //param to get requisition
  isRequisition: boolean;
  requisitionMaster: any;

  isIssuance: boolean

  // for getting employee
  employee = {} as any;

  //selected Fixedasset to assign
  fixedAssetsDropdown = [];

  isFixedAsset: any;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  title: string = 'Create Issuance'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //for resetting form
  disableFixedAsset = false

  // Validation messages..
  validationMessages = {
    employeeId: {
      required: 'Employee is required.',
    },
    issuanceDate: {
      required: 'Issuance Date is required.',
    },
    fixedAssetId: {
      required: 'Asset is required.',
    }
  };

  // error keys..
  formErrors = {
    employeeId: '',
    issuanceDate: '',
    fixedAssetId: ''
  };
  

  //Injecting Dependencies
  constructor(private fb: FormBuilder,
    private issuanceService: IssuanceService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public employeeService: EmployeeService,
    private requisitionService: RequisitionService,
    public addButtonService: AddModalButtonService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.issuanceForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      designation: [''],
      department: [''],
      issuanceDate: ['', [Validators.required]],
      campusId: [{ value: null, disabled: true }],
      issuanceLines: this.fb.array([
        this.addIssuanceLines()
      ])
    });

    this.issuanceForm.get('issuanceLines')['controls'][0].controls.fixedAssetId.disable();

    this.issuanceModel = {
      id: null,
      employeeId: null,
      issuanceDate: null,
      campusId: null,
      issuanceLines: []
    }

    //Get Data from Store
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getEmployeeFromState();
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState();

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isIssuance = param.isIssuance;
      this.isRequisition = param.isRequisition;

      if (id && this.isIssuance) {
        this.isLoading = true;
        this.title = 'Edit Issuance'
        this.getIssuance(id);
      }
      else if (id && this.isRequisition) {
        this.isLoading = true;
        this.getRequisition(id);
      }
    });

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result)
  }

  //Form Reset
  reset() {
    this.formDirective.resetForm();
    this.showMessage = false;
    this.warehouseList.next([])
    this.table.renderRows();
    this.fixedAssetsDropdown = [];
  }

  //Add issuance Lines
  addIssuanceLineClick(): void {
    const controls = this.issuanceForm.controls.issuanceLines as FormArray;
    controls.push(this.addIssuanceLines());
    this.table.renderRows();
    this.issuanceForm.get('issuanceLines')['controls'][(this.issuanceForm.get('issuanceLines')['controls'].length - 1)].controls.fixedAssetId.disable();
  }

  // Add Issuance Lines
  addIssuanceLines(): FormGroup {
    return this.fb.group({
      itemId: ['', Validators.required],
      fixedAssetId: [''],
      description: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      warehouseId: ['', Validators.required]
    });
  }

  //Remove Issuance Line
  removeIssuanceLineClick(issuanceLineIndex: number): void {
    const issuanceLineArray = this.issuanceForm.get('issuanceLines') as FormArray;
    issuanceLineArray.removeAt(issuanceLineIndex);
    issuanceLineArray.markAsDirty();
    issuanceLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Get issuance Data for Edit
  private getIssuance(id: number) {
    this.issuanceService.getIssuanceById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        if (!res) return
        this.issuanceModel = res.result
        this.patchIssuance(this.issuanceModel)
        res.result.issuanceLines.forEach((x, index) => {
          this.onItemSelected(x.itemId, index)
        })
      });
  }

  //Get Requisition Data
  private getRequisition(id: number) {
    this.requisitionService.getRequisitionById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        if (!res) return
        this.requisitionMaster = res.result
        this.patchIssuance(this.requisitionMaster)
      });
  }

  //Patch Issuance Form through issuance Or sales Order Master Data
  patchIssuance(data: IIssuance | IRequisition | any) {
    this.issuanceForm.patchValue({
      employeeId: data.employeeId,
      issuanceDate: data.issuanceDate ?? data.requisitionDate
    });

    this.showMessage = true;

    this.getEmployee(data.employeeId, true)

    this.ngxsService.warehouseService.getWarehouseByCampusId(data.campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    this.issuanceForm.setControl('issuanceLines', this.patchIssuanceLines((this.requisitionMaster) ? data.requisitionLines : data.issuanceLines))
  }

  //Patch Issuance Lines
  patchIssuanceLines(lines: IIssuanceLines[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      if (line.pendingQuantity != 0 ?? this.isIssuance) {
        formArray.push(this.fb.group({
          id: (this.isRequisition) ? 0 : line.id,
          itemId: [line.itemId, Validators.required],
          fixedAssetId: [line.fixedAssetId],
          description: [line.description, Validators.required],
          quantity: (this.isRequisition) ? [line.pendingQuantity, [Validators.required, Validators.min(1), Validators.max(line.pendingQuantity)]] :
            [line.quantity, [Validators.required, Validators.min(1)]],
          warehouseId: [line.warehouseId, [Validators.required]],
        }))
      }
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {

    if (this.issuanceForm.get('issuanceLines').invalid) {
      this.issuanceForm.get('issuanceLines').markAllAsTouched();
    }
    const controls = <FormArray>this.issuanceForm.controls['issuanceLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add Issuance lines', 'Error')
      return;
    }

    if (this.issuanceForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Issuance")
      return;
    }

    this.mapFormValuesToissuanceModel();

    const isDuplicateLines = this.issuanceModel.issuanceLines.some((a, index) => this.issuanceModel.issuanceLines.some((b, i) => (i !== index && (a.itemId === b.itemId && a.warehouseId === b.warehouseId))))

    if (isDuplicateLines) {
      this.toastService.error("Please Remove Duplicate Line!", "Issuance")
      return;
    }

    this.isLoading = true;
    if (this.issuanceModel.id) {
      this.issuanceService.updateIssuance(this.issuanceModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IIssuance>) => {
          this.toastService.success('Updated Successfully', 'Issuance')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + ISSUANCE.ID_BASED_ROUTE('details', this.issuanceModel.id)]);
        })
    } else {
      delete this.issuanceModel.id;
      this.issuanceService.createIssuance(this.issuanceModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IIssuance>) => {
          this.toastService.success('Created Successfully', 'Issuance')
          this.router.navigate(['/' + ISSUANCE.ID_BASED_ROUTE('details', res.result.id)]);
        });
    }
  }

  // Mapping value to model
  mapFormValuesToissuanceModel() {
    this.issuanceModel.employeeId = this.issuanceForm.value.employeeId;
    this.issuanceModel.issuanceDate = this.transformDate(this.issuanceForm.value.issuanceDate, 'yyyy-MM-dd');
    this.issuanceModel.campusId = this.issuanceForm.getRawValue().campusId;
    this.issuanceModel.requisitionId = (this.requisitionMaster?.id ?? this.issuanceModel?.requisitionId ?? null)
    this.issuanceModel.issuanceLines = this.issuanceForm.value.issuanceLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.issuanceModel.isSubmit = (val === 0) ? false : true;
  }

  // getting employee data by id
  // using isEdit here to avoid onCampusSelected(...) method, which sets all stores values to null
  getEmployee(id: number, isEdit: boolean = false) {
    this.employeeService.getEmployeeById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.employee = res.result
        this.checkSelected(this.employee, isEdit)
        this.cdRef.detectChanges()
      })
  }

  checkSelected(employee: IIssuance | any, isEdit: boolean = false) {
    this.issuanceForm.patchValue({
      designation: employee.designationName,
      department: employee.departmentName,
      campusId: employee.campusId
    })
    if (!isEdit) {
      this.onCampusSelected(employee.campusId)
    }
  }

  checkEmployee() {
    if (this.issuanceForm.value.employeeId === null) {
      this.toastService.info("Please Select Employee!", "Issuance")
    }
  }

  checkCampus() {
    this.showMessage = true;
    if (this.issuanceForm.getRawValue().campusId === null) {
      this.toastService.info("Please Select Campus First!", "Issuance")
    }
  }

  onCampusSelected(campusId: number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    //if warehouse is selected then show this message
    if (this.issuanceForm.value.issuanceLines.some(line => line.warehouseId)) {
      this.toastService.info("Please Reselect Store!", "Issuance")
    }

    //set warehouse values to null after campus change
    this.issuanceForm.get('issuanceLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
    this.cdRef.detectChanges()
  }


  @ViewChild(DropdownComponent, { static: false }) dropdown: DropdownComponent;

  onItemSelected(itemId: number, curretIndex?: number) {

    this.issuanceForm.get('issuanceLines')['controls'][curretIndex].controls.fixedAssetId.disable();

    this.ngxsService.products$.subscribe(res => {
      this.isFixedAsset = res.find(x => itemId === x.id)?.isFixedAsset;
    })

    if (this.isFixedAsset) {
      this.ngxsService.assetService.getAssetsProductDropdownById(itemId).subscribe(res => {
        this.issuanceForm.get('issuanceLines')['controls'][curretIndex].controls.fixedAssetId.enable();
        this.fixedAssetsDropdown[curretIndex] = res.result
        this.cdRef.detectChanges()

      })

      this.issuanceForm.get('issuanceLines')['controls'][curretIndex].controls.fixedAssetId.setValidators([Validators.required]);
      this.cdRef.detectChanges()
    }
    else {
      this.issuanceForm.get('issuanceLines')['controls'][curretIndex].controls.fixedAssetId.clearValidators();
      this.issuanceForm.get('issuanceLines')['controls'][curretIndex].controls.fixedAssetId.updateValueAndValidity();
      this.issuanceForm.get('issuanceLines')['controls'][curretIndex].controls.fixedAssetId.setValue(null);
      // this.cdRef.detectChanges()
    }

    // this.logValidationErrors(this.issuanceForm, this.formErrors , this.validationMessages);

  }

  // fixedAsset(caller, curretIndex, itemId?: number): Observable<any>  {
  //   itemId = itemId ? itemId : this.issuanceForm.get('issuanceLines')['controls'][curretIndex].controls.itemId.value
  //   console.log({caller});
  //   if (!itemId) return
  //   return this.ngxsService.assetService.getAssetsProductDropdownById(itemId)
  // } 
}