import { PURCHASE_ORDER } from '../../../../shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IPurchaseOrder} from '../model/IPurchaseOrder';
import { PurchaseOrderService} from '../service/purchase-order.service';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router} from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import {  Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { Observable } from 'rxjs';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ProductService } from '../../../profiling/product/service/product.service';
import { IPurchaseOrderLines } from '../model/IPurchaseOrderLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.scss'],
  providers:[NgxsCustomService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreatePurchaseOrderComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // for sales Order Data
  salesOrderMaster : any;

  // Declaring form variable
  purchaseOrderForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'cost', 'tax', 'subTotal', 'warehouseId', 'action'];

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // purchaseOrderModel
  purchaseOrderModel: IPurchaseOrder;

  // For DropDown
  salesItem: IProduct[] = [];

  isPurchaseOrder: any;

  // For Calculation
  grandTotal = 0 ;
  totalBeforeTax = 0 ;
  totalTax = 0;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition : boolean


  // Validation Messages
  validationMessages = {
    vendorName: {
      required: 'Name is required'
    },
    PODate: {
      required: 'Order Date is required'
    },
    dueDate: {
      required: 'Due Date is required'
    },
    campusId: {
      required: 'Campus is required'
    },
  }

  formErrors = {
    vendorName: '',
    PODate: '',
    dueDate: '',
    campusId: ''
  }

  // Injecting Dependencies
  constructor( private fb: FormBuilder,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private poService: PurchaseOrderService,
               public activatedRoute: ActivatedRoute,
               public productService: ProductService,
               public addButtonService: AddModalButtonService,
               public ngxsService: NgxsCustomService,
               public injector : Injector
             ) {
                super(injector);
               }

  ngOnInit() {

    this.purchaseOrderForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      PODate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      contact: [''],
      campusId: ['', [Validators.required]],
      purchaseOrderLines: this.fb.array([
        this.addPurchaseOrderLines()
      ])
    });

    this.purchaseOrderModel = {
      id: null,
      vendorId: null,
      poDate: null,
      dueDate: null,
      contact: null,
      campusId: null,
      purchaseOrderLines: []
    }

     // get Vendor from state
     this.ngxsService.getBusinessPartnerFromState();
     // get Accounts of level 4 from state
     this.ngxsService.getAccountLevel4FromState()
     // get Ware house location from state
     this.ngxsService.getWarehouseFromState();
     // get item from state
     this.ngxsService.getProductFromState();

     this.ngxsService.getCampusFromState();

     //get id by using route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isPurchaseOrder = param.isPurchaseOrder;
      if (id && this.isPurchaseOrder) {
        this.getPurchaseOrder(id);
        //this.getSalesOrder(id);
      }
    })

    this.productService.getProducts().subscribe(res => this.salesItem = res.result)

    //handling dueDate logic
    this.purchaseOrderForm.get('PODate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.purchaseOrderForm.get('dueDate').value < this.purchaseOrderForm.get('PODate').value
    })
  }

  // Form Reset
  reset() {
    const purchaseOrderLineArray = this.purchaseOrderForm.get('purchaseOrderLines') as FormArray;
    purchaseOrderLineArray.clear();
    this.table.renderRows();
  }

  //for save or submit
  isSubmit(val: number) {
    this.purchaseOrderModel.isSubmit = (val === 0) ? false : true;
  }


  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.purchaseOrderForm.get('purchaseOrderLines') as FormArray;
    if (itemId) {
      const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
      const salesTax = this.salesItem.find(i => i.id === itemId).salesTax
      // set values for price & tax
      arrayControl.at(index).get('cost').setValue(cost);
      arrayControl.at(index).get('tax').setValue(salesTax);
      // Calculating subtotal
      const quantity = arrayControl.at(index).get('quantity').value;
      const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  // For Calculating subtotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number , element?: HTMLElement) {
    const arrayControl = this.purchaseOrderForm.get('purchaseOrderLines') as FormArray;
    const cost = (arrayControl.at(index).get('cost').value) !== null ? arrayControl.at(index).get('cost').value : null;
    const salesTax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    // calculating subTotal
    const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    this.totalCalculation();
  }

  // Calculations
  // Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    this.totalTax = 0;
    this.totalBeforeTax = 0;
    this.grandTotal = 0;
    const arrayControl = this.purchaseOrderForm.get('purchaseOrderLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      const cost = arrayControl.at(index).get('cost').value;
      const tax = arrayControl.at(index).get('tax').value;
      const quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((cost * quantity) * tax) / 100
      this.totalBeforeTax += cost * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
  }

  // Add purchase Order line
  addPurchaseOrderLineClick(): void {
    const controls = this.purchaseOrderForm.controls.purchaseOrderLines as FormArray;
    controls.push(this.addPurchaseOrderLines());
    this.table.renderRows();
  }

  addPurchaseOrderLines(): FormGroup {
    return this.fb.group({
      itemId: ['', [ Validators.required]],
      description: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      tax: [0, [Validators.max(100), Validators.min(0)]],
      subTotal: [{value: '0', disabled: true}],
      accountId: ['', [Validators.required]],
      warehouseId: [''],
    });
  }

  // Remove purchase Order line
  removePurchaseOrderLineClick(purchaseOrderLineIndex: number): void {
    const vendorBillArray = this.purchaseOrderForm.get('purchaseOrderLines') as FormArray;
    vendorBillArray.removeAt(purchaseOrderLineIndex);
    vendorBillArray.markAsDirty();
    vendorBillArray.markAsTouched();
    this.table.renderRows();
  }

  //Get purchase Order Data for Edit
  private getPurchaseOrder(id: number) {
    this.isLoading = true;
   this.poService.getPurchaseOrderById(id)
   .subscribe((res: IApiResponse<IPurchaseOrder>) => {
      if (!res) {
        return
      }
      this.purchaseOrderModel = res.result
      this.editPurchaseOrder(this.purchaseOrderModel)
      this.isLoading = false;
    });
  }

  //Edit purchase Order
  editPurchaseOrder(purchaseOrder : IPurchaseOrder) {
    console.log(purchaseOrder.vendorId)
    this.purchaseOrderForm.patchValue({
      vendorName: purchaseOrder.vendorId,
      PODate: purchaseOrder.poDate,
      dueDate: purchaseOrder.dueDate,
      contact: purchaseOrder.contact,
      campusId: purchaseOrder.campusId
    });

    this.purchaseOrderForm.setControl('purchaseOrderLines', this.editPurchaseOrderLines(purchaseOrder.purchaseOrderLines));
    this.totalCalculation();
  }

  //Edit purchase Order Lines
  editPurchaseOrderLines(purchaseOrderLines: IPurchaseOrderLines[]): FormArray {
    const formArray = new FormArray([]);
    purchaseOrderLines.forEach((line : IPurchaseOrderLines | any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: [line.itemId, [ Validators.required]],
        description: [line.description, Validators.required],
        cost: [line.cost, [Validators.required, Validators.min(1)]],
        quantity: [line.quantity, [Validators.required, Validators.min(1)]],
        tax: [line.tax, [Validators.max(100), Validators.min(0)]],
        subTotal: [{value: line.subTotal, disabled: true}],
        accountId: [line.accountId, [Validators.required]],
        warehouseId: [line.warehouseId]
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
      if (this.purchaseOrderForm.get('purchaseOrderLines').invalid) {
          this.purchaseOrderForm.get('purchaseOrderLines').markAllAsTouched();
      }
      const controls = <FormArray>this.purchaseOrderForm.controls['purchaseOrderLines'];
      if (controls.length == 0) {
        this.toastService.error('Please add purchase order lines', 'Error')
        return;
      }
      if (this.purchaseOrderForm.invalid) {
          return;
      }

      this.isLoading = true;
      this.mapFormValuesToPurchaseOrderModel();
      console.log(this.purchaseOrderModel)
    if (this.purchaseOrderModel.id) {
        this.poService.updatePurchaseOrder(this.purchaseOrderModel)
          .pipe(
            take(1),
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe((res) => {
            this.toastService.success('' + res.message, 'Updated Successfully')
            this.cdRef.detectChanges();
            this.router.navigate(['/' +PURCHASE_ORDER.ID_BASED_ROUTE('details',this.purchaseOrderModel.id ) ]);
          },
            // (err) => {
            //   this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            //   this.isLoading = false;
            //   this.cdRef.detectChanges()
            // }
            )
      } else {
        delete this.purchaseOrderModel.id;
        this.poService.createPurchaseOrder(this.purchaseOrderModel)
          .pipe(
            take(1),
            finalize(() => this.isLoading = false))
          .subscribe(
            (res) => {
              this.toastService.success('' + res.message, 'Created Successfully')
              this.router.navigate(['/'+ PURCHASE_ORDER.LIST])
            },
            // (err) => {
            //   this.isLoading = false;
            //   this.cdRef.detectChanges();
            //   this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Creating')
            // }
          );
      }
  }

  // Mapping value to model
  mapFormValuesToPurchaseOrderModel() {
    this.purchaseOrderModel.vendorId = this.purchaseOrderForm.value.vendorName;
    this.purchaseOrderModel.poDate = this.transformDate(this.purchaseOrderForm.value.PODate, 'yyyy-MM-dd');
    this.purchaseOrderModel.dueDate = this.transformDate(this.purchaseOrderForm.value.dueDate, 'yyyy-MM-dd');
    this.purchaseOrderModel.contact = this.purchaseOrderForm.value.contact;
    this.purchaseOrderModel.campusId = this.purchaseOrderForm.value.campusId;
    this.purchaseOrderModel.purchaseOrderLines = this.purchaseOrderForm.value.purchaseOrderLines;
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
  openLocationDialog() {
    if (this.permission.isGranted(this.permissions. LOCATION_CREATE)) {
      this.addButtonService.openLocationDialog();
    }
  }


  canDeactivate(): boolean | Observable<boolean> {
    return !this.purchaseOrderForm.dirty;
  }
}







