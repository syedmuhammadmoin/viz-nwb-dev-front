import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ICallQuotation } from '../model/ICallQuotation';
import { CallQuotationService } from '../service/call-quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { CALL_QUOTATION, QUOTATION } from 'src/app/views/shared/AppRoutes';
import { ICallForQuotationLines } from '../model/ICallQuotationLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Component({
  selector: 'kt-create-call-quotaion',
  templateUrl: './create-call-quotaion.component.html',
  styleUrls: ['./create-call-quotaion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateCallQuotaionComponent extends AppComponentBase implements OnInit, OnDestroy {
  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  callQuotationForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity' , 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Quotation Model
  callQuotationModel: ICallQuotation;

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

  title: string = 'Create Call Quotation'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    vendorId: {
      required: 'Vendor is required.',
    },
    callForQuotationDate: {
      required: 'Call Quotation Date is required.',
    },
    description: {
      required: 'Description is required.',
    },
    // contact: {
    //   required: 'Contact Name is required.',
    // }
  };

  // error keys..
  formErrors = {
    vendorId: '',
    callForQuotationDate: '',
    description: '',
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private callQuotationService: CallQuotationService,
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
    this.callQuotationForm = this.fb.group({
      vendorId: ['', [Validators.required]],
      callForQuotationDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      callForQuotationLines: this.fb.array([
        this.addCallQuotationLines()
      ])
    });

    this.callQuotationModel = {
    id: null,
    vendorId: null,
    callForQuotationDate: null,
    description: null,
    callForQuotationLines: []
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
      const isCallQuotation = param.isCallQuotation;
      const isSalesOrder = param.isSalesOrder;
      if (id && isCallQuotation) {
        this.isLoading = true;
        this.title = 'Edit Call Of Quotation'
        this.getCallQuotation(id);
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

    /*
    console.log("yes")
    let arrayControl = this.callQuotationForm.get('callForQuotationLines') as FormArray;
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
    
    */
  }

  // onChangeEvent for calculating subtotal
  onChangeEvent(value: unknown, index: number, element?: HTMLElement) {

    // const arrayControl = this.callQuotationForm.get('callForQuotationLines') as FormArray;
    // const price = (arrayControl.at(index).get('price').value) !== null ? arrayControl.at(index).get('price').value : null;
    // const tax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    // const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    // //calculating subTotal
    // const subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
    // arrayControl.at(index).get('subTotal').setValue(subTotal);
    // this.totalCalculation();
  }


  // Calculations
  // Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    // this.totalTax = 0;
    // this.totalBeforeTax = 0;
    // this.grandTotal = 0;
    // let arrayControl = this.callQuotationForm.get('callForQuotationLines') as FormArray;
    // arrayControl.controls.forEach((element, index) => {
    //   let price = arrayControl.at(index).get('price').value;
    //   let tax = arrayControl.at(index).get('tax').value;
    //   let quantity = arrayControl.at(index).get('quantity').value;
    //   this.totalTax += ((price * quantity) * tax) / 100
    //   this.totalBeforeTax += price * quantity;
    //   this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    // });
  }

  //Add Quotation Lines
  addCallQuotationLineClick(): void {
    const controls = this.callQuotationForm.controls.callForQuotationLines as FormArray;
    controls.push(this.addCallQuotationLines());
    this.table.renderRows();
  }

  // Add Quotation Lines
  addCallQuotationLines(): FormGroup {
    return this.fb.group({
      itemId: [null , Validators.required],
      quantity: ['', [Validators.required,Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  //Remove Quotation Line
  removeCallQuotationLineClick(callQuotationLineIndex: number): void {
    const callQuotationLineArray = this.callQuotationForm.get('callForQuotationLines') as FormArray;
    callQuotationLineArray.removeAt(callQuotationLineIndex);
    callQuotationLineArray.markAsDirty();
    callQuotationLineArray.markAsTouched();
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
  private getCallQuotation(id: number) {
    this.callQuotationService.getCallQuotationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.callQuotationModel = res.result
      this.patchCallQuotation(this.callQuotationModel)
    });
  }

  //Patch Quotation Form through Quotation Or sales Order Master Data
  
  patchCallQuotation(data: ICallQuotation) {
    this.callQuotationForm.patchValue({
      VenderId: data.vendorId,
      callForQuotationDate: data.callForQuotationDate,
      description: data.description,
      // invoiceDate: (data.invoiceDate) ? data.invoiceDate : data.salesOrderDate,
      //contact: data.contact
    });


    this.showMessage = true;

    // this.invoiceForm.setControl('callForQuotationLines', this.patchQuotationLines((this.salesOrderMaster) ? data.salesOrderLines : data.callForQuotationLines))
    this.callQuotationForm.setControl('callForQuotationLines', this.patchCallQuotationLines(data.callForQuotationLines))
    this.totalCalculation();
  }

  //Patch Inovice Lines From sales Order Or Quotation Master Data
  patchCallQuotationLines(lines: ICallForQuotationLines[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: [line.itemId],
        quantity: [line.quantity , [Validators.required,Validators.min(1)]],
        description: [line.description , Validators.required],
        // price: [line.price , [Validators.required, Validators.min(1)]],
        // tax: [line.tax , [Validators.max(100), Validators.min(0)]],
        // subTotal: [{ value: line.subTotal, disabled: true }],
        // accountId: [line.accountId , [Validators.required]],
        // warehouseId: [line.warehouseId],
        //locationId: line.locationId,
      }))
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {

    if (this.callQuotationForm.get('callForQuotationLines').invalid) {
      this.callQuotationForm.get('callForQuotationLines').markAllAsTouched();
    }
    const controls = <FormArray>this.callQuotationForm.controls['callForQuotationLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add call quotation lines', 'Error')
      return;
    }
    
    if (this.callQuotationForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Call Quotation")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToCallQuotationModel();
    //console.log(this.quotationModel)
    if (this.callQuotationModel.id) {
      this.callQuotationService.updateCallQuotation(this.callQuotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<ICallQuotation>) => {
          this.toastService.success('Updated Successfully', 'Quotation')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + CALL_QUOTATION.ID_BASED_ROUTE('details', this.callQuotationModel.id)]);
        })
    } else {
      delete this.callQuotationModel.id;
      this.callQuotationService.createCallQuotation(this.callQuotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<ICallQuotation>) => {
            this.toastService.success('Created Successfully', 'Call Quotation')
            // this.router.navigate(['/' + QUOTATION.LIST])
            this.router.navigate(['/' + CALL_QUOTATION.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToCallQuotationModel() {
    this.callQuotationModel.vendorId = this.callQuotationForm.value.vendorId;
    this.callQuotationModel.callForQuotationDate = this.transformDate(this.callQuotationForm.value.callForQuotationDate, 'yyyy-MM-dd');
    this.callQuotationModel.description = this.callQuotationForm.value.description
    this.callQuotationModel.callForQuotationLines = this.callQuotationForm.value.callForQuotationLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.callQuotationModel.isSubmit = (val === 0) ? false : true;
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
}

