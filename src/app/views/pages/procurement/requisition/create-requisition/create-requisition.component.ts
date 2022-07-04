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

@Component({
  selector: 'kt-create-requisition',
  templateUrl: './create-requisition.component.html',
  styleUrls: ['./create-requisition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateRequisitionComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  public permissions = Permissions;
  
  // For Loading
  isLoading: boolean;

  // Declaring form variable
  requisitionForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'warehouseId', 'action'];

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // requisitionModel
  requisitionModel: IRequisition;

  // For DropDown
  salesItem: IProduct[] = [];

  isRequisition: any;

  // For Calculation
  grandTotal = 0 ;
  totalBeforeTax = 0 ;
  totalTax = 0;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition : boolean

  title: string = 'Create Requisition'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;


  // Validation Messages
  validationMessages = {
    businessPartnerId: {
      required: 'Employee is required.'
    },
    requisitionDate: {
      required: 'Order Date is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
  }

  formErrors = {
    businessPartnerId: '',
    requisitionDate: '',
    campusId: ''
  }

  // Injecting Dependencies
  constructor( private fb: FormBuilder,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private requisitionService: RequisitionService,
               public activatedRoute: ActivatedRoute,
               public productService: ProductService,
               public addButtonService: AddModalButtonService,
               public ngxsService: NgxsCustomService,
               public injector : Injector
             ) {
                super(injector);
               }

  ngOnInit() {

    this.requisitionForm = this.fb.group({
      businessPartnerId: ['', [Validators.required]],
      requisitionDate: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      requisitionLines: this.fb.array([
        this.addRequisitionLines()
      ])
    });

    this.requisitionModel = {
      id: null,
      businessPartnerId: null,
      requisitionDate: '',
      campusId : null,
      requisitionLines: []
    }

     // get Vendor from state
     this.ngxsService.getBusinessPartnerFromState();
     // get Accounts of level 4 from state
     this.ngxsService.getAccountLevel4FromState()
     // get Ware house location from state
     this.ngxsService.getWarehouseFromState();
     // get item from state
     this.ngxsService.getProductFromState();
     // get Campus from state
     this.ngxsService.getCampusFromState();

     //get id by using route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isRequisition = param.isRequisition;
      if (id && this.isRequisition) {
        this.title = 'Edit Requisition'
        this.getRequisition(id);
      }
    })

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result)

    //handling dueDate logic
    // this.requisitionForm.get('PODate').valueChanges.subscribe((value) => {
    //   this.minDate = new Date(value);
    //   this.dateCondition = this.requisitionForm.get('dueDate').value < this.requisitionForm.get('PODate').value
    // })
  }

  // Form Reset
  reset() {
    const requisitionLineArray = this.requisitionForm.get('requisitionLines') as FormArray;
    this.formDirective.resetForm();
    requisitionLineArray.clear();
    this.showMessage = false;
    this.table.renderRows();
  }

  //for save or submit
  isSubmit(val: number) {
    this.requisitionModel.isSubmit = (val === 0) ? false : true;
  }


  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    // const arrayControl = this.requisitionForm.get('requisitionLines') as FormArray;
    // if (itemId) {
    //   const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
    //   const salesTax = this.salesItem.find(i => i.id === itemId).salesTax
    //   // set values for price & tax
    //   arrayControl.at(index).get('cost').setValue(cost);
    //   arrayControl.at(index).get('tax').setValue(salesTax);
    //   // Calculating subtotal
    //   const quantity = arrayControl.at(index).get('quantity').value;
    //   const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
    //   arrayControl.at(index).get('subTotal').setValue(subTotal);
    // }
  }

  // For Calculating subtotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number , element?: HTMLElement) {
    // const arrayControl = this.requisitionForm.get('requisitionLines') as FormArray;
    // const cost = (arrayControl.at(index).get('cost').value) !== null ? arrayControl.at(index).get('cost').value : null;
    // const salesTax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    // const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    // // calculating subTotal
    // const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
    // arrayControl.at(index).get('subTotal').setValue(subTotal);
    // this.totalCalculation();
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
      itemId: ['', [ Validators.required]],
      description: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      warehouseId: [null],
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
  editRequisition(requisition : IRequisition) {
    this.requisitionForm.patchValue({
      businessPartnerId: requisition.businessPartnerId,
      requisitionDate: requisition.requisitionDate,
      campusId: requisition.campusId
    });

    this.onCampusSelected(requisition.campusId)
    this.showMessage = true;

    this.requisitionForm.setControl('requisitionLines', this.editrequisitionLines(requisition.requisitionLines));
    this.totalCalculation();
  }

  //Edit Requisition Lines
  editrequisitionLines(requisitionLines: IRequisitionLines[]): FormArray {
    const formArray = new FormArray([]);
    requisitionLines.forEach((line : IRequisitionLines | any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: [line.itemId, [ Validators.required]],
        description: [line.description, Validators.required],
        quantity: [line.quantity, [Validators.required, Validators.min(1)]],
        warehouseId: [line.warehouseId]
      }))
    })
    return formArray
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
  
      const isDuplicateLines = this.requisitionModel.requisitionLines.some((a, index) => this.requisitionModel.requisitionLines.some((b, i) => (i !== index && (a.itemId === b.itemId && a.warehouseId === b.warehouseId))))
  
      if(isDuplicateLines) {
        this.toastService.error("Please Remove Duplicate Line!", "Requisition")
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
              this.router.navigate(['/' + REQUISITION.ID_BASED_ROUTE('details',res.result.id ) ]);
            });
      }
  }

  // Mapping value to model
  mapFormValuesTorequisitionModel() {
    this.requisitionModel.businessPartnerId = this.requisitionForm.value.businessPartnerId;
    this.requisitionModel.requisitionDate = this.transformDate(this.requisitionForm.value.requisitionDate, 'yyyy-MM-dd');
    this.requisitionModel.campusId = this.requisitionForm.value.campusId;
    this.requisitionModel.requisitionLines = this.requisitionForm.value.requisitionLines;
  };

   // open business partner dialog
   openBusinessPartnerDialog() {
    if (this.permission.isGranted(this.permissions.BUSINESSPARTNER_CREATE)) {
      this.addButtonService.openBuinessPartnerDialog();
    }
  }
 // open product dialog
  openProductDialog() {
    if (this.permission.isGranted(this.permissions.PRODUCT_CREATE)) {
      this.addButtonService.openProductDialog();
    }
  }
  // open warehouse Location dialog
  // openLocationDialog() {
  //   if (this.permission.isGranted(this.permissions. LOCATION_CREATE)) {
  //     this.addButtonService.openLocationDialog();
  //   }
  // }
  canDeactivate(): boolean | Observable<boolean> {
    return !this.requisitionForm.dirty;
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

     this.requisitionForm.get('requisitionLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     if(this.showMessage) {
      this.toastService.info("Please Reselect Store!" , "Requisition")
     }
     this.cdRef.detectChanges()
  }
}
