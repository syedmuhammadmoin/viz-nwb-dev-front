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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-create-issuance',
  templateUrl: './create-issuance.component.html',
  styleUrls: ['./create-issuance.component.scss']
})

export class CreateIssuanceComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  issuanceForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Issuance Model
  issuanceModel: IIssuance;

  warehouseList: any = new BehaviorSubject<any>([])

  // For DropDown
  salesItem: IProduct[];

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  title: string = 'Create Issuance'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    employeeId: {
      required: 'Employee Name is required.',
    },
    issuanceDate: {
      required: 'Issuance Date is required.',
    },
    campusId: {
      required: 'Campus is required.',
    }
  };

  // error keys..
  formErrors = {
    employeeId: '',
    issuanceDate: '',
    campusId: '',
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private issuanceService: IssuanceService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.issuanceForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      issuanceDate: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      issuanceLines: this.fb.array([
        this.addIssuanceLines()
      ])
    });

    this.issuanceModel = {
      id: null,
      employeeId: null,
      issuanceDate: null,
      campusId: null,
      issuanceLines: []
    }
    // get customer from state
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getEmployeeFromState();
   
    // get Ware house from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState()
    
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isIssuance = param.isIssuance;
      if (id && isIssuance) {
        this.isLoading = true;
        this.title = 'Edit Issuance'
        this.getIssuance(id);
      }
    });

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result)

    //handling dueDate logic
    // this.issuanceForm.get('issuanceDate').valueChanges.subscribe((value) => {
    //   this.minDate = new Date(value);
    //   this.dateCondition = this.issuanceForm.get('dueDate').value < this.issuanceForm.get('issuanceDate').value
    // })
  }

  // Form Reset
  reset() {
    const issuanceLineArray = this.issuanceForm.get('issuanceLines') as FormArray;
    this.formDirective.resetForm();
    issuanceLineArray.clear();
    this.table.renderRows();
  }

  //Add issuance Lines
  addIssuanceLineClick(): void {
    const controls = this.issuanceForm.controls.issuanceLines as FormArray;
    controls.push(this.addIssuanceLines());
    this.table.renderRows();
  }

  // Add Issuance Lines
  addIssuanceLines(): FormGroup {
    return this.fb.group({
      itemId: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', [Validators.required,Validators.min(1)]],
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
    });
  }

  //Patch Issuance Form through issuance Or sales Order Master Data
  patchIssuance(data: IIssuance) {
    this.issuanceForm.patchValue({
      employeeId: data.employeeId,
      issuanceDate: data.issuanceDate ,
      campusId: data.campusId
    });

    this.onCampusSelected(data.campusId)

    this.issuanceForm.setControl('issuanceLines', this.patchIssuanceLines(data.issuanceLines))
  }

  //Patch Issuance Lines
  patchIssuanceLines(lines: IIssuanceLines[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: [line.itemId , Validators.required],
        description: [line.description , Validators.required],
        quantity: [line.quantity , [Validators.required,Validators.min(1)]],
        warehouseId: [line.warehouseId , Validators.required],
      }))
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
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToissuanceModel();
    //console.log(this.issuanceModel)
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
          this.toastService.success('Updated Successfully', 'issuance')
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
            this.toastService.success('Created Successfully', 'issuance')
            // this.router.navigate(['/' + issuance.LIST])
            this.router.navigate(['/' + ISSUANCE.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToissuanceModel() {
    this.issuanceModel.employeeId = this.issuanceForm.value.employeeId;
    this.issuanceModel.issuanceDate = this.transformDate(this.issuanceForm.value.issuanceDate, 'yyyy-MM-dd');
    this.issuanceModel.campusId = this.issuanceForm.value.campusId;
    this.issuanceModel.issuanceLines = this.issuanceForm.value.issuanceLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.issuanceModel.isSubmit = (val === 0) ? false : true;
  }

  onCampusSelected(campusId : number , buttonClicked?: boolean) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

     this.issuanceForm.get('issuanceLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     if(buttonClicked) {
      this.toastService.info("Please Reselect Store!" , "Issuance")
     }
     this.cdRef.detectChanges()
  }
}


