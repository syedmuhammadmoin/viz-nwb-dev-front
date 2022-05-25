import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {IDispatchNote} from '../model/IDispatchNote'
import {FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {IProduct} from '../../../profiling/product/model/IProduct';
import {RequireMatch as RequireMatch} from 'src/app/views/shared/requireMatch';
import {DispatchNoteService} from '../service/dispatch-note.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {BusinessPartnerService} from '../../../profiling/business-partner/service/businessPartner.service';
import {ProductService} from '../../../profiling/product/service/product.service';
import {finalize, take} from 'rxjs/operators';
import {WarehouseService} from '../../../profiling/warehouse/services/warehouse.service';
import {SaleOrderService} from '../../../sales/sales-order/service/sale-order.service';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { Observable } from 'rxjs';
import { DISPATCH_NOTE } from 'src/app/views/shared/AppRoutes';

@Component({
  selector: 'kt-create-dispatch-note',
  templateUrl: './create-dispatch-note.component.html',
  styleUrls: ['./create-dispatch-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateDispatchNoteComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  // for Loading
  isLoading: boolean;

  // Declaring form variable
  dispatchNoteForm: FormGroup;

  // Dispatch Note Model
  gdnModel: IDispatchNote

  // For Table Columns
  //  displayedColumns = ['itemId', 'description', 'quantity','ton', 'locationId', 'action']
  displayedColumns = ['itemId', 'description', 'quantity', 'locationId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // sales Item list
  salesItem: IProduct[] = [];

  // param to get GDN Data
  isSalesOrder: any;
  isGDN: any;
  salesOrderMaster: any;

  // validation messages
  validationMessages = {
    customerName: {
      required: 'Customer Name is required'
    },
    gdnDate: {
      required: 'Date is required'
    },
    /*contact : {
      required: 'Contact Nubmer is required'
    },*/
  }

  // Error Keys
  formErrors = {
    customerName: '',
    gdnDate: '',
    // contact : '',
  }

  // Injecting dependencies
  constructor(
    private fb: FormBuilder,
    private dispatchNoteService: DispatchNoteService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public businessPartnerService: BusinessPartnerService,
    public productService: ProductService,
    public warehouseService: WarehouseService,
    public salesOrderService: SaleOrderService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    this.dispatchNoteForm = this.fb.group({
      customerName: [{value: '', disabled: true}, Validators.required],
      gdnDate: ['', [Validators.required]],
      contact: [''],
      dispatchNoteLines: this.fb.array([
        this.addDispatchNoteLines()
      ])
    });

    this.gdnModel = {
      id: null,
      customerId: null,
      gdnDate: null,
      contact: null,
      gdnLines: []
    }

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isGDN = param.isGDN;
      this.isSalesOrder = param.isSalesOrder;
      if (id && this.isSalesOrder) {
        this.getSalesOrder(id);
      } else if (id && this.isGDN) {
        this.getGDN(id);
      }
    })

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result)
  }


  // Form Reset
  reset() {
    const dispatchNoteLineArray = this.dispatchNoteForm.get('dispatchNoteLines') as FormArray;
    dispatchNoteLineArray.clear();
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    // let arrayControl = this.dispatchNoteForm.get('dispatchNoteLines') as FormArray;
    // if (itemId) {
    //   let salesPrice = this.salesItem.find(i => i.id === itemId).salesPrice
    //   let salesTax = this.salesItem.find(i => i.id === itemId).salesTax
    //   // set values for price & tax
    //   arrayControl.at(index).get('salesPrice').setValue(salesPrice);
    //   arrayControl.at(index).get('salesTax').setValue(salesTax);
    //   // Calculating subtotal
    //   let quantity = arrayControl.at(index).get('quantity').value;
    //   let subTotal = (salesPrice * quantity) + ((salesPrice * quantity) * (salesTax / 100))
    //   console.log('Subtotal', subTotal);
    //   arrayControl.at(index).get('subTotal').setValue(subTotal);
    // }
  }

  // onChangeEvent for calculating subtotal
  onChangeEvent(value: any, index: number, element?: HTMLElement) {

    // const arrayControl = this.dispatchNoteForm.get('dispatchNoteLines') as FormArray;
    // const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;
    // const ton = (arrayControl.at(index).get('ton').value) !== null ? arrayControl.at(index).get('ton').value : null;

    // For Quantity And Ton conversion
    // const selectedElement = element.getAttribute('formControlName');

    // (selectedElement === 'quantity') ? arrayControl.at(index).get('ton').setValue((quantity / 20).toFixed(1)) : arrayControl.at(index).get('quantity').setValue((ton * 20))
  }

  // Add Dispatch Note Line
  addDispatchNoteLineClick(): void {
    const controls = this.dispatchNoteForm.controls.dispatchNoteLines as FormArray;
    controls.push(this.addDispatchNoteLines());
    this.table.renderRows();
  }

  addDispatchNoteLines(): FormGroup {
    return this.fb.group({
      itemId: [''],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      tax: ['', [Validators.max(100), Validators.min(0)]],
      locationId: ['', [RequireMatch, Validators.required]],
    });
  }

  // Remove Dispatch Note Lines
  removeDispatchNoteLineClick(dispatchNoteLineIndex: number): void {
    const dispatchNoteLineArray = this.dispatchNoteForm.get('dispatchNoteLines') as FormArray;
    dispatchNoteLineArray.removeAt(dispatchNoteLineIndex);
    dispatchNoteLineArray.markAsDirty();
    dispatchNoteLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Get sales Order Master Data
  private getSalesOrder(id: number) {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderById(id).subscribe((res) => {
      this.salesOrderMaster = res.result
      this.patchGDN(this.salesOrderMaster);
      this.isLoading = false;
    }, (err) => {
      console.log(err);
    });
  }

  // Get GDN Data for Edit
  private getGDN(id: any) {
    this.isLoading = true;
    this.dispatchNoteService.getDispatchNoteMasterById(id).subscribe((res) => {
      if (!res) {
        return
      }
      this.gdnModel = res.result
      this.patchGDN(this.gdnModel)
      this.isLoading = false;
    });
  }

   //Patch GDN Form through GDN Or sales Order Master Data
   patchGDN(data: any) {
    this.dispatchNoteForm.patchValue({
      customerName: data.customerId,
      gdnDate: (data.gdnDate) ? data.gdnDate : data.salesOrderDate,
      contact: data.contact
    });

    this.dispatchNoteForm.setControl('dispatchNoteLines', this.patchGDNLines((this.salesOrderMaster) ? data.salesOrderLines : data.gdnLines))
  }

  //Patch GDN Lines From sales Order Or GDN Master Data
  patchGDNLines(Lines: any): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: line.itemId,
        description: line.description,
        price: line.price,
        quantity: [line.quantity, [Validators.min(1), Validators.max(line.quantity)]],
        tax: line.tax,
        locationId: line.locationId,
      }))
    })
    return formArray
  }

  // Submit Dispatch Note Form
  onSubmit(): void {

    if (this.dispatchNoteForm.get('dispatchNoteLines').invalid) {
      this.dispatchNoteForm.get('dispatchNoteLines').markAllAsTouched();
    }
    const controls = this.dispatchNoteForm.controls.dispatchNoteLines as FormArray;
    if (controls.length == 0) {
      this.toastService.error('Please add goods dispatch note lines', 'Error')
      return;
    }
    if (this.dispatchNoteForm.invalid) {
      return;
    }

    this.mapFormValuesToDispatchNoteModel();
    if (this.gdnModel.id && this.isGDN) {
      this.isLoading = true;
      this.dispatchNoteService.updateGDN(this.gdnModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((res) => {
            this.toastService.success('' + res.message, 'Updated Successfully')
            this.cdRef.detectChanges();
            this.router.navigate(['/'+ DISPATCH_NOTE.ID_BASED_ROUTE('details',this.gdnModel.id) ]);
          },
          (err) => {
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            this.isLoading = false;
            this.cdRef.detectChanges()
          })
    } else if (this.salesOrderMaster.id && this.isSalesOrder) {
      delete this.gdnModel.id;
      this.isLoading = true;
      this.dispatchNoteService.createDispatchNote(this.gdnModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          (res) => {
            this.toastService.success('' + res.message, 'Created Successfully')
            this.router.navigate(['/'+ DISPATCH_NOTE.CREATE])
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

  // Mapping value to model
  mapFormValuesToDispatchNoteModel() {
    this.gdnModel.customerId = this.salesOrderMaster?.customerId || this.gdnModel?.customerId;
    this.gdnModel.gdnDate = this.transformDate(this.dispatchNoteForm.value.gdnDate, 'yyyy-MM-dd');
    this.gdnModel.contact = this.dispatchNoteForm.value.contact;
    this.gdnModel.gdnLines = this.dispatchNoteForm.value.dispatchNoteLines;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.dispatchNoteForm.dirty;
  }
}






