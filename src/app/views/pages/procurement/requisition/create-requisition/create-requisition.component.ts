import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { REQUISITION } from '../../../../shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router} from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import {  Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { BehaviorSubject, Observable } from 'rxjs';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ProductService } from '../../../profiling/product/service/product.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IRequisition } from '../model/IRequisition';
import { RequisitionService } from '../service/requisition.service';
import { IRequisitionLines } from '../model/IRequisitionLines';
import { EmployeeService } from '../../../payroll/employee/service/employee.service';
import { StockService } from '../../../inventory/stock/service/stock.service';
import { RequestRequisitionService } from '../../request-requisition/service/request-requisition.service';
import { IRequestRequisition } from '../../request-requisition/model/IRequestRequisition';
import { RequisitionState } from '../store/requisition.state';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';

@Component({
  selector: 'kt-create-requisition',
  templateUrl: './create-requisition.component.html',
  styleUrls: ['./create-requisition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateRequisitionComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  public permissions = Permissions;
  
  //Loader
  isLoading: boolean;

  // Declaring form variable
  requisitionForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'purchasePrice', 'subTotal', 'warehouseId', 'availableQuantity', 'action'];

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // requisitionModel
  requisitionModel: IRequisition = {} as IRequisition;

  // For DropDown
  salesItem: IProduct[] = [];

  isRequisition: any;

  // param to get request Requisition master
  isRequestRequisition: any;
  requestRequisitionMaster: any;

  // switch
  userStatus = 'Workflow is Applied'

  // For Calculation
  grandTotal = 0 ;
  totalBeforeTax = 0 ;
  totalTax = 0;

  // for getting employee
  employee = {} as any;

  /* handle warehouses gets empty for edit route 
     on first render by onCampusSelected() function
  */
  emptyWarehouses : boolean = true;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition : boolean

  title: string = 'Create Requisition'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  warehouseList: any = new BehaviorSubject<any>([])

  // Validation Messages
  validationMessages = {
    employeeId: {
      required: 'Employee is required.'
    },
    requisitionDate: {
      required: 'Requisition Date is required.'
    }
  }

  formErrors = {
    employeeId: '',
    requisitionDate: ''
  }

  //Injecting Dependencies
  constructor( private fb: FormBuilder,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private requisitionService: RequisitionService,
               private requestService: RequestRequisitionService,
               public activatedRoute: ActivatedRoute,
               private employeeService: EmployeeService,
               private stockService: StockService,
               public productService: ProductService,
               public addButtonService: AddModalButtonService,
               public ngxsService: NgxsCustomService,
               public injector : Injector
             ) {
                super(injector);
               }

  ngOnInit() {

    this.requisitionForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      designation: [''],
      department: [''],
      isWithoutWorkflow: [false],
      requisitionDate: ['', [Validators.required]],
      campusId: [{value: null , disabled: true}],
      requisitionLines: this.fb.array([
        this.addRequisitionLines()
      ])
    });

     //Get Data from Store
     this.ngxsService.getEmployeeFromState();
     this.ngxsService.getAccountLevel4FromState()
     this.ngxsService.getProductFromState();
     this.ngxsService.getCampusFromState();

     //get id by using route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isRequisition = param.isRequisition;
      this.isRequestRequisition = param.isRequestRequisition;
      if (id && this.isRequestRequisition) {
        this.getRequestRequisition(id);
      }
      if (id && this.isRequisition) {
        this.title = 'Edit Requisition'
        this.getRequisition(id);
        this.requisitionForm.get('isWithoutWorkflow').disable()
      }
    })

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result)
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.requisitionForm.get('isWithoutWorkflow').setValue(false);
    this.onToggle({checked: false})
    this.table.renderRows();
  }

  //for save or submit
  isSubmit(val: number) {
    this.requisitionModel.isSubmit = (val === 0) ? false : true;
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.requisitionForm.get('requisitionLines') as FormArray;
    if (itemId) {
      const price = this.salesItem.find(i => i.id === itemId).purchasePrice

      // set values for purchasePrice & tax
      arrayControl.at(index).get('purchasePrice').setValue(price);
      this.onChangeEvent(null, index)
    }
  }

  // For Calculating subTotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number , element?: HTMLElement) {
    const arrayControl = this.requisitionForm.get('requisitionLines') as FormArray;
    const price = (arrayControl.at(index).get('purchasePrice').value) !== null ? arrayControl.at(index).get('purchasePrice').value : null;
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    // calculating subTotal
    const subTotal = (price * quantity)
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    //this.totalCalculation();
  }

  // Calculations
  // Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    // this.totalTax = 0;
    // this.totalBeforeTax = 0;
    // this.grandTotal = 0;
    // const arrayControl = this.requisitionForm.get('requisitionLines') as FormArray;
    // arrayControl.controls.forEach((element, index) => {
    //   const cost = arrayControl.at(index).get('cost').value;
    //   const tax = arrayControl.at(index).get('tax').value;
    //   const quantity = arrayControl.at(index).get('quantity').value;
    //   this.totalTax += ((cost * quantity) * tax) / 100
    //   this.totalBeforeTax += cost * quantity;
    //   this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    // });
  }

  // Add Requisition line
  addRequisitionLineClick(): void {
    const controls = this.requisitionForm.controls.requisitionLines as FormArray;
    controls.push(this.addRequisitionLines());
    this.table.renderRows();
  }

  addRequisitionLines(): FormGroup {
    return this.fb.group({
      itemId: [null, [ Validators.required]],
      description: ['', Validators.required],
      purchasePrice: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      subTotal: [{ value: '0', disabled: true }],
      availableQuantity: [{ value: '0', disabled: true }],
      warehouseId: [null, [ Validators.required]]
    });
  }

  // Remove Requisition line
  removeRequisitionLineClick(requisitionLineIndex: number): void {
    const vendorBillArray = this.requisitionForm.get('requisitionLines') as FormArray;
    vendorBillArray.removeAt(requisitionLineIndex);
    vendorBillArray.markAsDirty();
    vendorBillArray.markAsTouched();
    this.table.renderRows();
  }

  //Get Request Requisition Master Data
  private getRequestRequisition(id: number) {
    this.isLoading = true;
    this.requestService.getRequestRequisitionById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.requestRequisitionMaster = res.result
      this.editRequisition(this.requestRequisitionMaster);
    });
  }

  //Get Requisition Data for Edit
  private getRequisition(id: number) {
    this.isLoading = true;
   this.requisitionService.getRequisitionById(id)
   .pipe(
    take(1),
     finalize(() => {
      this.isLoading = false;
      this.cdRef.detectChanges();
     })
   )
   .subscribe((res: IApiResponse<IRequisition>) => {
      if (!res) {
        return
      }
      this.requisitionModel = res.result
      this.editRequisition(this.requisitionModel)
    });
  }

  //Edit Requisition
  editRequisition(data : IRequisition | IRequestRequisition | any) {
    this.requisitionForm.patchValue({
      employeeId: data.employeeId,
      requisitionDate: data.requisitionDate ?? data.requestDate,
      isWithoutWorkflow: data.isWithoutWorkflow ?? false
    });

    this.emptyWarehouses = false;
    this.onToggle({checked: data.isWithoutWorkflow})
    this.getEmployee(data.employeeId)

    this.requisitionForm.setControl('requisitionLines', this.editRequisitionLines(data.requisitionLines ?? data.requestLines));
  }

  //Edit Requisition Lines
  editRequisitionLines(requisitionLines: IRequisitionLines[]): FormArray {
    const formArray = new FormArray([]);
    requisitionLines.forEach((line : IRequisitionLines | any) => {
      formArray.push(this.fb.group({
        id: (this.isRequestRequisition) ? 0 : line.id,
        itemId: [line.itemId, [ Validators.required]],
        description: [line.description ?? line.description, Validators.required],
        purchasePrice: [line.purchasePrice, [Validators.required, Validators.min(1)]],
        quantity: [line.quantity ?? line.quantity, [Validators.required, Validators.min(1)]],
        subTotal: [{ value: line.subTotal ?? 0, disabled: true }],
        availableQuantity: [{ value: (line.availableQuantity ?? 0), disabled: true }],
        warehouseId: [line.warehouseId, [Validators.required]]
      }))
    })
    return formArray
  }

  //handle isWithoutWorkflow slide
  onToggle(event) {
    console.log(event)
    if (event.checked) {
      this.userStatus = 'Workflow is Removed'
    } else {
      this.userStatus = 'Workflow is Applied'
    }
  }

  // Submit Form Function
  onSubmit(): void {
      if (this.requisitionForm.get('requisitionLines').invalid) {
          this.requisitionForm.get('requisitionLines').markAllAsTouched();
      }
      const controls = <FormArray>this.requisitionForm.controls['requisitionLines'];
      if (controls.length == 0) {
        this.toastService.error('Please add Requisition lines', 'Error')
        return;
      }
    
      if (this.requisitionForm.invalid) {
        this.toastService.error("Please fill all required fields!", "Requisition")
          return;
      }
  
      this.mapFormValuesTorequisitionModel();
  
      const isDuplicateLines = this.requisitionModel.requisitionLines.some((a, index) => this.requisitionModel.requisitionLines.some((b, i) => (i !== index && (a.itemId === b.itemId && a.warehouseId === b.warehouseId))));
  
      if(isDuplicateLines) {
        this.toastService.error("Please Remove Duplicate Items!", "Requisition")
        return;
      }

      this.isLoading = true;
      console.log(this.requisitionModel)
    if (this.requisitionModel.id) {
        this.requisitionService.updateRequisition(this.requisitionModel)
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
          .subscribe((res) => {
            this.toastService.success('Updated Successfully', 'Requisition')
            this.ngxsService.store.dispatch(new IsReloadRequired(RequisitionState, true));
            this.cdRef.detectChanges();
            this.router.navigate(['/' + REQUISITION.ID_BASED_ROUTE('details',this.requisitionModel.id ) ]);
          })
      } else {
        delete this.requisitionModel.id;
        this.requisitionService.createRequisition(this.requisitionModel)
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
          .subscribe(
            (res) => {
              this.toastService.success('Created Successfully', 'Requisition')
              this.ngxsService.store.dispatch(new IsReloadRequired(RequisitionState, true));
              this.router.navigate(['/' + REQUISITION.ID_BASED_ROUTE('details',res.result.id ) ]);
            });
      }
  }

  // Mapping value to model
  mapFormValuesTorequisitionModel() {
    this.requisitionModel.employeeId = this.requisitionForm.value.employeeId;
    this.requisitionModel.requisitionDate = this.transformDate(this.requisitionForm.value.requisitionDate, 'yyyy-MM-dd');
    this.requisitionModel.campusId = this.requisitionForm.getRawValue().campusId;
    this.requisitionModel.isWithoutWorkflow = this.requisitionForm.getRawValue().isWithoutWorkflow;
    this.requisitionModel.requestId = this.requestRequisitionMaster?.id || this.requisitionModel?.requestId;
    this.requisitionModel.requisitionLines = this.requisitionForm.value.requisitionLines;
  };

   // open business partner dialog
   openBusinessPartnerDialog() {
    if (this.permission.isGranted(this.permissions.BUSINESSPARTNER_CREATE)) {
      this.addButtonService.openBusinessPartnerDialog();
    }
  }
 // open product dialog
  openProductDialog() {
    if (this.permission.isGranted(this.permissions.PRODUCT_CREATE)) {
      this.addButtonService.openProductDialog();
    }
  }

  // getting employee data by id
  getEmployee(id: number) {
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
      this.checkSelected(this.employee)
      this.cdRef.detectChanges()
    })
  }

  checkSelected(employee) {
    this.requisitionForm.patchValue({
      designation: employee.designationName,
      department: employee.departmentName,
      campusId: employee.campusId
    })

    this.onCampusSelected(employee.campusId) 
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.requisitionForm.dirty;
  }

  checkEmployee() {
    if(this.requisitionForm.value.employeeId === null) {
      this.toastService.info("Please Select Employee!", "Requisition")
    }
  }

  onCampusSelected(campusId : number) {

    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.emptyWarehouses){
      if(this.requisitionForm.value.requisitionLines.some(line => line.warehouseId)){
        this.toastService.info("Please Reselect Store!" , "Requisition")
      }
  
       this.requisitionForm.get('requisitionLines')['controls'].map((line: any) => {
          line.controls.warehouseId.setValue(null);
          line.controls.availableQuantity.setValue(0);
          return line
       })
    }
     this.emptyWarehouses = true;
     this.cdRef.detectChanges()
  }

  //get Item Stock by item and warehouse Id
  getStock(index) {
    const arrayControl = this.requisitionForm.get('requisitionLines') as FormArray;
    const itemId = arrayControl.at(index).get('itemId').value
    const warehouseId = arrayControl.at(index).get('warehouseId').value

  
    if(itemId && warehouseId) {
      this.stockService.getStockByIds({itemId: itemId, warehouseId: warehouseId})
      .subscribe((res) => arrayControl.at(index).get('availableQuantity').setValue((res.result) ? res.result.availableQuantity : 0))
    }
  }
}
