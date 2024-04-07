import { NgxsCustomService } from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ICreditNote } from '../model/ICreditNote';
import { CreditNoteService } from '../service/credit-note.service';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ProductService } from '../../../profiling/product/service/product.service';
import { InvoiceService } from '../../invoice/services/invoice.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { CREDIT_NOTE } from 'src/app/views/shared/AppRoutes';
import { IInvoice } from '../../invoice/model/IInvoice';
import { ICreditNoteLines } from '../model/ICreditNoteLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IInvoiceLines } from '../../invoice/model/IInvoiceLines';
import { AppConst } from 'src/app/views/shared/AppConst';


@Component({
  selector: 'kt-create-credit-note',
  templateUrl: './create-credit-note.component.html',
  styleUrls: ['./create-credit-note.component.scss']
})

export class CreateCreditNoteComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;

  //Loader
  isLoading: boolean

  //Declaring form variable
  creditNoteForm: FormGroup;

  //For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'price', 'tax',  'subTotal', 'warehouseId', 'action']

  //Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  //Credit Note Model
  creditNoteModel: ICreditNote = {} as ICreditNote;

  //For DropDown
  salesItem: IProduct[]

  isCreditNote: boolean;

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  //param to get invoice
  isInvoice: boolean;
  invoiceMaster: any;
  currentClient:any = {};
  //variables for calculation
  grandTotal: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;

  title: string = 'Create Credit Note'

  dateLimit: Date = new Date()

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    customerName: {
      required: 'Customer is required.',
    },
    noteDate: {
      required: 'Credit Note Date is required.',
    },
    campusId: {
      required: 'Campus is required.',
    }
  };

  // error keys..
  formErrors: any = {
    customerName: '',
    noteDate: '',
    campusId:''
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private creditNoteService: CreditNoteService,
    private cdRef: ChangeDetectorRef,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    private invoiceService: InvoiceService,
    public activatedRoute: ActivatedRoute,
    public ngxsService: NgxsCustomService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config
    //Creating Forms
    this.creditNoteForm = this.fb.group({
      customerName: ['', [Validators.required]],
      noteDate: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      creditNoteLines: this.fb.array([
        this.addCreditNoteLines()
      ])
    });

    //Get Data from Store
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getOtherAccountsFromState()
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState()

   this.ngxsService.products$.subscribe((res) => this.salesItem = res)

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.isCreditNote = param.isCreditNote;
      this.isInvoice = param.isInvoice;
      if (id && this.isCreditNote) {
        this.title = 'Edit Credit Note'
        this.isLoading = true;
        this.getCreditNote(id);
      }
      else if (id && this.isInvoice) {
        this.isLoading = true;
        this.getInvoice(id);
      }
    })
  }

  //Form Reset
  reset() {
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  //OnItemSelected
  onItemSelected(itemId: number, index: number) {
    var arrayControl = this.creditNoteForm.get('creditNoteLines') as FormArray;
    if (itemId) {
      var price = this.salesItem.find(i => i.id === itemId).salesPrice
      var tax = this.salesItem.find(i => i.id === itemId).salesTax
      var account = this.salesItem.find(i => i.id === itemId).revenueAccountId
      //set values for price & tax
      arrayControl.at(index).get('price').setValue(price);
      arrayControl.at(index).get('tax').setValue(tax);
      arrayControl.at(index).get('accountId').setValue(account);
      //Calculating subtotal
      var quantity = arrayControl.at(index).get('quantity').value;
      var subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  //For Calculating subtotal
  onChangeEvent(value: unknown, index: number, element?: HTMLElement | any) {

    const arrayControl = this.creditNoteForm.get('creditNoteLines') as FormArray;
    const price = (arrayControl.at(index).get('price').value) !== null ? arrayControl.at(index).get('price').value : null;
    const tax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    //calculating subTotal
    const subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    this.totalCalculation();
  }


  //Calculations
  //Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    this.totalTax = 0;
    this.totalBeforeTax = 0;
    this.grandTotal = 0;
    var arrayControl = this.creditNoteForm.get('creditNoteLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      var price = arrayControl.at(index).get('price').value;
      var tax = arrayControl.at(index).get('tax').value;
      var quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((price * quantity) * tax) / 100
      this.totalBeforeTax += price * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
  }

  //Add Credit Note Line
  addCreditNoteLineClick(): void {
    const controls = <FormArray>this.creditNoteForm.controls['creditNoteLines'];
    controls.push(this.addCreditNoteLines());
    this.table.renderRows();
  }

  //Add Credit Note Lines
  addCreditNoteLines(): FormGroup {
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

  //Remove Credit Note Line
  removeCreditNoteLineClick(creditNoteLineIndex: number): void {
    const creditNoteLineArray = <FormArray>this.creditNoteForm.get('creditNoteLines');
    creditNoteLineArray.removeAt(creditNoteLineIndex);
    creditNoteLineArray.markAsDirty();
    creditNoteLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Get Invoice Master Data
  private getInvoice(id: number) {
    this.invoiceService.getInvoiceById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IInvoice>) => {
      this.invoiceMaster = res.result
      this.patchCreditNote(this.invoiceMaster);
    })
  }

  // Get Credit Note Master Data
  private getCreditNote(id: number) {
    this.creditNoteService.getCreditNoteById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.creditNoteModel = res.result
      this.patchCreditNote(this.creditNoteModel)
    });
  }

  //Patch Credit Note Form through Credit Note Or Invoice Master Data
  patchCreditNote(data: any ) {
    this.creditNoteForm.patchValue({
      customerName: data.customerId,
      noteDate: (data.noteDate) ? data.noteDate : data.invoiceDate,
      campusId: data.campusId
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.creditNoteForm.setControl('creditNoteLines', this.patchCreditNoteLines((this.invoiceMaster) ? data.invoiceLines : data.creditNoteLines))
    this.totalCalculation();
  }

  //Patch Credit Note Lines From Invoice Or Credit Note Master Data
  patchCreditNoteLines(Lines: ICreditNoteLines[] | IInvoiceLines[]): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: (this.isCreditNote) ? line.id : 0,
        itemId: [line.itemId],
        description: [line.description, Validators.required],
        price: [line.price, [Validators.required, Validators.min(1)]],
        quantity: [line.quantity, [Validators.required,Validators.min(1)]],
        tax: [line.tax, [Validators.max(100), Validators.min(0)]],
        subTotal: [{ value: line.subTotal, disabled: true }],
        accountId: [line.accountId, [Validators.required]],
        warehouseId: [line.warehouseId]
      }))
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {

    if (this.creditNoteForm.get('creditNoteLines').invalid) {
      this.creditNoteForm.get('creditNoteLines').markAllAsTouched();
    }
    const controls = <FormArray>this.creditNoteForm.controls['creditNoteLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add credit note lines', 'Error')
      return;
    }

    if (this.isInvoice && (this.grandTotal > this.invoiceMaster.pendingAmount)) {
      this.toastService.error("Amount can't be greater than Invoice Pending Amount", "Credit Note Lines")
      return;
    }

    if (this.creditNoteForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Credit Note")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToCreditNoteModel();
    if (this.creditNoteModel.id) {
      this.creditNoteService.updateCreditNote(this.creditNoteModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<ICreditNote>) => {
          this.toastService.success('Updated Successfully', 'Credit Note')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + CREDIT_NOTE.ID_BASED_ROUTE('details' , this.creditNoteModel.id)]);
        })
    } else {
      delete this.creditNoteModel.id;
      this.creditNoteService.createCreditNote(this.creditNoteModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<ICreditNote>) => {
            this.toastService.success('Created Successfully' , 'Credit Note')
            this.router.navigate(['/' + CREDIT_NOTE.ID_BASED_ROUTE('details' , res.result.id)]);
          });
    }

  }

  //Mapping value to model
  mapFormValuesToCreditNoteModel() {
    this.creditNoteModel.customerId = this.creditNoteForm.value.customerName;
    this.creditNoteModel.noteDate = this.transformDate(this.creditNoteForm.value.noteDate, 'yyyy-MM-dd');
    this.creditNoteModel.creditNoteLines = this.creditNoteForm.value.creditNoteLines;
    this.creditNoteModel.campusId = this.creditNoteForm.value.campusId;
    if (this.isInvoice) { this.creditNoteModel.documentLedgerId = this.invoiceMaster.ledgerId; }
  }

  //for save or submit
  isSubmit(val: number) {
    this.creditNoteModel.isSubmit = (val === 0) ? false : true;
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
    return !this.creditNoteForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.creditNoteForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Credit Note")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.creditNoteForm.value.creditNoteLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Credit Note")
    }

     this.creditNoteForm.get('creditNoteLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     this.cdRef.detectChanges()
  }
}
