import { DEBIT_NOTE } from '../../../../shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDebitNote } from '../model/IDebitNote';
import { DebitNoteService } from '../service/debit-note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ProductService } from '../../../profiling/product/service/product.service';
import { VendorBillService } from '../../vendorBill/services/vendor-bill.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Observable } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { IProduct } from '../../../profiling/product/model/IProduct';

@Component({
  selector: 'kt-create-debit-note',
  templateUrl: './create-debit-note.component.html',
  styleUrls: ['./create-debit-note.component.scss'],
  providers:[NgxsCustomService]
})

export class CreateDebitNoteComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;

  //for busy loading
  isLoading: boolean

  //Declaring form variable
  debitNoteForm: FormGroup;

  //purchase Order Data
  purchaseOrderMaster: any;

  //For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'cost', 'tax', 'subTotal','warehouseId', 'action']

  //Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // debit Note Model
  debitNoteModel: IDebitNote;

  //For DropDown
  salesItem: IProduct[];

  //Variables for Calculation
  grandTotal: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;

  isDebitNote: any;

  //param to get bill data
  isBill: any;
  billMaster: any;

  title: string = 'Create Debit Note'

  dateLimit: Date = new Date()

  // Validation messages..
  validationMessages = {
    vendorName: {
      required: 'Vendor Name is required.',
    },
    noteDate: {
      required: 'Note Date is required.',
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
    //department: '',
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
      //department: ['', [Validators.required]],
      debitNoteLines: this.fb.array([
        this.addDebitNoteLines()
      ])
    });

    this.debitNoteModel = {
      id: null,
      vendorId: null,
      noteDate: null,
      campusId: null,
      //billTransactionId: null,
      debitNoteLines: []
    };

     // get vendor from state
     this.ngxsService.getBusinessPartnerFromState();
     // get Accounts of level 4 from state
     this.ngxsService.getAccountLevel4FromState()
     // get Ware house location from state
     this.ngxsService.getWarehouseFromState();
     // get item from state
     this.ngxsService.getProductFromState();
     //this.ngxsService.getLocationFromState();
     this.ngxsService.getCampusFromState()


    //get id by using route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isDebitNote = param.isDebitNote;
      this.isBill = param.isBill;
      if (id && this.isDebitNote) {
        this.title = 'Edit Debit Note'
        this.getDebitNote(id);
      }
      else if (id && this.isBill) {
        this.getBill(id)
      }
    })

    this.productService.getProducts().subscribe(res => this.salesItem = res.result)
  }


  //Form Reset
  reset() {
    const debitNoteLineArray = <FormArray>this.debitNoteForm.get('debitNoteLines');
    debitNoteLineArray.clear();
    this.table.renderRows();
  }

  //OnItemSelected
  onItemSelected(itemId: number, index: number) {
    var arrayControl = this.debitNoteForm.get('debitNoteLines') as FormArray;
    if (itemId) {
      var cost = this.salesItem.find(i => i.id === itemId).purchasePrice
      var tax = this.salesItem.find(i => i.id === itemId).salesTax
      //set values for price & tax
      arrayControl.at(index).get('cost').setValue(cost);
      arrayControl.at(index).get('tax').setValue(tax);
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
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    //calculating subTotal
    const subTotal = (cost * quantity) + ((cost * quantity) * (tax / 100))
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    this.totalCalculation();
  }

  //Calculations
  //Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    this.totalTax = 0;
    this.totalBeforeTax = 0;
    this.grandTotal = 0;
    var arrayControl = this.debitNoteForm.get('debitNoteLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      var cost = arrayControl.at(index).get('cost').value;
      var tax = arrayControl.at(index).get('tax').value;
      var quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((cost * quantity) * tax) / 100
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
      subTotal: [{ value: '0', disabled: true }],
      accountId: ['', [Validators.required]],
      warehouseId: [null]
      //locationId: ['', [Validators.required]],
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
    this.isLoading = true;
    this.billService.getVendorBillMaster(id).subscribe((res) => {
      if (!res) return
      this.billMaster = res.result
      this.patchDebitNote(this.billMaster);
      this.isLoading = false;
    }, (err) => {
      console.log(err);
    });
  }


  //Get Debit Note Data for Edit
  private getDebitNote(id: any) {
    this.isLoading = true;
    this.debitNoteService.getDebitNoteMaster(id).subscribe((res) => {
      if (!res) return
      this.debitNoteModel = res.result
      this.patchDebitNote(this.debitNoteModel)
      this.isLoading = false;
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

    this.debitNoteForm.setControl('debitNoteLines', this.patchDebitNoteLines((this.billMaster) ? data.billLines : data.debitNoteLines))
    this.totalCalculation();
  }

  //Patch Debit Note Lines From Bill Or Debit Note Master Data
  patchDebitNoteLines(Lines: any): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: [line.itemId],
        description: [line.description, Validators.required],
        cost: [line.cost, [Validators.required, Validators.min(1)]],
        quantity: [line.quantity, [Validators.required,Validators.min(1)]],
        tax: [line.tax, [Validators.max(100), Validators.min(0)]],
        subTotal: [{ value: line.subTotal, disabled: true }],
        accountId: [line.accountId, [Validators.required]],
        warehouseId: [line.warehouseId]
        //locationId: line.locationId,
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
      this.toastService.error("Total Amount can't be Greater than Bill Amount", 'Error')
      return;
    }
    if (this.debitNoteForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToDebitNoteModel();
   // console.log(this.debitNoteModel)
    if (this.debitNoteModel.id) {
      this.debitNoteService.updateDebitNote(this.debitNoteModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((res) => {
          this.toastService.success('' + res.message, 'Updated Successfully')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + DEBIT_NOTE.ID_BASED_ROUTE('details',this.debitNoteModel.id ) ]);
        },
          (err) => {
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            this.isLoading = false;
            this.cdRef.detectChanges()
          })
    } else {
      delete this.debitNoteModel.id;
      this.debitNoteService.createDebitNote(this.debitNoteModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          (res) => {
            this.toastService.success('' + res.message, 'Created Successfully')
            this.router.navigate(['/'+ DEBIT_NOTE.LIST])
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

  //Mapping value to model
  mapFormValuesToDebitNoteModel() {
    this.debitNoteModel.vendorId = this.debitNoteForm.value.vendorName;
    this.debitNoteModel.noteDate = this.transformDate(this.debitNoteForm.value.noteDate, 'yyyy-MM-dd');
    //this.debitNoteModel.billTransactionId = null;
    this.debitNoteModel.debitNoteLines = this.debitNoteForm.value.debitNoteLines;
    this.debitNoteModel.campusId = this.debitNoteForm.value.campusId;
    // if (this.isBill) {
    //   this.debitNoteModel.billTransactionId = this.billMaster.transactionId;
    // }
  }

  //for save or submit
  isSubmit(val: number) {
    this.debitNoteModel.isSubmit = (val === 0) ? false : true;
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
    return !this.debitNoteForm.dirty;
  }
}


