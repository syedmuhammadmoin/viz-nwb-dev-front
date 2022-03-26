import { BILL } from '../../../../shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable} from 'rxjs';
import { IVendorBill} from '../model/IVendorBill';
import { VendorBillService} from '../services/vendor-bill.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { FormsCanDeactivate } from '../../../../shared/route-guards/form-confirmation.guard';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {  Permissions } from 'src/app/views/shared/AppEnum';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { PurchaseOrderService } from '../../purchase-order/service/purchase-order.service';

@Component({
  selector: 'kt-create-vendor-bill',
  templateUrl: './create-vendor-bill.component.html',
  styleUrls: ['./create-vendor-bill.component.scss'],
  providers:[NgxsCustomService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateVendorBillComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
 // for permissions
 public permissions = Permissions;
  // For Loading
  isLoading: boolean;

  // Declaring form variable
  vendorBillForm: FormGroup;

  // For Table Columns
  // displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'ton', 'price', 'tax', 'subTotal', 'locationId', 'action']
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'cost', 'tax', 'subTotal', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Vendor Bill Model
  vendorBillModel: IVendorBill;

  // For DropDown
  salesItem: IProduct[];

  // purchase order data
  purchaseOrderMaster: any;

  isBill: any;

  // params to get purchase order
  isPurchaseOrder: any;

  // for calculating grandtotal , totalBefore Tax, total Tax
  grandTotal = 0;
  totalBeforeTax = 0;
  totalTax = 0;

  // Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition : boolean

  // Validation messages..
  validationMessages = {
    vendorName: {
      required: 'Vendor Name is required.',
    },
    // vendorBillRef: {
    //   required: 'Vendor Bill Reference is required.',
    // },
    billDate: {
      required: 'Bill Date is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
    // dueDate: {
    //   required: 'Due Date is required.',
    // },
    // contact: {
    //   required: 'Contact Name is required',
    //   minlength: 'Contact contains atleast 10 digits',
    //   maxlength: 'Contact not greater than 11 digits'
    // },
  };

  // error keys..
  formErrors = {
    vendorName: '',
    billDate: '',
    campusId: null
    //dueDate: '',
  };

  constructor(
    private fb: FormBuilder,
    private billService: VendorBillService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public  activatedRoute: ActivatedRoute,
    private purchaseOrderService: PurchaseOrderService,
    public ngxsService:NgxsCustomService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.vendorBillForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      //vendorBillRef: [''],
      billDate: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      dueDate: [''],
      // contact: [''],
      vendorBillLines: this.fb.array([
        this.addVendorBillLines()
      ])
    });

    this.vendorBillModel = {
      id: null,
      vendorId: null,
      //vendorBillRef: '',
      billDate: null,
      dueDate: null,
      campusId: null,
      //contact: '',
      billLines: []
    }

    // get vendor from state
    this.ngxsService.getBusinessPartnerFromState();
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();
    // get locations
    this.ngxsService.getLocationFromState();

     // get id through route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isBill = param.isBill;
      this.isPurchaseOrder = param.isPurchaseOrder;
      if (id && this.isBill) {
        this.getBill(id);
        // this.getPurchaseOrder(id);
      }
      else if (id && this.isPurchaseOrder) {
        this.getPurchaseOrder(id);
      }
    })

    this.productService.getProducts().subscribe(res => this.salesItem = res.result)

    // handling dueDate logic
    this.vendorBillForm.get('billDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.vendorBillForm.get('dueDate').value < this.vendorBillForm.get('billDate').value
    })
  }

  // Form Reset
  reset() {
    const vendorBillLineArray = this.vendorBillForm.get('vendorBillLines') as FormArray;
    vendorBillLineArray.clear();
    this.vendorBillForm.reset(this.vendorBillForm.value);
    this.totalBeforeTax = this.grandTotal = this.totalTax = 0;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.vendorBillForm.get('vendorBillLines') as FormArray;
    if (itemId) {
      const cost = this.salesItem.find(i => i.id === itemId).cost
      const tax = this.salesItem.find(i => i.id === itemId).salesTax
      // set values for price & tax
      arrayControl.at(index).get('cost').setValue(cost);
      arrayControl.at(index).get('tax').setValue(tax);
      // Calculating subtotal
      const quantity = arrayControl.at(index).get('quantity').value;
      const subTotal = (cost * quantity) + ((cost * quantity) * (tax / 100))
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  // onChangeEvent for calculating subtotal
  onChangeEvent(value: any, index: number ,element?: HTMLElement) {
    const arrayControl = this.vendorBillForm.get('vendorBillLines') as FormArray;
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
    const arrayControl = this.vendorBillForm.get('vendorBillLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      const cost = arrayControl.at(index).get('cost').value;
      const tax = arrayControl.at(index).get('tax').value;
      const quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((cost * quantity) * tax) / 100
      this.totalBeforeTax += cost * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
  }

  // to add bill line
  addVendorBillLineClick(): void {
    const controls = this.vendorBillForm.controls.vendorBillLines as FormArray;
    controls.push(this.addVendorBillLines());
    this.table.renderRows();
  }

  addVendorBillLines(): FormGroup {
    return this.fb.group({
      itemId: [0],
      description: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.min(1)]],
      tax: [0, [Validators.max(100), Validators.min(0)]],
      subTotal: [{value: '0', disabled: true}],
      accountId: ['', [Validators.required]],
      //locationId: ['', [Validators.required]],
    });
  }

  // to remove bill line
  removeVendorBillLineClick(vendorBillLineIndex: number): void {
    const vendorBillArray = this.vendorBillForm.get('vendorBillLines') as FormArray;
    vendorBillArray.removeAt(vendorBillLineIndex);
    vendorBillArray.markAsDirty();
    vendorBillArray.markAsTouched();
    this.table.renderRows();
  }

  //Get purchase Order Master Data
  private getPurchaseOrder(id: number) {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseMasterById(id).subscribe((res) => {
      this.purchaseOrderMaster = res.result;
      this.patchBill(this.purchaseOrderMaster);
      this.isLoading = false;
    }, (err) => {
      console.log(err);
    });
  }

  // Get Bill Data for Edit
  private getBill(id: any) {
    this.isLoading = true;
   this.billService.getVendorBillMaster(id).subscribe((res) => {
      if (!res) {
        return
      }
      this.vendorBillModel = res.result
      this.patchBill(this.vendorBillModel)
      this.isLoading = false;
    });
  }

  //Patch Bill Form through Bill Or purchase Order Master Data
  patchBill(data : any) {
    this.vendorBillForm.patchValue({
      vendorName: data.vendorId,
      //vendorBillRef: data.vendorBillRef,
      billDate: (data.billDate) ? data.billDate : data.poDate,
      dueDate: data.dueDate,
      campusId: data.campusId
      //contact: data.contact,
    });

    this.vendorBillForm.setControl('vendorBillLines', this.patchBillLines((this.purchaseOrderMaster) ? data.purchaseOrderLines : data.billLines))
    this.totalCalculation();
  }

  //Patch Bill Lines From purchase Order Or Bill Master Data
  patchBillLines(Lines: any): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: any) => {
      console.log(line.subtotal);
      formArray.push(this.fb.group({
        id: line.id,
        itemId: line.itemId,
        description: line.description,
        cost: line.cost,
        quantity: line.quantity,
        tax: line.tax,
        subTotal: [{ value: line.subtotal, disabled: true }],
        accountId: line.accountId,
       // locationId: line.locationId,
      }))
    })
    return formArray
  }


  // Submit Form Function
  onSubmit(): void {
    if (this.vendorBillForm.get('vendorBillLines').invalid) {
      this.vendorBillForm.get('vendorBillLines').markAllAsTouched();
    }
    const controls = this.vendorBillForm.controls.vendorBillLines as FormArray;
    if (controls.length == 0) {
      this.toastService.error('Please add bill lines', 'Error')
      return;
    }
    if (this.vendorBillForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToVendorBillModel();
    console.log(this.vendorBillModel)
    if (this.vendorBillModel.id) {
        this.billService.updateVendorBill(this.vendorBillModel)
          .pipe(
            take(1),
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe((res) => {
            this.toastService.success('' + res.message, 'Updated Successfully')
            this.cdRef.detectChanges();
            this.router.navigate(['/' + BILL.ID_BASED_ROUTE('details',this.vendorBillModel.id )]);
          },
            (err) => {
              this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
              this.isLoading = false;
              this.cdRef.detectChanges()
            })
      } else {
        delete this.vendorBillModel.id;
        this.billService.createVendorBill(this.vendorBillModel)
          .pipe(
            take(1),
            finalize(() => this.isLoading = false))
          .subscribe(
            (res) => {
              this.toastService.success('' + res.message, 'Created Successfully')
              this.router.navigate(['/'+BILL.LIST])
            },
            (err: any) => {
              this.isLoading = false;
              this.cdRef.detectChanges();
              this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Creating')
              console.log(err)
            }
          );
      }
  }

  mapFormValuesToVendorBillModel() {
    this.vendorBillModel.vendorId = this.vendorBillForm.value.vendorName;
    //this.vendorBillModel.vendorBillRef = this.vendorBillForm.value.vendorBillRef;
    this.vendorBillModel.billDate = this.vendorBillForm.value.billDate;
    this.vendorBillModel.dueDate = this.vendorBillForm.value.dueDate;
    this.vendorBillModel.campusId = this.vendorBillForm.value.campusId;
    //this.vendorBillModel.contact = this.vendorBillForm.value.contact;
    this.vendorBillModel.billLines = this.vendorBillForm.value.vendorBillLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.vendorBillModel.isSubmit = (val === 0) ? false : true;
  }

  // private getPurchaseOrder(id: number) {
  //   this.purchaseOrderService.getPurchaseMasterById(id).subscribe((res) => {
  //     this.purchaseOrderMaster = res.result;
  //     this.patchPurchaseOrder(this.purchaseOrderMaster);
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  // private patchPurchaseOrder(purchaseOrderMaster) {
  //   this.vendorBillForm.patchValue({
  //     vendorName: purchaseOrderMaster.vendorId,
  //     billDate: purchaseOrderMaster.poDate,
  //     dueDate: purchaseOrderMaster.dueDate,
  //     contact: purchaseOrderMaster.contact,
  //   });
  //   this.vendorBillForm.setControl('vendorBillLines', this.patchVendorBillLines(purchaseOrderMaster.purchaseOrderLines))
  //   this.totalCalculation();
  // }

  // private patchVendorBillLines(billLines : any): FormArray {
  //   const formArray = new FormArray([]);
  //   billLines.forEach((line : any) => {
  //     formArray.push(this.fb.group({
  //       itemId: line.itemId,
  //       description: line.description,
  //       cost: line.cost,
  //       quantity: line.quantity,
  //       tax: line.tax,
  //       subTotal: [{value: line.subtotal, disabled: true}],
  //       accountId: line.accountId,
  //       locationId: line.locationId,
  //     }))
  //   })
  //   return formArray
  // };

  canDeactivate(): boolean | Observable<boolean> {
    return !this.vendorBillForm.dirty;
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

}
