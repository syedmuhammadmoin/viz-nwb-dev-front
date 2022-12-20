

import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { IQuotation } from '../model/IQuotation';
import { QuotationService } from '../service/quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { QUOTATION } from 'src/app/views/shared/AppRoutes';
import { IQuotationLines } from '../model/IQuotationLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Component({
  selector: 'kt-create-quotation',
  templateUrl: './create-quotation.component.html',
  styleUrls: ['./create-quotation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateQuotationComponent extends AppComponentBase implements OnInit, OnDestroy, FormsCanDeactivate {
  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  quotationForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'price', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Quotation Model
  quotationModel: IQuotation;

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
 
  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  //payment
  subscription1$: Subscription
  //sales Order
  subscription2$: Subscription

  title: string = 'Create Quotation'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    vendorId: {
      required: 'Vendor is required.',
    },
    quotationDate: {
      required: 'Quotation Date is required.',
    },
    timeframe: {
      required: 'Time Frame is required.',
    },
    // contact: {
    //   required: 'Contact Name is required.',
    // }
  };

  // error keys..
  formErrors = {
    vendorId: '',
    quotationDate: '',
    timeframe: '',
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private quotationService: QuotationService,
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
    this.quotationForm = this.fb.group({
      vendorId: ['', [Validators.required]],
      quotationDate: ['', [Validators.required]],
      timeframe: ['', [Validators.required]],
    
      //contact: [''],
      quotationLines: this.fb.array([
        this.addQuotationLines()
      ])
    });

    this.quotationModel = {
      id: null,
    vendorId: null,
    quotationDate: null,
    timeframe: null,
    requisitionId: null,
    quotationLines: []
    }
    // get customer from state
    this.ngxsService.getBusinessPartnerFromState();
    // get Other Accounts from state
    this.ngxsService.getOtherAccountsFromState()
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState()
    // get location from location
    //this.ngxsService.getLocationFromState();

    this.ngxsService.products$.subscribe(res => this.salesItem = res)
    
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isQuotation = param.isQuotation;
      const isSalesOrder = param.isSalesOrder;
      if (id && isQuotation) {
        this.isLoading = true;
        this.title = 'Edit Quotation'
        this.getQuotation(id);
      }
    });

    //handling dueDate logic
    // this.quotationForm.get('invoiceDate').valueChanges.subscribe((value) => {
    //   this.minDate = new Date(value);
    //   this.dateCondition = this.quotationForm.get('dueDate').value < this.quotationForm.get('invoiceDate').value
    // })
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
    // const invoiceLineArray = this.invoiceForm.get('quotationLines') as FormArray;
    // invoiceLineArray.clear();
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    console.log("yes")
    let arrayControl = this.quotationForm.get('quotationLines') as FormArray;
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

    const arrayControl = this.quotationForm.get('quotationLines') as FormArray;
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
    let arrayControl = this.quotationForm.get('quotationLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      let price = arrayControl.at(index).get('price').value;
      let tax = arrayControl.at(index).get('tax').value;
      let quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((price * quantity) * tax) / 100
      this.totalBeforeTax += price * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
  }

  //Add Quotation Lines
  addQuotationLineClick(): void {
    const controls = this.quotationForm.controls.quotationLines as FormArray;
    controls.push(this.addQuotationLines());
    this.table.renderRows();
  }

  // Add Quotation Lines
  addQuotationLines(): FormGroup {
    return this.fb.group({
      itemId: [null],
      quantity: ['', [Validators.required,Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
      // locationId: [''],
    });
  }

  //Remove Quotation Line
  removeQuotationLineClick(quotationLineIndex: number): void {
    const quotationLineArray = this.quotationForm.get('quotationLines') as FormArray;
    quotationLineArray.removeAt(quotationLineIndex);
    quotationLineArray.markAsDirty();
    quotationLineArray.markAsTouched();
    this.table.renderRows();
  }

  // private getSalesOrder(id: number) {
  //   this.salesOrderService.getSalesOrderById(id)
  //   .pipe(
  //     take(1),
  //      finalize(() => {
  //       this.isLoading = false;
  //       this.cdRef.detectChanges();
  //      })
  //    )
  //   .subscribe((res) => {
  //     if (!res) return
  //     this.salesOrderMaster = res.result
  //     this.patchQuotation(this.salesOrderMaster);
  //   });
  // }

  //Get Quotation Data for Edit
  private getQuotation(id: number) {
    this.quotationService.getQuotationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.quotationModel = res.result
      this.patchQuotation(this.quotationModel)
    });
  }

  //Patch Quotation Form through Quotation Or sales Order Master Data
  
  patchQuotation(data: IQuotation) {
    this.quotationForm.patchValue({
      VenderId: data.vendorId,
      timeframe: data.quotationDate,
      requisitionId: data.requisitionId,
      // invoiceDate: (data.invoiceDate) ? data.invoiceDate : data.salesOrderDate,
      //contact: data.contact
    });


    this.onCampusSelected(data.vendorId)
    this.showMessage = true;

    // this.invoiceForm.setControl('quotationLines', this.patchQuotationLines((this.salesOrderMaster) ? data.salesOrderLines : data.quotationLines))
    this.quotationForm.setControl('quotationLines', this.patchQuotationLines(data.quotationLines))
    this.totalCalculation();
  }

  //Patch Inovice Lines From sales Order Or Quotation Master Data
  patchQuotationLines(lines: IQuotationLines[]): FormArray {
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
        warehouseId: [line.warehouseId],
        //locationId: line.locationId,
      }))
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {

    if (this.quotationForm.get('quotationLines').invalid) {
      this.quotationForm.get('quotationLines').markAllAsTouched();
    }
    const controls = <FormArray>this.quotationForm.controls['quotationLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add quotation lines', 'Error')
      return;
    }
    
    if (this.quotationForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Quotation")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToQuotationModel();
    //console.log(this.quotationModel)
    if (this.quotationModel.id) {
      this.quotationService.updateQuotation(this.quotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IQuotation>) => {
          this.toastService.success('Updated Successfully', 'Quotation')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + QUOTATION.ID_BASED_ROUTE('details', this.quotationModel.id)]);
        })
    } else {
      delete this.quotationModel.id;
      this.quotationService.createQuotation(this.quotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IQuotation>) => {
            this.toastService.success('Created Successfully', 'Quotation')
            // this.router.navigate(['/' + QUOTATION.LIST])
            this.router.navigate(['/' + QUOTATION.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToQuotationModel() {
    this.quotationModel.vendorId = this.quotationForm.value.customerName;
    this.quotationModel.quotationDate = this.transformDate(this.quotationForm.value.quotationDate, 'yyyy-MM-dd');
    this.quotationModel.timeframe = this.transformDate(this.quotationForm.value.dueDate, 'yyyy-MM-dd');
    this.quotationModel.requisitionId = this.quotationForm.value.requisitionId;
    this.quotationModel.quotationLines = this.quotationForm.value.quotationLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.quotationModel.isSubmit = (val === 0) ? false : true;
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
    return !this.quotationForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.quotationForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Quotation")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    console.log(this.quotationForm.value.quotationLines)

    if(this.quotationForm.value.quotationLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Quotation")
    }

     this.quotationForm.get('quotationLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
    //   if(this.showMessage) {
    //   this.toastService.info("Please Reselect Store!" , "Quotation")
    //  }
     this.cdRef.detectChanges()
  }
}
