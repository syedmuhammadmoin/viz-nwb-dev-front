import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { IInvoice } from '../model/IInvoice';
import { InvoiceService } from '../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { INVOICE } from 'src/app/views/shared/AppRoutes';
import { IInvoiceLines } from '../model/IInvoiceLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppConst } from 'src/app/views/shared/AppConst';


 

@Component({
  selector: 'kt-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})

export class CreateInvoiceComponent extends AppComponentBase implements OnInit, OnDestroy, FormsCanDeactivate {
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  // Declaring form variable
  invoiceForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'price', 'tax', 'warehouseId' , 'subTotal', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Invoice Model
  invoiceModel: IInvoice = {} as IInvoice;

  // For DropDown
  salesItem: IProduct[];

  //variables for calculation
  grandTotal: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  //payment
  subscription1$: Subscription
  //sales Order
  subscription2$: Subscription

  title: string = 'Create Invoice'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    customerName: {
      required: 'Customer is required.',
    },
    invoiceDate: {
      required: 'Invoice Date is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
    dueDate: {
      required: 'Due Date is required.',
    }
  };

  // error keys..
  formErrors = {
    customerName: '',
    invoiceDate: '',
    campusId: '',
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
    injector: Injector,

  ) {
    super(injector);
  }
  public currentClient : any ={}
  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config
    // Creating Forms
    this.invoiceForm = this.fb.group({
      customerName: ['', [Validators.required]],
      invoiceDate: ['', [Validators.required]],
      campusId: (AppConst.ClientConfig.config.isCampus) ?  ['',  [Validators.required]] : [null,[Validators.nullValidator]],
      dueDate: ['',[Validators.required]],
      //contact: [''],
      invoiceLines: this.fb.array([
        this.addInvoiceLines()
      ])
    });

    //Get Data From Store
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getOtherAccountsFromState()
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState()

    this.ngxsService.products$.subscribe(res => this.salesItem = res)

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isInvoice = param.isInvoice;

      if (id && isInvoice) {
        this.isLoading = true;
        this.title = 'Edit Invoice'
        this.getInvoice(id);
      }
    });

    //handling dueDate logic
    this.invoiceForm.get('invoiceDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.invoiceForm.get('dueDate').value < this.invoiceForm.get('invoiceDate').value
    })

    this.warehouseList.next(0)
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
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    console.log("yes")
    let arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
    if (itemId) {
      let price = this.salesItem.find(i => i.id === itemId).salesPrice
      let tax = this.salesItem.find(i => i.id === itemId).salesTax
      let account = this.salesItem.find(i => i.id === itemId).revenueAccountId
      // set values for price & tax
      arrayControl.at(index).get('price').setValue(price);
      arrayControl.at(index).get('tax').setValue(tax);
      arrayControl.at(index).get('accountId').setValue(account);
      // Calculating subtotal
      // let quantity = arrayControl.at(index).get('quantity').value;
      // let subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
      // arrayControl.at(index).get('subTotal').setValue(subTotal);
      this.onChangeEvent(null, index)
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
      itemId: [null],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required,Validators.min(1)]],
      tax: [0, [Validators.max(100), Validators.min(0)]],
      subTotal: [{ value: '0', disabled: true }],
      accountId: ['', [Validators.required]],
      warehouseId: [null]
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

  //Get Invoice Data for Edit
  private getInvoice(id: number) {
    this.invoiceService.getInvoiceById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.invoiceModel = res.result
      this.patchInvoice(this.invoiceModel)
    });
  }

  //Patch Invoice Form through Invoice Master Data
  patchInvoice(data: IInvoice) {
    this.invoiceForm.patchValue({
      customerName: data.customerId,
      invoiceDate: data.invoiceDate ,
      dueDate: data.dueDate,
      campusId: data.campusId
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.invoiceForm.setControl('invoiceLines', this.patchInvoiceLines(data.invoiceLines))
    this.totalCalculation();
  }

  //Patch Inovice Lines From Invoice Master Data
  patchInvoiceLines(lines: IInvoiceLines[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: [line.itemId],
        description: [line.description , Validators.required],
        price: [line.price , [Validators.required, Validators.min(1)]],
        quantity: [line.quantity , [Validators.required,Validators.min(1)]],
        tax: [line.tax , [Validators.max(100), Validators.min(0)]],
        subTotal: [{ value: line.subTotal, disabled: true }],
        accountId: [line.accountId , [Validators.required]],
        warehouseId: [line.warehouseId]
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
      this.toastService.error("Please fill all required fields!", "Invoice")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToInvoiceModel();
    if (this.invoiceModel.id) {
      this.invoiceService.updateInvoice(this.invoiceModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IInvoice>) => {
          this.toastService.success('Updated Successfully', 'Invoice')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', this.invoiceModel.id)]);
        })
    } else {
      delete this.invoiceModel.id;
      this.invoiceService.createInvoice(this.invoiceModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IInvoice>) => {
            this.toastService.success('Created Successfully', 'Invoice')
            this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToInvoiceModel() {
    this.invoiceModel.customerId = this.invoiceForm.value.customerName;
    this.invoiceModel.invoiceDate = this.transformDate(this.invoiceForm.value.invoiceDate, 'yyyy-MM-dd');
    this.invoiceModel.dueDate = this.transformDate(this.invoiceForm.value.dueDate, 'yyyy-MM-dd');
    this.invoiceModel.contact = '';
    this.invoiceModel.campusId = this.invoiceForm.value.campusId;
    this.invoiceModel.invoiceLines = this.invoiceForm.value.invoiceLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.invoiceModel.isSubmit = (val === 0) ? false : true;
  }

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

  canDeactivate(): boolean | Observable<boolean> {
    return !this.invoiceForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.invoiceForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Invoice")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
      console.log(res.result)
    })

    console.log(this.invoiceForm.value.invoiceLines)

    if(this.invoiceForm.value.invoiceLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Invoice")
    }

     this.invoiceForm.get('invoiceLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     this.cdRef.detectChanges()
  }
}
