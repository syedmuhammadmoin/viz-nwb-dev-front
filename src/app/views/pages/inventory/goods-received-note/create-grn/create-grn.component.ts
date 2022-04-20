import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IProduct} from '../../../profiling/product/model/IProduct';
import {IGRN} from '../model/IGRN';
import {ActivatedRoute, Router} from '@angular/router';
import {GrnService} from '../service/grn.service';
import {finalize, take} from 'rxjs/operators';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {ProductService} from '../../../profiling/product/service/product.service';
import {PurchaseOrderService} from '../../../purchase/purchase-order/service/purchase-order.service';
import {BusinessPartnerService} from '../../../profiling/business-partner/service/businessPartner.service';
import {CategoryService} from '../../../profiling/category/service/category.service';
import {WarehouseService} from '../../../profiling/warehouse/services/warehouse.service';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { Observable } from 'rxjs';
import { GOODS_RECEIVED_NOTE } from 'src/app/views/shared/AppRoutes';

@Component({
  selector: 'kt-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateGrnComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  // For Loading
  isLoading: boolean;

  vendorBillModel: any;
  isBill = false;

  // Declaring form variable
  grnForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'locationId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Goods Received NoteModel
  grnModel: IGRN;

  // param to get purchase order master
  isPurchaseOrder: any;
  purchaseOrderMaster: any;

  // for Edit
  isGRN: any;


  // For DropDown
  salesItem: IProduct[] = [];


  // validation messages
  validationMessages = {
    vendorName: {
      required: 'Vendor Name is required'
    },
    grnDate: {
      required: 'ate is required'
    },
    // 'contact' : {
    //   'required': 'Due Date is required'
    // },
  }

  // Error Keys
  formErrors = {
    vendorName: '',
    grnDate: '',
    contact: '',
  }

  constructor(
    private fb: FormBuilder,
    private grnService: GrnService,
    private purchaseOrderService: PurchaseOrderService,
    public businessPartnerService: BusinessPartnerService,
    public productService: ProductService,
    public categoryService: CategoryService,
    public warehouseService: WarehouseService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    this.grnForm = this.fb.group({
      vendorName: [{value: '', disabled: true}, [Validators.required]],
      grnDate: ['', [Validators.required]],
      contact: [''],
      GRNLines: this.fb.array([
        this.addGRNLines()
      ])
    });

    this.grnModel = {
      id: null,
      vendorId: null,
      grnDate: null,
      contact: null,
      grnLines: []
    }

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isGRN = param.isGRN;
      this.isPurchaseOrder = param.isPurchaseOrder;
      if (id && this.isPurchaseOrder) {
        this.getPurchaseOrder(id);
      } else if (id && this.isGRN) {
        this.getGRN(id);
      }
    })

    this.productService.getProducts().subscribe(res => this.salesItem = res.result)
  }

  // Form Reset
  reset() {
    const grnLineArray = this.grnForm.get('GRNLines') as FormArray;
    grnLineArray.clear();
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    // var arrayControl = this.grnForm.get('GRNLines') as FormArray;
    // if (itemId) {
    //   var salesPrice = this.salesItem.find(i => i.id === itemId).salesPrice
    //   var salesTax = this.salesItem.find(i => i.id === itemId).salesTax
    //   //set values for price & tax
    //   arrayControl.at(index).get('salesPrice').setValue(salesPrice);
    //   arrayControl.at(index).get('salesTax').setValue(salesTax);
    //   //Calculating subtotal
    //   var quantity = arrayControl.at(index).get('quantity').value;
    //   var subTotal = (salesPrice * quantity) + ((salesPrice * quantity) * (salesTax / 100))
    //   //console.log('Subtotal', subTotal);
    //   arrayControl.at(index).get('subTotal').setValue(subTotal);
    // }
  }

  // onChangeEvent for calculating subtotal
  onChangeEvent(value: any, index: number, element?: HTMLElement) {

    // const arrayControl = this.grnForm.get('GRNLines') as FormArray;
    // const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;
    // const ton = (arrayControl.at(index).get('ton').value) !== null ? arrayControl.at(index).get('ton').value : null;

    // For Quantity And Ton conversion
    // const selectedElement = element.getAttribute('formControlName');

    // (selectedElement === 'quantity') ? arrayControl.at(index).get('ton').setValue((quantity / 20).toFixed(1)) : arrayControl.at(index).get('quantity').setValue((ton * 20))
  }


  // Add Grn Line
  addGRNLineClick(): void {
    const controls = this.grnForm.controls.GRNLines as FormArray;
    controls.push(this.addGRNLines());
    this.table.renderRows();
  }

  addGRNLines(): FormGroup {
    return this.fb.group({
      itemId: [''],
      // acccountId: ['', Validators.required],
      description: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      tax: ['', [Validators.max(100), Validators.min(0)]],
      locationId: ['', Validators.required],
    });
  }

  // Remove Grn Line
  removeGRNLineClick(grnLineIndex: number): void {
    const grnLineArray = this.grnForm.get('GRNLines') as FormArray;
    grnLineArray.removeAt(grnLineIndex);
    grnLineArray.markAsDirty();
    grnLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Get purchase Order Master Data
  private getPurchaseOrder(id: number) {
    this.isLoading = true;
    // this.purchaseOrderService.getPurchaseMasterById(id).subscribe((res) => {
    //   if (!res) return
    //   this.purchaseOrderMaster = res.result
    //   this.patchGRN(this.purchaseOrderMaster);
    //   this.isLoading = false;
    // }, (err) => {
    //   console.log(err);
    // });
  }

  // Get GRN Data for Edit
  private getGRN(id: any) {
    this.isLoading = true;
    this.grnService.getGRNMasterById(id).subscribe((res) => {
      if (!res) return
      this.grnModel = res.result
      this.patchGRN(this.grnModel)
      this.isLoading = false;
    });
  }

  //Patch GRN Form through GRN Or purchase Order Master Data
  patchGRN(data: any) {
    this.grnForm.patchValue({
      vendorName: data.vendorId,
      grnDate: (data.grnDate) ? data.grnDate : data.poDate,
      contact: data.contact
    });

    this.grnForm.setControl('GRNLines', this.patchGRNLines((this.purchaseOrderMaster) ? data.purchaseOrderLines : data.grnLines))
  }

  //Patch GRN Lines From purchase Order Or GRN Master Data
  patchGRNLines(Lines: any): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: line.itemId,
        description: line.description,
        cost: line.cost,
        quantity: [line.quantity, [Validators.min(1), Validators.max(line.quantity)]],
        tax: line.tax,
        locationId: line.locationId,
      }))
    })
    return formArray
  }

  // Submit GRN Form
  onSubmit(): void {
    if (this.grnForm.get('GRNLines').invalid) {
      this.grnForm.get('GRNLines').markAllAsTouched();
    }
    const controls = this.grnForm.controls.GRNLines as FormArray;
    if (controls.length == 0) {
      this.toastService.error('Please add goods received note lines', 'Error')
      return;
    }
    if (this.grnForm.invalid) {
      return
    }

    this.mapFormValuesToGRNModel();
    if (this.grnModel.id && this.isGRN) {
      this.isLoading = true;
      this.grnService.updateGRN(this.grnModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((res) => {
            this.toastService.success('' + res.message, 'Updated Successfully')
            this.cdRef.detectChanges();
            this.router.navigate(['/'+GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details', this.grnModel.id) ]);
          },
          (err) => {
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            this.isLoading = false;
            this.cdRef.detectChanges()
          })
    } else if (this.purchaseOrderMaster.id && this.isPurchaseOrder) {
      delete this.grnModel.id;
      this.isLoading = true;
      this.grnService.createGRN(this.grnModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          (res) => {
            this.toastService.success('' + res.message, 'Created Successfully')
            this.router.navigate(['/'+GOODS_RECEIVED_NOTE.LIST])
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
  mapFormValuesToGRNModel() {
    this.grnModel.vendorId = this.purchaseOrderMaster?.vendorId || this.grnModel?.vendorId;
    this.grnModel.grnDate = this.transformDate(this.grnForm.value.grnDate, 'yyyy-MM-dd');
    this.grnModel.contact = this.grnForm.value.contact;
    this.grnModel.grnLines = this.grnForm.value.GRNLines;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.grnForm.dirty;
  }
}












