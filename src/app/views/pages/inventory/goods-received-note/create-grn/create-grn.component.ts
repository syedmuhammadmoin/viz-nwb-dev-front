import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { GOODS_RECEIVED_NOTE } from 'src/app/views/shared/AppRoutes';
import { IGRNLines } from '../model/IGRNLines';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IPurchaseOrder } from '../../../purchase/purchase-order/model/IPurchaseOrder';
import { IssuanceService } from '../../issuance/service/issuance.service';
import { IIssuance } from '../../issuance/model/IIssuance';

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

   //for resetting form
   @ViewChild('formDirective') private formDirective: NgForm;

   warehouseList: any = new BehaviorSubject<any>([])


   //show toast mesasge of on campus select
  showMessage: boolean = false;

  // param to get purchase order master
  isPurchaseOrder: any;
  purchaseOrderMaster: any;

  // param to get Issuance master
  isIssuance: any;
  issuanceMaster: any;

  hideDeleteButton: boolean = false;

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
    private issuanceService: IssuanceService,
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
      issuanceId: null,
      purchaseOrderId: null,
      campusId: null,
      grnLines: []
    }

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result);

    // get Vendor from state
    this.ngxsService.getBusinessPartnerFromState();
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();

    this.ngxsService.getCampusFromState();

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isGRN = param.isGRN;
      this.isPurchaseOrder = param.isPurchaseOrder;
      this.isIssuance = param.isIssuance;
      if (id && this.isPurchaseOrder) {
        this.getPurchaseOrder(id);
      } else if (id && this.isGRN) {
        this.title = 'Edit Goods Received Note'
        this.getGRN(id);
      }
      else if (id && this.isIssuance) {
        this.title = 'Create Issuance Return'
        this.getIssuance(id);
      }
    })
  }

  // Form Reset
  reset() {
    const grnLineArray = this.grnForm.get('GRNLines') as FormArray;
    this.formDirective.resetForm();
    grnLineArray.clear();
    this.showMessage = false;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.grnForm.get('GRNLines') as FormArray;
    console.log(arrayControl)
    if (itemId) {
      const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
      console.log(cost)
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
      warehouseId: ['', [Validators.required]],
    });
  }

  // Remove Grn Line
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

  //Get Issuance Master Data
  private getIssuance(id: number) {
    this.isLoading = true;
    this.issuanceService.getIssuanceById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.issuanceMaster = res.result
      this.patchGRN(this.issuanceMaster);
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
      this.grnModel = res.result
      this.patchGRN(this.grnModel)
    });
  }

  //Patch GRN Form through GRN Or purchase Order Master Data
  patchGRN(data: IPurchaseOrder | IGRN | IIssuance | any) {
    this.grnForm.patchValue({
      vendorName: data.vendorId ?? data.employeeId,
      grnDate: data.grnDate ?? data.poDate ?? data.issuanceDate,
      campusId : data.campusId,
      contact: data.contact
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.grnForm.setControl('GRNLines', this.patchGRNLines(data.grnLines ?? data.purchaseOrderLines ?? data.issuanceLines));
    
    this.totalCalculation();
  }

  //Patch GRN Lines From purchase Order Or GRN Master Or Issuance Data
  patchGRNLines(Lines: IGRNLines[]): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: IGRNLines | any , index: number) => {
    if(line.pendingQuantity !== 0) {
      formArray.push(this.fb.group({
      itemId: [line.itemId, [Validators.required]],
      description: [line.description, Validators.required],
      cost: [line.cost, [Validators.required, Validators.min(1)]],
      quantity: [(line.pendingQuantity) ? line.pendingQuantity : line.quantity, [Validators.required, Validators.min(1), Validators.max(line.pendingQuantity)]],
      tax: [line.tax, [Validators.max(100), Validators.min(0)]],
      subTotal: [{value: line.subTotal, disabled: true}],
      warehouseId: [line.warehouseId, [Validators.required]]
    }))
    }
     
    if(this.isIssuance) {
      this.onItemSelected(line.itemId , index)
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
    console.log(this.grnModel)
    if (this.grnModel.id && this.isGRN) {
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
    } else if (this.isPurchaseOrder ?? this.isIssuance) {
      delete this.grnModel.id;
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
            if(this.isPurchaseOrder) {
              this.toastService.success('Created Successfully', 'Goods Received Note')
            }
            else {
              this.toastService.success('Created Successfully', 'Issuance Return')
            }
            this.router.navigate(['/'+ GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToGRNModel() {
    this.grnModel.vendorId = this.purchaseOrderMaster?.vendorId || this.grnModel?.vendorId;
    this.grnModel.grnDate = this.transformDate(this.grnForm.value.grnDate, 'yyyy-MM-dd');
    this.grnModel.contact = this.grnForm.value.contact;
    this.grnModel.campusId = this.grnForm.value.campusId;
    this.grnModel.purchaseOrderId = this.purchaseOrderMaster?.id || this.grnModel?.purchaseOrderId;
    this.grnModel.issuanceId = this.issuanceMaster?.id || this.grnModel?.issuanceId;
    this.grnModel.grnLines = this.grnForm.value.GRNLines;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.grnForm.dirty;
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

     this.grnForm.get('GRNLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     if(this.showMessage) {
      this.toastService.info("Please Reselect Store!" , "Goods Received Note")
     }
     this.cdRef.detectChanges()
  }
}












