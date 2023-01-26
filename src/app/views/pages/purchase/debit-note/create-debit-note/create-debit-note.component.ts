import { DEBIT_NOTE } from '../../../../shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IDebitNote } from '../model/IDebitNote';
import { DebitNoteService } from '../service/debit-note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ProductService } from '../../../profiling/product/service/product.service';
import { VendorBillService } from '../../vendorBill/services/vendor-bill.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { IProduct } from '../../../profiling/product/model/IProduct';

@Component({
  selector: 'kt-create-debit-note',
  templateUrl: './create-debit-note.component.html',
  styleUrls: ['./create-debit-note.component.scss']
})

export class CreateDebitNoteComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;

  //Loader
  isLoading: boolean

  //Declaring form variable
  debitNoteForm: FormGroup;

  //purchase Order Data
  purchaseOrderMaster: any;

  //For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'cost', 'tax', 'anyOtherTax', 'subTotal','warehouseId', 'action']

  //Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // debit Note Model
  debitNoteModel: IDebitNote = {} as IDebitNote;

  //For DropDown
  salesItem: IProduct[] | any[];

  //Variables for Calculation
  grandTotal: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;
  taxes = 0;
  otherTaxes = 0;

  isDebitNote: any;

  //param to get bill data
  isBill: any;
  billMaster: any;

  title: string = 'Create Debit Note'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  dateLimit: Date = new Date()

  // Validation messages..
  validationMessages = {
    vendorName: {
      required: 'Vendor is required.',
    },
    noteDate: {
      required: 'Debit Note Date is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
  };

  // error keys..
  formErrors = {
    vendorName: '',
    noteDate: '',
    campusId: ''
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private debitNoteService: DebitNoteService,
    public productService: ProductService,
    private billService: VendorBillService,
    public addButtonService: AddModalButtonService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public ngxsService:NgxsCustomService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    //Creating Forms
    this.debitNoteForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      noteDate: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      debitNoteLines: this.fb.array([
        this.addDebitNoteLines()
      ])
    });

     //Get Data from Store
     this.ngxsService.getAllBusinessPartnerFromState();
     this.ngxsService.getOtherAccountsFromState()
     this.ngxsService.getWarehouseFromState();
     this.ngxsService.getProductFromState();
     this.ngxsService.getCampusFromState()

     this.ngxsService.products$.subscribe(res => this.salesItem = res)

    //get id by using route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isDebitNote = param.isDebitNote;
      this.isBill = param.isBill;
      if (id && this.isDebitNote) {
        this.isLoading = true;
        this.title = 'Edit Debit Note'
        this.getDebitNote(id);
      }
      else if (id && this.isBill) {
        this.isLoading = true;
        this.getBill(id)
      }
    })
  }


  //Form Reset
  reset() {
    this.totalBeforeTax = this.grandTotal = this.totalTax = this.taxes = this.otherTaxes = 0;
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  //OnItemSelected
  onItemSelected(itemId: number, index: number) {
    var arrayControl = this.debitNoteForm.get('debitNoteLines') as FormArray;
    if (itemId) {
      var cost = this.salesItem.find(i => i.id === itemId).purchasePrice
      var tax = this.salesItem.find(i => i.id === itemId).salesTax
      var account = (this.salesItem.find(i => i.id === itemId).productType == 1) ? this.salesItem.find(i => i.id === itemId).costAccountId
      : this.salesItem.find(i => i.id === itemId).inventoryAccountId
      //set values for price & tax
      arrayControl.at(index).get('cost').setValue(cost);
      arrayControl.at(index).get('tax').setValue(tax);
      arrayControl.at(index).get('accountId').setValue(account);
      //Calculating subtotal
      var quantity = arrayControl.at(index).get('quantity').value;
      var subTotal = (cost * quantity) + ((cost * quantity) * (tax / 100))
      //console.log('Subtotal', subTotal);
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  //For Calculating subtotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number, element?: HTMLElement) {

    const arrayControl = this.debitNoteForm.get('debitNoteLines') as FormArray;
    const cost = (arrayControl.at(index).get('cost').value) !== null ? arrayControl.at(index).get('cost').value : null;
    const tax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    const otherTax = (arrayControl.at(index).get('anyOtherTax').value) !== null ? arrayControl.at(index).get('anyOtherTax').value : null;
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    //calculating subTotal
    const subTotal = ((cost * quantity) + ((cost * quantity) * (tax / 100))) + otherTax
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    this.totalCalculation();
  }

  //Calculations
  //Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    this.totalTax = 0;
    this.totalBeforeTax = 0;
    this.grandTotal = 0;
    this.otherTaxes = 0;
    this.taxes = 0;
    var arrayControl = this.debitNoteForm.get('debitNoteLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      const cost = arrayControl.at(index).get('cost').value;
      const tax = arrayControl.at(index).get('tax').value;
      const otherTax = arrayControl.at(index).get('anyOtherTax').value  || 0;
      const quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += (((cost * quantity) * tax) / 100) + otherTax;
      this.otherTaxes += otherTax;
      this.taxes += (((cost * quantity) * tax) / 100);
      this.totalBeforeTax += cost * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
  }

  //Add Debit Note Line
  addDebitNoteLineClick(): void {
    const controls = <FormArray>this.debitNoteForm.controls['debitNoteLines'];
    controls.push(this.addDebitNoteLines());
    this.table.renderRows();
  }

  addDebitNoteLines(): FormGroup {
    return this.fb.group({
      itemId: [null],
      description: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required,Validators.min(1)]],
      tax: [0, [Validators.max(100), Validators.min(0)]],
      anyOtherTax: [0, [Validators.min(0)]],
      subTotal: [{ value: '0', disabled: true }],
      accountId: ['', [Validators.required]],
      warehouseId: [null]
    });
  }

  //Remove Debit Note Line
  removeDebitNoteLineClick(debitNoteLineIndex: number): void {
    const debitNoteArray = <FormArray>this.debitNoteForm.get('debitNoteLines');
    debitNoteArray.removeAt(debitNoteLineIndex);
    debitNoteArray.markAsDirty();
    debitNoteArray.markAsTouched();
    this.table.renderRows();
  }

  //Get Bill Master Data
  private getBill(id: number) {
    this.billService.getVendorBillById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.billMaster = res.result
      this.patchDebitNote(this.billMaster);
    });
  }


  //Get Debit Note Data for Edit
  private getDebitNote(id: any) {
    this.debitNoteService.getDebitNoteById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.debitNoteModel = res.result
      this.patchDebitNote(this.debitNoteModel)
    });
  }

  //Patch Debit Note Form through Debit Note Or Bill Master Data
  patchDebitNote(data: any) {
    this.debitNoteForm.patchValue({
      vendorName: data.vendorId,
      vendorBillRef: data.vendorBillRef,
      noteDate: (data.noteDate) ? data.noteDate : data.billDate,
      campusId: data.campusId
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.debitNoteForm.setControl('debitNoteLines', this.patchDebitNoteLines((this.billMaster) ? data.billLines : data.debitNoteLines))
    this.totalCalculation();
  }

  //Patch Debit Note Lines From Bill Or Debit Note Master Data
  patchDebitNoteLines(Lines: any): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: (this.isDebitNote) ? line.id : 0,
        itemId: [line.itemId],
        description: [line.description, Validators.required],
        cost: [line.cost, [Validators.required, Validators.min(1)]],
        quantity: [line.quantity, [Validators.required,Validators.min(1)]],
        tax: [line.tax, [Validators.max(100), Validators.min(0)]],
        anyOtherTax: [line.anyOtherTax, [Validators.min(0)]],
        subTotal: [{ value: line.subTotal, disabled: true }],
        accountId: [line.accountId, [Validators.required]],
        warehouseId: [line.warehouseId]
      }))
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {
    if (this.debitNoteForm.get('debitNoteLines').invalid) {
      this.debitNoteForm.get('debitNoteLines').markAllAsTouched();
    }
    const controls = <FormArray>this.debitNoteForm.controls['debitNoteLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add debit note lines', 'Error')
      return;
    }
    if (this.isBill && (this.grandTotal > this.billMaster.pendingAmount)) {
      this.toastService.error("Amount can't be greater than Bill Pending Amount", "Debit Note Lines")
      return;
    }
    
    if (this.debitNoteForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Debit Note")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToDebitNoteModel();
    if (this.debitNoteModel.id) {
      this.debitNoteService.updateDebitNote(this.debitNoteModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res) => {
          this.toastService.success('Updated Successfully', 'Debit Note')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + DEBIT_NOTE.ID_BASED_ROUTE('details',this.debitNoteModel.id ) ]);
        })
    } else {
      delete this.debitNoteModel.id;
      this.debitNoteService.createDebitNote(this.debitNoteModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res) => {
            this.toastService.success('Created Successfully', 'Debit Note')
            this.router.navigate(['/' + DEBIT_NOTE.ID_BASED_ROUTE('details', res.result.id ) ]);
          });
    }
  }

  //Mapping value to model
  mapFormValuesToDebitNoteModel() {
    this.debitNoteModel.vendorId = this.debitNoteForm.value.vendorName;
    this.debitNoteModel.noteDate = this.transformDate(this.debitNoteForm.value.noteDate, 'yyyy-MM-dd');
    this.debitNoteModel.debitNoteLines = this.debitNoteForm.value.debitNoteLines;
    this.debitNoteModel.campusId = this.debitNoteForm.value.campusId;
    if (this.isBill) {
      this.debitNoteModel.documentLedgerId = this.billMaster.ledgerId;
    }
  }

  //for save or submit
  isSubmit(val: number) {
    this.debitNoteModel.isSubmit = (val === 0) ? false : true;
  }

  // open product dialog
  openProductDialog() {
    if (this.permission.isGranted(this.permissions.PRODUCT_CREATE)) {
      this.addButtonService.openProductDialog();
    }
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.debitNoteForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.debitNoteForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Debit Note")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.debitNoteForm.value.debitNoteLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Debit Note")
    }

     this.debitNoteForm.get('debitNoteLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     this.cdRef.detectChanges()
  }
}


