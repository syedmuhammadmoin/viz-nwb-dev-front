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
import { IGRNLines } from '../model/IGRNLines';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IPurchaseOrder } from '../../../purchase/purchase-order/model/IPurchaseOrder';

@Component({
  selector: 'kt-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateGrnComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  grnForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'cost', 'tax', 'subTotal', 'warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Goods Received NoteModel
  grnModel: IGRN;

  title: string = 'Create Goods Received Note'

  // param to get purchase order master
  isPurchaseOrder: any;
  purchaseOrderMaster: any;

  // for Edit
  isGRN: any;

  // For Calculation
  grandTotal = 0 ;
  totalBeforeTax = 0 ;
  totalTax = 0;

  // For DropDown
  salesItem: IProduct[] = [];


  // validation messages
  validationMessages = {
    vendorName: {
      required: 'Vendor Name is required.'
    },
    grnDate: {
      required: 'Date is required.'
    },
    campusId: {
      required: 'Campus is required.'
    }
    // 'contact' : {
    //   'required': 'Due Date is required'
    // },
  }

  // Error Keys
  formErrors = {
    vendorName: '',
    grnDate: '',
    contact: '',
    campusId: ''
  }

  constructor(
    private fb: FormBuilder,
    private grnService: GrnService,
    private purchaseOrderService: PurchaseOrderService,
    public ngxsService: NgxsCustomService,
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
      campusId: ['', [Validators.required]],
      GRNLines: this.fb.array([
        this.addGRNLines()
      ])
    });

    this.grnModel = {
      id: null,
      vendorId: null,
      grnDate: null,
      contact: null,
      purchaseOrderId: null,
      campusId: null,
      grnLines: []
    }

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isGRN = param.isGRN;
      this.isPurchaseOrder = param.isPurchaseOrder;
      if (id && this.isPurchaseOrder) {
        this.getPurchaseOrder(id);
      } else if (id && this.isGRN) {
        this.title = 'Edit Goods Received Note'
        this.getGRN(id);
      }
    })

    this.productService.getProducts().subscribe(res => this.salesItem = res.result);

    // get Vendor from state
    this.ngxsService.getBusinessPartnerFromState();
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();

    this.ngxsService.getCampusFromState();
  }

  // Form Reset
  reset() {
    const grnLineArray = this.grnForm.get('GRNLines') as FormArray;
    grnLineArray.clear();
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.grnForm.get('GRNLines') as FormArray;
    if (itemId) {
      const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
      const salesTax = this.salesItem.find(i => i.id === itemId).salesTax
      // set values for price & tax
      arrayControl.at(index).get('cost').setValue(cost);
      arrayControl.at(index).get('tax').setValue(salesTax);
      // Calculating subtotal
      const quantity = arrayControl.at(index).get('quantity').value;
      const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  // For Calculating subtotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number , element?: HTMLElement) {
    const arrayControl = this.grnForm.get('GRNLines') as FormArray;
    const cost = (arrayControl.at(index).get('cost').value) !== null ? arrayControl.at(index).get('cost').value : null;
    const salesTax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    // calculating subTotal
    const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    this.totalCalculation();
  }

  // Calculations
  // Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    this.totalTax = 0;
    this.totalBeforeTax = 0;
    this.grandTotal = 0;
    const arrayControl = this.grnForm.get('GRNLines') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      const cost = arrayControl.at(index).get('cost').value;
      const tax = arrayControl.at(index).get('tax').value;
      const quantity = arrayControl.at(index).get('quantity').value;
      this.totalTax += ((cost * quantity) * tax) / 100
      this.totalBeforeTax += cost * quantity;
      this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    });
    console.log(this.totalBeforeTax)
  }

  //for save or submit
  isSubmit(val: number) {
    this.grnModel.isSubmit = (val === 0) ? false : true;
  }


  // Add Grn Line
  addGRNLineClick(): void {
    const controls = this.grnForm.controls.GRNLines as FormArray;
    controls.push(this.addGRNLines());
    this.table.renderRows();
  }

  addGRNLines(): FormGroup {
    return this.fb.group({
      itemId: ['', [Validators.required]],
      description: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      tax: ['', [Validators.max(100), Validators.min(0)]],
      subTotal: [{value: '0', disabled: true}],
      warehouseId: [null],
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
    this.purchaseOrderService.getPurchaseOrderById(id).subscribe((res) => {
      if (!res) return
      this.purchaseOrderMaster = res.result
      this.patchGRN(this.purchaseOrderMaster);
      this.isLoading = false;
    });
  }

  // Get GRN Data for Edit
  private getGRN(id: any) {
    this.isLoading = true;
    this.grnService.getGRNById(id).subscribe((res) => {
      if (!res) return
      this.grnModel = res.result
      this.patchGRN(this.grnModel)
      this.isLoading = false;
    });
  }

  //Patch GRN Form through GRN Or purchase Order Master Data
  patchGRN(data: IPurchaseOrder | IGRN | any) {
    this.grnForm.patchValue({
      vendorName: data.vendorId,
      grnDate: (data.grnDate) ? data.grnDate : data.poDate,
      campusId : data.campusId,
      contact: data.contact
    });

    this.grnForm.setControl('GRNLines', this.patchGRNLines((this.purchaseOrderMaster) ? data.purchaseOrderLines : data.grnLines));
    this.totalCalculation();
  }

  //Patch GRN Lines From purchase Order Or GRN Master Data
  patchGRNLines(Lines: IGRNLines[]): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: IGRNLines | any) => {
      formArray.push(this.fb.group({
        itemId: [line.itemId, [Validators.required]],
        description: [line.description, Validators.required],
        cost: [line.cost, [Validators.required, Validators.min(1)]],
        quantity: [line.quantity, [Validators.required, Validators.min(1)]],
        tax: [line.tax, [Validators.max(100), Validators.min(0)]],
        subTotal: [{value: line.subTotal, disabled: true}],
        warehouseId: [line.warehouseId]
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
            this.router.navigate(['/'+ GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details', this.grnModel.id)]);
          },
          (err) => {
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            this.isLoading = false;
            this.cdRef.detectChanges()
          })
    } else if (this.purchaseOrderMaster.id && this.isPurchaseOrder) {
      console.log(this.grnModel)
      delete this.grnModel.id;
      this.isLoading = true;
      this.grnService.createGRN(this.grnModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          (res) => {
            this.toastService.success('' + res.message, 'Created Successfully')
            this.router.navigate(['/'+ GOODS_RECEIVED_NOTE.LIST])
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
    this.grnModel.campusId = this.grnForm.value.campusId;
    this.grnModel.purchaseOrderId = this.purchaseOrderMaster?.id || this.grnModel?.purchaseOrderId;
    this.grnModel.grnLines = this.grnForm.value.GRNLines;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.grnForm.dirty;
  }
}












