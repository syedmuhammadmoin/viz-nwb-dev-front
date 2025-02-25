import { BILL } from '../../../../shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { BehaviorSubject, Observable} from 'rxjs';
import { IVendorBill} from '../model/IVendorBill';
import { VendorBillService} from '../services/vendor-bill.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, take } from 'rxjs/operators';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { FormsCanDeactivate } from '../../../../shared/route-guards/form-confirmation.guard';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { PurchaseOrderService } from '../../purchase-order/service/purchase-order.service';
import { GrnService } from '../../../inventory/goods-received-note/service/grn.service';
import { AppConst } from 'src/app/views/shared/AppConst';

@Component({
  selector: 'kt-create-vendor-bill',
  templateUrl: './create-vendor-bill.component.html',
  styleUrls: ['./create-vendor-bill.component.scss']
})

export class CreateVendorBillComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

 // for permissions
 public permissions = Permissions;
  //Loader
  isLoading: boolean;

  // Declaring form variable
  vendorBillForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'cost', 'tax', 'anyOtherTax', 'subTotal','warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Vendor Bill Model
  vendorBillModel: IVendorBill = {} as IVendorBill;

  // For DropDown
  salesItem: IProduct[] | any[];

  // purchase order data
  purchaseOrderMaster: any;

  //grn data
  grnMaster: any;

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  isBill: any;
  isGRN: boolean = false;

  // params to get purchase order
  isPurchaseOrder: any;

  // for calculating grandtotal , totalBefore Tax, total Tax
  grandTotal = 0;
  totalBeforeTax = 0;
  totalTax = 0;
  taxes = 0;
  otherTaxes = 0;

  // Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition : boolean

  title: string = 'Create Bill'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    vendorName: {
      required: 'Vendor is required.',
    },
    billDate: {
      required: 'Bill Date is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
    dueDate: {
      required: 'Due Date is required.',
    }
  };

  // error keys..
  formErrors: any = {
    vendorName: '',
    billDate: '',
    campusId: null,
    dueDate: '',
  };

  constructor(
    private fb: FormBuilder,
    private billService: VendorBillService,
    private cdRef: ChangeDetectorRef,
    public productService: ProductService,
    public grnService: GrnService,
    public addButtonService: AddModalButtonService,
    public  activatedRoute: ActivatedRoute,
    private purchaseOrderService: PurchaseOrderService,
    public ngxsService:NgxsCustomService,
    injector: Injector,
  ) {
    super(injector);
  }
  public currentClient : any ={}
  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config

    // Creating Forms
    this.vendorBillForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      billDate: ['', [Validators.required]],
      campusId: (AppConst.ClientConfig.config.isCampus) ?  ['',  [Validators.required]] : [null,[Validators.nullValidator]],
      dueDate: ['', [Validators.required]],
      vendorBillLines: this.fb.array([
        this.addVendorBillLines()
      ])
    });

    //Get Data From Store
    this.ngxsService.getAllBusinessPartnerFromState();
    this.ngxsService.getOtherAccountsFromState()
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState()

    this.ngxsService.products$.subscribe(res => this.salesItem = res)

     // get id through route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isBill = param.isBill;
      this.isPurchaseOrder = param.isPurchaseOrder;
      this.isGRN = param.isGRN;
      if (id && this.isBill) {
        this.isLoading = true;
        this.title = 'Edit Bill'
        this.getBill(id);
      }
      else if (id && this.isPurchaseOrder) {
        this.isLoading = true;
        this.getPurchaseOrder(id);
      }
      else if (id && this.isGRN) {
        this.isLoading = true;
        this.getGrn(id);
      }
    })

    // handling dueDate logic
    this.vendorBillForm.get('billDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.vendorBillForm.get('dueDate').value < this.vendorBillForm.get('billDate').value
    })
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.totalBeforeTax = this.grandTotal = this.totalTax = this.taxes = this.otherTaxes = 0;
    this.showMessage = false;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.vendorBillForm.get('vendorBillLines') as FormArray;
    if (itemId) {
      const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
      const tax = this.salesItem.find(i => i.id === itemId).salesTax
      const account = (this.salesItem.find(i => i.id === itemId).productType == 1) ? this.salesItem.find(i => i.id === itemId).costAccountId
                      : this.salesItem.find(i => i.id === itemId).inventoryAccountId
      // set values for price & tax
      arrayControl.at(index).get('cost').setValue(cost);
      arrayControl.at(index).get('tax').setValue(tax);
      arrayControl.at(index).get('accountId').setValue(account);

      // Calculating subtotal
      // const quantity = arrayControl.at(index).get('quantity').value;
      // const subTotal = (cost * quantity) + ((cost * quantity) * (tax / 100))
      // arrayControl.at(index).get('subTotal').setValue(subTotal);
      this.onChangeEvent(null , index)
    }
  }

  // onChangeEvent for calculating subtotal
  onChangeEvent(value: any, index: number ,element?: HTMLElement | any) {
    const arrayControl = this.vendorBillForm.get('vendorBillLines') as FormArray;
    const cost = (arrayControl.at(index).get('cost').value) !== null ? arrayControl.at(index).get('cost').value : null;
    const salesTax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    const otherTax = (arrayControl.at(index).get('anyOtherTax').value) !== null ? arrayControl.at(index).get('anyOtherTax').value : null;
    const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    // calculating subTotal
    const subTotal = ((cost * quantity) + ((cost * quantity) * (salesTax / 100))) + otherTax
    arrayControl.at(index).get('subTotal').setValue(subTotal);
    this.totalCalculation();
  }

  // Calculations
  // Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    this.totalTax = 0;
    this.totalBeforeTax = 0;
    this.otherTaxes = 0;
    this.taxes = 0;
    this.grandTotal = 0;
    const arrayControl = this.vendorBillForm.get('vendorBillLines') as FormArray;
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

  // to add bill line
  addVendorBillLineClick(): void {
    const controls = this.vendorBillForm.controls.vendorBillLines as FormArray;
    controls.push(this.addVendorBillLines());
    this.table.renderRows();
  }

  addVendorBillLines(): FormGroup {
    return this.fb.group({
      itemId: [null],
      description: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required,Validators.min(1)]],
      tax: [0, [Validators.max(100), Validators.min(0)]],
      anyOtherTax: [0, [Validators.min(0)]],
      subTotal: [{value: '0', disabled: true}],
      accountId: ['', [Validators.required]],
      warehouseId: [null],
    });
  }

  //To remove bill line
  removeVendorBillLineClick(vendorBillLineIndex: number): void {
    const vendorBillArray = this.vendorBillForm.get('vendorBillLines') as FormArray;
    vendorBillArray.removeAt(vendorBillLineIndex);
    vendorBillArray.markAsDirty();
    vendorBillArray.markAsTouched();
    this.table.renderRows();
  }

  //Get purchase Order Master Data
  private getPurchaseOrder(id: number) {
    this.purchaseOrderService.getPurchaseOrderById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.purchaseOrderMaster = res.result;
      this.patchBill(this.purchaseOrderMaster);
    });
  }

  // Get Goods Received note Data for Edit
  private getGrn(id: any) {
    this.grnService.getGRNById(id)
    .pipe(
     take(1),
      finalize(() => {
       this.isLoading = false;
       this.cdRef.detectChanges();
      }),
      map((x: any) => {
        x.result.grnLines.map((line) => line.accountId = (this.salesItem?.find(i => i.id === line.itemId).costAccountId));
       return x
     }),
    )
    .subscribe((res) => {
       if (!res) {
         return
       }
       this.grnMaster = res.result;
       this.patchBill(this.grnMaster)
     });
   }

  // Get Bill Data for Edit
  private getBill(id: any) {
   this.billService.getVendorBillById(id)
   .pipe(
    take(1),
     finalize(() => {
      this.isLoading = false;
      this.cdRef.detectChanges();
     })
   )
   .subscribe((res) => {
      if (!res) {
        return
      }
      this.vendorBillModel = res.result
      this.patchBill(this.vendorBillModel)
    });
  }

  //Patch Bill Form through Bill Or purchase Order Master Data
  patchBill(data : any) {
    this.vendorBillForm.patchValue({
      vendorName: data.vendorId,
      billDate: (data.billDate) ? data.billDate : data.grnDate,
      dueDate: data.dueDate,
      campusId: data.campusId
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.vendorBillForm.setControl('vendorBillLines', this.patchBillLines((this.grnMaster) ? data.grnLines : data.billLines))

    if(this.isGRN) {
        //disable form fields
      this.disableFields(this.vendorBillForm , "vendorName", "campusId")

      //disable form Lines
      this.disableLinesFields(this.vendorBillForm.get('vendorBillLines')['controls'], "itemId", "description", "quantity", "accountId", "cost", "tax" , "anyOtherTax", "warehouseId")

      this.cdRef.detectChanges();
    }

    this.totalCalculation();
  }

  //Patch Bill Lines From GRN Or Bill Master Data
  patchBillLines(Lines: any): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: (this.isGRN) ? 0 : line.id,
        itemId: [line.itemId],
        description: [line.description, Validators.required],
        cost: [line.cost, [Validators.required, Validators.min(1)]],
        quantity: [line.quantity, [Validators.required,Validators.min(1)]],
        tax: [line.tax, [Validators.max(100), Validators.min(0)]],
        anyOtherTax: [(this.isGRN) ? 0 : line.anyOtherTax, [Validators.min(0)]],
        subTotal: [{ value: line.subTotal, disabled: true }],
        accountId: [line.accountId, [Validators.required]],
        warehouseId: [line.warehouseId]
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.vendorBillForm.get('vendorBillLines').invalid) {
      this.vendorBillForm.get('vendorBillLines').markAllAsTouched();
    }
    const controls = this.vendorBillForm.controls.vendorBillLines as FormArray;
    if (controls.length == 0) {
      this.toastService.error('Please add bill lines', 'Error')
      return;
    }

    if (this.vendorBillForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Vendor Bill")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToVendorBillModel();

    if (this.vendorBillModel.id) {
        this.billService.updateVendorBill(this.vendorBillModel)
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
          .subscribe((res) => {
            this.toastService.success('Updated Successfully', 'Vendor Bill')
            this.cdRef.detectChanges();
            this.router.navigate(['/' + BILL.ID_BASED_ROUTE('details',this.vendorBillModel.id )]);
          })
      } else {
        delete this.vendorBillModel.id;
        this.billService.createVendorBill(this.vendorBillModel)
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
          .subscribe(
            (res) => {
              this.toastService.success('Created Successfully', 'Vendor Bill')
              this.router.navigate(['/'+BILL.LIST])
              this.router.navigate(['/' + BILL.ID_BASED_ROUTE('details', res.result.id )]);
            });
      }
  }

  mapFormValuesToVendorBillModel() {
    //getRowvalue to get disabled fields
    this.vendorBillModel.vendorId = this.vendorBillForm.getRawValue().vendorName;
    this.vendorBillModel.billDate = this.transformDate(this.vendorBillForm.value.billDate, 'yyyy-MM-dd');
    this.vendorBillModel.dueDate = this.transformDate(this.vendorBillForm.value.dueDate, 'yyyy-MM-dd');
    this.vendorBillModel.campusId = this.vendorBillForm.getRawValue().campusId;
    this.vendorBillModel.grnId = (this.grnMaster?.id ?? this.vendorBillModel?.grnId ?? null)
    this.vendorBillModel.billLines = this.vendorBillForm.getRawValue().vendorBillLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.vendorBillModel.isSubmit = (val === 0) ? false : true;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.vendorBillForm.dirty;
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

  checkCampus() {
    this.showMessage = true;
    if(this.vendorBillForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Vendor Bill")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.vendorBillForm.value.vendorBillLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Vendor Bill")
    }

     this.vendorBillForm.get('vendorBillLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     this.cdRef.detectChanges()
  }
}
