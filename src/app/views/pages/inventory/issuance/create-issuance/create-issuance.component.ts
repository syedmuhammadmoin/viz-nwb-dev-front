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
import { RequisitionService } from '../../../procurement/requisition/service/requisition.service';
import { IRequisition } from '../../../procurement/requisition/model/IRequisition';

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

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  // For DropDown
  salesItem: IProduct[];

  //param to get requisition
  isRequisition: boolean;
  requisitionMaster: any;

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
    private requisitionService: RequisitionService,
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
      this.isRequisition = param.isRequisition;

      if (id && isIssuance) {
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
    this.showMessage = false;
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
      employeeId: (data.employeeId) ? data.employeeId : data.businessPartnerId,
      issuanceDate: (data.issuanceDate) ? data.issuanceDate : data.requisitionDate,
      campusId: data.campusId
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.issuanceForm.setControl('issuanceLines', this.patchIssuanceLines((this.requisitionMaster) ? data.requisitionLines : data.issuanceLines))
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
      this.toastService.error("Please fill all required fields!", "Issuance")
        return;
    }

    this.mapFormValuesToissuanceModel();

    const isDuplicateLines = this.issuanceModel.issuanceLines.some((a, index) => this.issuanceModel.issuanceLines.some((b, i) => (i !== index && (a.itemId === b.itemId && a.warehouseId === b.warehouseId))))

    if(isDuplicateLines) {
      this.toastService.error("Please Remove Duplicate Line!", "Issuance")
      return;
    }

    this.isLoading = true;
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
    if (this.requisitionMaster) { this.issuanceModel.requisitionId = this.requisitionMaster.id; }
    this.issuanceModel.issuanceLines = this.issuanceForm.value.issuanceLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.issuanceModel.isSubmit = (val === 0) ? false : true;
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

     this.issuanceForm.get('issuanceLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     if(this.showMessage) {
      this.toastService.info("Please Reselect Store!" , "Issuance")
     }
     this.cdRef.detectChanges()
  }
}


