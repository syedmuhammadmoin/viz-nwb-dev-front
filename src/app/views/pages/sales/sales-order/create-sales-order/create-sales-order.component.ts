import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ISalesOrder } from '../model/ISalesOrder'
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SaleOrderService } from '../service/sale-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { Observable } from 'rxjs';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { SALES_ORDER } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ISalesOrderLines } from '../model/ISalesOrderLines';

@Component({
  selector: 'kt-create-sales-order',
  templateUrl: './create-sales-order.component.html',
  styleUrls: ['./create-sales-order.component.scss']
})

export class CreateSalesOrderComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  //Declaring form variable
  salesOrderForm: FormGroup;

  //For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'price', 'tax', 'subTotal', 'locationId', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  //sales Order Model
  salesOrderModel: ISalesOrder;

  isSalesOrder: boolean;

  //For Dropdown
  salesItem: IProduct[] = [];

  //For Calculation
  grandTotal: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  //Validation Messages
  validationMessages = {
    customerName: {
      required: 'Customer Name is required.'
    },
    salesOrderDate: {
      required: 'Order Date is required.',
    },
    dueDate: {
      required: 'Due Date is required.'
    }
  }

  //error keys
  formErrors = {
    customerName: '',
    salesOrderDate: '',
    dueDate: '',
  }

  //Injecting Dependencies
  constructor(private fb: FormBuilder,
    private soService: SaleOrderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public addButtonService: AddModalButtonService,
    public productService: ProductService,
   public ngxsService: NgxsCustomService,
    injector: Injector
  ) {
    super(injector);
  }


  ngOnInit() {
    this.salesOrderForm = this.fb.group({
      customerName: ['', [Validators.required]],
      salesOrderDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      contactNo: [''],
      salesOrderLines: this.fb.array([
        this.addSalesOrderLines()
      ])
    });

    this.salesOrderModel = {
      id: null,
      customerId: null,
      salesOrderDate: null,
      dueDate: null,
      contact: null,
      salesOrderLines: []
    }

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isSalesOrder = param.isSalesOrder;
      if (id && this.isSalesOrder) {
        this.getSalesOrder(id);
      }
    })

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result)

    //handling dueDate logic
    this.salesOrderForm.get('salesOrderDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.salesOrderForm.get('dueDate').value < this.salesOrderForm.get('salesOrderDate').value
    });
   // get customer from state
   this.ngxsService.getBusinessPartnerFromState();
   // get Accounts of level 4 from state
   this.ngxsService.getAccountLevel4FromState()
   // get Ware house location from state
   this.ngxsService.getWarehouseFromState();
   // get item from state
   this.ngxsService.getProductFromState();
  }

  // Form Reset
  reset() {
    const salesOrderLineArray = this.salesOrderForm.get('salesOrderLines') as FormArray;
    salesOrderLineArray.clear();
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.salesOrderForm.get('salesOrderLines') as FormArray;
    if (itemId) {
      const price = this.salesItem.find(i => i.id === itemId).salesPrice
      const tax = this.salesItem.find(i => i.id === itemId).salesTax
      // set values for price & tax
      arrayControl.at(index).get('price').setValue(price);
      arrayControl.at(index).get('tax').setValue(tax);
      // Calculating subtotal
      const quantity = arrayControl.at(index).get('quantity').value;
      const subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  //For Calculating subtotal
  onChangeEvent(value: unknown, index: number, element?: HTMLElement) {

    const arrayControl = this.salesOrderForm.get('salesOrderLines') as FormArray;
    const price = (arrayControl.at(index).get('price').value) !== null ? arrayControl.at(index).get('price').value : null;
    const tax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    //calculating subTotal
    const subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    this.totalCalculation();
  }

  // Calculations
  // Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    this.totalTax = 0;
    this.totalBeforeTax = 0;
    this.grandTotal = 0;
    const arrayControl = this.salesOrderForm.get('salesOrderLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      const price = arrayControl.at(index).get('price').value;
      const tax = arrayControl.at(index).get('tax').value;
      const quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((price * quantity) * tax) / 100
      this.totalBeforeTax += price * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
  }

  //Add sales Order line
  addSalesOrderLineClick(): void {
    const controls = this.salesOrderForm.controls.salesOrderLines as FormArray;
    controls.push(this.addSalesOrderLines());
    this.table.renderRows();
  }

  addSalesOrderLines(): FormGroup {
    return this.fb.group({
      itemId: ['', [Validators.required]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      tax: [0, [Validators.max(100), Validators.min(0)]],
      subTotal: [{ value: '0', disabled: true }],
      accountId: ['', [Validators.required]],
      locationId: ['', [Validators.required]],
    });
  }


  //Remove sales Order line
  removeSalesOrderLineClick(salesOrderLineIndex: number): void {
    const salesOrderLineArray = this.salesOrderForm.get('salesOrderLines') as FormArray;
    salesOrderLineArray.removeAt(salesOrderLineIndex);
    salesOrderLineArray.markAsDirty();
    salesOrderLineArray.markAsTouched();
    this.table.renderRows();
  }
  //Get sales Order Data for Edit
  private getSalesOrder(id: number) {
    this.isLoading = true;
    this.soService.getSalesOrderById(id).subscribe((res: IApiResponse<ISalesOrder>) => {
      if (!res) {
        return
      }
      this.salesOrderModel = res.result
      this.editSalesOrder(this.salesOrderModel)
      this.isLoading = false;
    });
  }

  //Edit sales Order
  editSalesOrder(salesOrder: ISalesOrder) {
    this.salesOrderForm.patchValue({
      customerName: salesOrder.customerId,
      salesOrderDate: salesOrder.salesOrderDate,
      dueDate: salesOrder.dueDate,
      contactNo: salesOrder.contact,
    });

    this.salesOrderForm.setControl('salesOrderLines', this.editSalesOrderLines(salesOrder.salesOrderLines));
    this.totalCalculation();
  }

  //Edit sales Order Lines
  editSalesOrderLines(salesOrderLines: ISalesOrderLines[]): FormArray {
    const formArray = new FormArray([]);
    salesOrderLines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: line.itemId,
        description: line.description,
        price: line.price,
        quantity: line.quantity,
        tax: line.tax,
        subTotal: [{ value: line.subtotal, disabled: true }],
        accountId: line.accountId,
        locationId: line.locationId,
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.salesOrderForm.get('salesOrderLines').invalid) {
      this.salesOrderForm.get('salesOrderLines').markAllAsTouched();
    }
    const controls = <FormArray>this.salesOrderForm.controls['salesOrderLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add sales order lines', 'Error')
      return;
    }
    if (this.salesOrderForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToSalesOrderModel();
    if (this.salesOrderModel.id) {
      this.soService.updateSalesOrder(this.salesOrderModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((res: IApiResponse<ISalesOrder>) => {
          this.toastService.success('' + res.message, 'Updated Successfully')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + SALES_ORDER.ID_BASED_ROUTE('details' , this.salesOrderModel.id)]);
        },
          (err) => {
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            this.isLoading = false;
            this.cdRef.detectChanges()
          })
    } else {
      delete this.salesOrderModel.id;
      this.soService.createSalesOrder(this.salesOrderModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe((res: IApiResponse<ISalesOrder>) => {
            this.toastService.success('' + res.message, 'Created Successfully')
            this.router.navigate(['/' + SALES_ORDER.LIST])
          },
          (err) => {
            this.isLoading = false;
            this.cdRef.detectChanges();
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Creating')
          }
        );
    }
  }

  // Mapping value to model
  mapFormValuesToSalesOrderModel() {
    this.salesOrderModel.customerId = this.salesOrderForm.value.customerName;
    this.salesOrderModel.salesOrderDate = this.transformDate(this.salesOrderForm.value.salesOrderDate, 'yyyy-MM-dd');
    this.salesOrderModel.dueDate = this.transformDate(this.salesOrderForm.value.dueDate, 'yyyy-MM-dd');
    this.salesOrderModel.contact = this.salesOrderForm.value.contactNo;
    this.salesOrderModel.salesOrderLines = this.salesOrderForm.value.salesOrderLines
  }

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
    if (this.permission.isGranted(this.permissions.LOCATION_CREATE)) {
      this.addButtonService.openLocationDialog();
    }
  }
  canDeactivate(): boolean | Observable<boolean> {
    return !this.salesOrderForm.dirty;
  }
}
