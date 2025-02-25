import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { IProduct} from '../../../profiling/product/model/IProduct';
import { IGRN} from '../model/IGRN';
import { ActivatedRoute, Router} from '@angular/router';
import { GrnService} from '../service/grn.service';
import { finalize, take} from 'rxjs/operators';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { ProductService} from '../../../profiling/product/service/product.service';
import { PurchaseOrderService} from '../../../purchase/purchase-order/service/purchase-order.service';
import { BusinessPartnerService} from '../../../profiling/business-partner/service/businessPartner.service';
import { CategoryService} from '../../../profiling/category/service/category.service';
import { WarehouseService} from '../../../profiling/warehouse/services/warehouse.service';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { BehaviorSubject, Observable } from 'rxjs';
import { GOODS_RECEIVED_NOTE } from 'src/app/views/shared/AppRoutes';
import { IGRNLines } from '../model/IGRNLines';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IPurchaseOrder } from '../../../purchase/purchase-order/model/IPurchaseOrder';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';

@Component({
  selector: 'kt-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss']
})

export class CreateGrnComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  grnForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'cost', 'tax', 'subTotal', 'warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  //Goods Received Note Model
  grnModel: IGRN | any = {} as IGRN;

  title: string = 'Create Goods Received Note'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  warehouseList: any = new BehaviorSubject<any>([])

   //show toast mesasge of on campus select
  showMessage: boolean = false;

  // param to get purchase order master
  isPurchaseOrder: any;
  purchaseOrderMaster: any;

  hideDeleteButton: boolean = false;

  // for Edit
  isGRN: any;
  grnId: number;

  // For Calculation
  grandTotal = 0 ;
  totalBeforeTax = 0 ;
  totalTax = 0;

  //For Product DropDown
  salesItem: IProduct[] = [];


  //Validation messages
  validationMessages = {
    vendorName: {
      required: 'Vendor is required.'
    },
    grnDate: {
      required: 'GRN Date is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
    contact : {
      pattern: '(Insert only number).',
      minlength: 'Minimun 10 digits.',
      maxlength: 'Maximum 15 digits.'
    }
  }

  //Error Keys
  formErrors: any = {
    vendorName: '',
    grnDate: '',
    contact: '',
    campusId: ''
  }

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private grnService: GrnService,
    private purchaseOrderService: PurchaseOrderService,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    public businessPartnerService: BusinessPartnerService,
    public productService: ProductService,
    public categoryService: CategoryService,
    public warehouseService: WarehouseService,
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
      contact: ['' ,[Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^[0-9]*$")]],
      campusId: [{value: '', disabled: true}, [Validators.required]],
      GRNLines: this.fb.array([
        this.addGRNLines()
      ])
    });

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isGRN = param.isGRN;
      this.isPurchaseOrder = param.isPurchaseOrder;
      if (id && this.isPurchaseOrder) {
        this.getPurchaseOrder(id);
      } else if (id && this.isGRN) {
        this.title = 'Edit Goods Received Note'
        this.grnId = +id;
        this.getGRN(id);
      }
    })

    this.ngxsService.products$.subscribe(res => this.salesItem = res);

    //Get Data from Store
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getAccountLevel4FromState()
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.grnForm.get('GRNLines') as FormArray;
    if (itemId) {
      const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
      const salesTax = this.salesItem.find(i => i.id === itemId).salesTax
      const account = this.salesItem.find(i => i.id === itemId).costAccountId
      // set values for price & tax
      arrayControl.at(index).get('cost').setValue(cost);
      arrayControl.at(index).get('tax').setValue(salesTax);
      arrayControl.at(index).get('accountId').setValue(account);
      // Calculating subtotal
      const quantity = arrayControl.at(index).get('quantity').value;
      const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
      arrayControl.at(index).get('subTotal').setValue(subTotal);
    }
  }

  // For Calculating subtotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number , element?: HTMLElement | any) {
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
  }

  //for save or submit
  isSubmit(val: number) {
    this.grnModel.isSubmit = (val === 0) ? false : true;
  }


  //Add Grn Line
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
      warehouseId: ['', [Validators.required]],
    });
  }

  //Remove Grn Line
  removeGRNLineClick(grnLineIndex: number): void {
    const grnLineArray = this.grnForm.get('GRNLines') as FormArray;

    if(grnLineArray.length < 2 || grnLineArray.length == 2) {
      this.hideDeleteButton = true;
    }

    if(grnLineArray.length !== 1) {
      grnLineArray.removeAt(grnLineIndex);
      grnLineArray.markAsDirty();
      grnLineArray.markAsTouched();
      this.table.renderRows();
    }
  }

  //Get purchase Order Master Data
  private getPurchaseOrder(id: number) {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.purchaseOrderMaster = res.result
      this.patchGRN(this.purchaseOrderMaster);
    });
  }

  // Get GRN Data for Edit
  private getGRN(id: any) {
    this.isLoading = true;
    this.grnService.getGRNById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.patchGRN(res.result)
    });
  }

  //Patch GRN Form GRN Or purchase Order Master Data
  patchGRN(data: IPurchaseOrder | IGRN | any) {
    this.grnForm.patchValue({
      vendorName: data.vendorId ?? data.employeeId,
      grnDate: data.grnDate ?? data.poDate,
      campusId : data.campusId,
      contact: data.contact
    });

    //setting id and purchaseOrderId
    this.grnModel.id = this.grnId;
    this.grnModel.purchaseOrderId = data.purchaseOrderId;

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.grnForm.setControl('GRNLines', this.patchGRNLines(data.grnLines ?? data.purchaseOrderLines));
    this.totalCalculation();
  }

  //Patch GRN Lines From purchase Order Or GRN Master
  patchGRNLines(Lines: IGRNLines[]): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: IGRNLines | any , index: number) => {
    if(line.pendingQuantity !== 0) {
      formArray.push(this.fb.group({
      id: (this.grnId) ? line.id : 0,
      itemId: [line.itemId, [Validators.required]],
      description: [line.description, Validators.required],
      cost: [line.cost, [Validators.required, Validators.min(1)]],
      quantity: [(line.pendingQuantity) ? line.pendingQuantity : line.quantity, [Validators.required, Validators.min(1), Validators.max(line.pendingQuantity)]],
      tax: [line.tax, [Validators.max(100), Validators.min(0)]],
      subTotal: [{value: line.subTotal, disabled: true}],
      warehouseId: [line.warehouseId, [Validators.required]]
    }))
    }
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
      this.toastService.error("Please fill all required fields!", "Goods Received Note")
        return;
    }

    this.mapFormValuesToGRNModel();

    const isDuplicateLines = this.grnModel.grnLines.some((a, index) => this.grnModel.grnLines.some((b, i) => (i !== index && (a.itemId === b.itemId && a.warehouseId === b.warehouseId))))

    if(isDuplicateLines) {
      this.toastService.error("Please Remove Duplicate Line!", "Goods Received Note")
      return;
    }

    this.isLoading = true;
      if (this.grnId) {
      this.grnService.updateGRN(this.grnModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res) => {
            this.toastService.success('Updated Successfully', 'Goods Received Note')
            this.cdRef.detectChanges();
            this.router.navigate(['/'+ GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details', this.grnModel.id)]);
          })
    } else if (this.isPurchaseOrder) {
      this.grnService.createGRN(this.grnModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res) => {
              this.toastService.success('Created Successfully', 'Goods Received Note')
              this.router.navigate(['/'+ GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToGRNModel() {
    this.grnModel.vendorId = this.grnForm.getRawValue().vendorName;
    this.grnModel.grnDate = this.transformDate(this.grnForm.value.grnDate, 'yyyy-MM-dd');
    this.grnModel.contact = this.grnForm.value.contact;
    this.grnModel.campusId = this.grnForm.getRawValue().campusId;
    this.grnModel.purchaseOrderId = this.purchaseOrderMaster?.id || this.grnModel?.purchaseOrderId;
    this.grnModel.grnLines = this.grnForm.value.GRNLines;
  }

  // Form Reset
  reset() {
    this.resetFields(this.grnForm , 'grnDate', 'contact' , 'GRNLines');
    //this.formDirective.resetForm();
    this.showMessage = false;
    // this.warehouseList.next([])
    this.table.renderRows();
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.grnForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.grnForm.value.campusId === null) {
      this.toastService.info("Please Select Campus First!", "Goods Received Note")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.grnForm.value.GRNLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Goods Received Note")
    }

     this.grnForm.get('GRNLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     this.cdRef.detectChanges()
  }
}
