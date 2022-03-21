import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { IInvoice } from '../model/IInvoice';
import { InvoiceService } from '../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { SaleOrderService } from '../../sales-order/service/sale-order.service';
import { INVOICE } from 'src/app/views/shared/AppRoutes';
import { ISalesOrder } from '../../sales-order/model/ISalesOrder';
import { IInvoiceLines } from '../model/IInvoiceLines';
import { ISalesOrderLines } from '../../sales-order/model/ISalesOrderLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Component({
  selector: 'kt-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  providers:[NgxsCustomService]
})

export class CreateInvoiceComponent extends AppComponentBase implements OnInit, OnDestroy, FormsCanDeactivate {
  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  invoiceForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'price', 'tax', 'subTotal', 'locationId', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Invoice Model
  invoiceModel: IInvoice;

  // For DropDown
  salesItem: IProduct[];

  //sales Order Data
  salesOrderMaster: any;

  //variables for calculation
  grandTotal: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  //payment
  subscription1$: Subscription
  //sales Order
  subscription2$: Subscription

  // Validation messages..
  validationMessages = {
    customerName: {
      required: 'Customer Name is required.',
    },
    invoiceDate: {
      required: 'Invoice Date is required.',
    },
    dueDate: {
      required: 'Due Date is required.',
    },
    // contact: {
    //   required: 'Contact Name is required.',
    // }
  };

  // error keys..
  formErrors = {
    customerName: '',
    invoiceDate: '',
    dueDate: '',
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private invoiceService: InvoiceService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private salesOrderService: SaleOrderService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.invoiceForm = this.fb.group({
      customerName: ['', [Validators.required]],
      invoiceDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      contact: [''],
      invoiceLines: this.fb.array([
        this.addInvoiceLines()
      ])
    });

    this.invoiceModel = {
      id: null,
      customerId: null,
      invoiceDate: null,
      dueDate: null,
      contact: '',
      invoiceLines: []
    }
    // get customer from state
    this.ngxsService.getBusinessPartnerFromState();
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();
    // get location from location
    this.ngxsService.getLocationFromState();

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isInvoice = param.isInvoice;
      const isSalesOrder = param.isSalesOrder;
      if (id && isInvoice) {
        this.getInvoice(id);
      }
      else if (id && isSalesOrder) {
        this.getSalesOrder(id);
      }
    });

    this.productService.getProducts().subscribe(res => this.salesItem = res.result)

    //handling dueDate logic
    this.invoiceForm.get('invoiceDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.invoiceForm.get('dueDate').value < this.invoiceForm.get('invoiceDate').value
    })
  }

  //unsubscribe Observable
  ngOnDestroy() {
    if (this.subscription1$) {
      this.subscription1$.unsubscribe();
    }
    if (this.subscription2$) {
      this.subscription2$.unsubscribe();
    }
  }


  // Form Reset
  reset() {
    const invoiceLineArray = this.invoiceForm.get('invoiceLines') as FormArray;
    invoiceLineArray.clear();
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    let arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
    if (itemId) {
      let price = this.salesItem.find(i => i.id === itemId).salesPrice
      let tax = this.salesItem.find(i => i.id === itemId).salesTax
      // set values for price & tax
      arrayControl.at(index).get('price').setValue(price);
      arrayControl.at(index).get('tax').setValue(tax);
      // Calculating subtotal
      let quantity = arrayControl.at(index).get('quantity').value;
      let subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  // onChangeEvent for calculating subtotal
  onChangeEvent(value: unknown, index: number, element?: HTMLElement) {

    const arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
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
    let arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      let price = arrayControl.at(index).get('price').value;
      let tax = arrayControl.at(index).get('tax').value;
      let quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((price * quantity) * tax) / 100
      this.totalBeforeTax += price * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
  }

  //Add Invoice Lines
  addInvoiceLineClick(): void {
    const controls = this.invoiceForm.controls.invoiceLines as FormArray;
    controls.push(this.addInvoiceLines());
    this.table.renderRows();
  }

  // Add Invoice Lines
  addInvoiceLines(): FormGroup {
    return this.fb.group({
      itemId: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      tax: [0, [Validators.max(100), Validators.min(0)]],
      subTotal: [{ value: '0', disabled: true }],
      accountId: ['', [Validators.required]],
      locationId: [''],
    });
  }

  //Remove Invoice Line
  removeInvoiceLineClick(invoiceLineIndex: number): void {
    const invoiceLineArray = this.invoiceForm.get('invoiceLines') as FormArray;
    invoiceLineArray.removeAt(invoiceLineIndex);
    invoiceLineArray.markAsDirty();
    invoiceLineArray.markAsTouched();
    this.table.renderRows();
  }

  private getSalesOrder(id: number) {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderById(id).subscribe((res) => {
      if (!res) return
      this.salesOrderMaster = res.result
      this.patchInvoice(this.salesOrderMaster);
      this.isLoading = false;
    }, (err) => console.log(err)
    );
  }

  //Get Invoice Data for Edit
  private getInvoice(id: number) {
    this.isLoading = true;
    this.invoiceService.getInvoiceById(id).subscribe((res) => {
      if (!res) return
      this.invoiceModel = res.result
      this.patchInvoice(this.invoiceModel)
      this.isLoading = false;
    }, (err) => console.log(err)
    );
  }

  //Patch Invoice Form through Invoice Or sales Order Master Data
  patchInvoice(data: any) {
    this.invoiceForm.patchValue({
      customerName: data.customerId,
      invoiceDate: (data.invoiceDate) ? data.invoiceDate : data.salesOrderDate,
      dueDate: data.dueDate,
      contact: data.contact
    });

    this.invoiceForm.setControl('invoiceLines', this.patchInvoiceLines((this.salesOrderMaster) ? data.salesOrderLines : data.invoiceLines))
    this.totalCalculation();
  }

  //Patch Inovice Lines From sales Order Or Invoice Master Data
  patchInvoiceLines(lines: IInvoiceLines[] | ISalesOrderLines[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
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

  //Submit Form Function
  onSubmit(): void {

    if (this.invoiceForm.get('invoiceLines').invalid) {
      this.invoiceForm.get('invoiceLines').markAllAsTouched();
    }
    const controls = <FormArray>this.invoiceForm.controls['invoiceLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add invoice lines', 'Error')
      return;
    }
    if (this.invoiceForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToInvoiceModel();
    console.log(this.invoiceModel)
    if (this.invoiceModel.id) {
      this.invoiceService.updateInvoice(this.invoiceModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((res: IApiResponse<IInvoice>) => {
          this.toastService.success('' + res.message, 'Updated Successfully')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', this.invoiceModel.id)]);
        },
          (err) => {
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            this.isLoading = false;
            this.cdRef.detectChanges()
          })
    } else {
      delete this.invoiceModel.id;
      this.invoiceService.createInvoice(this.invoiceModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe((res: IApiResponse<IInvoice>) => {
            this.toastService.success('' + res.message, 'Created Successfully')
            this.router.navigate(['/' + INVOICE.LIST])
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
  mapFormValuesToInvoiceModel() {
    this.invoiceModel.customerId = this.invoiceForm.value.customerName;
    this.invoiceModel.invoiceDate = this.transformDate(this.invoiceForm.value.invoiceDate, 'yyyy-MM-dd');
    this.invoiceModel.dueDate = this.transformDate(this.invoiceForm.value.dueDate, 'yyyy-MM-dd');
    this.invoiceModel.contact = this.invoiceForm.value.contact;
    this.invoiceModel.invoiceLines = this.invoiceForm.value.invoiceLines
  }

  //for save or submit
  isSubmit(val: number) {
    this.invoiceModel.isSubmit = (val === 0) ? false : true;
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
    return !this.invoiceForm.dirty;
  }
}
