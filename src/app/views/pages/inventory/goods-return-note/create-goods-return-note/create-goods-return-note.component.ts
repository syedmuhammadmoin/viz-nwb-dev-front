import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { IProduct} from '../../../profiling/product/model/IProduct';
import { ActivatedRoute, Router} from '@angular/router';
import { finalize, take} from 'rxjs/operators';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { ProductService} from '../../../profiling/product/service/product.service';
import { PurchaseOrderService} from '../../../purchase/purchase-order/service/purchase-order.service';
import { BusinessPartnerService} from '../../../profiling/business-partner/service/businessPartner.service';
import { CategoryService} from '../../../profiling/category/service/category.service';
import { WarehouseService} from '../../../profiling/warehouse/services/warehouse.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GOODS_RECEIVED_NOTE, GOODS_RETURN_NOTE } from 'src/app/views/shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IPurchaseOrder } from '../../../purchase/purchase-order/model/IPurchaseOrder';
import { IGoodsReturnNote } from '../model/IGoodsReturnNote';
import { GoodsReturnNoteService } from '../service/goods-return-note.service';
import { IGoodsReturnNoteLines } from '../model/IGoodsReturnNoteLines';
import { GrnService } from '../../goods-received-note/service/grn.service';
import { IGRNLines } from '../../goods-received-note/model/IGRNLines';

@Component({
  selector: 'kt-create-goods-return-note',
  templateUrl: './create-goods-return-note.component.html',
  styleUrls: ['./create-goods-return-note.component.scss']
})

export class CreateGoodsReturnNoteComponent extends AppComponentBase implements OnInit {

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  goodsReturnNoteForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'cost', 'tax', 'subTotal', 'warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Goods Return Note Model
  goodsReturnNoteModel: IGoodsReturnNote;

  title: string = 'Create Goods Return Note'

   //for resetting form
   @ViewChild('formDirective') private formDirective: NgForm;

   warehouseList: any = new BehaviorSubject<any>([])


   //show toast mesasge of on campus select
  showMessage: boolean = false;

  // param to get Grn master
  isGRN: any;
  grnMaster: any;

  hideDeleteButton: boolean = false;

  // for Edit
  isGoodsReturnNote: any;

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
    goodsReturnNoteDate: {
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
    goodsReturnNoteDate: '',
    contact: '',
    campusId: ''
  }

  constructor(
    private fb: FormBuilder,
    private goodsReturnNoteService: GoodsReturnNoteService,
    private purchaseOrderService: PurchaseOrderService,
    private grnService: GrnService,
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
    this.goodsReturnNoteForm = this.fb.group({
      vendorName: [{value: '' , disabled: true}, [Validators.required]],
      goodsReturnNoteDate: ['', [Validators.required]],
      contact: [''],
      campusId: [{value: '' , disabled: true},, [Validators.required]],
      goodsReturnNoteLines: this.fb.array([
        this.addGoodsReturnNoteLines()
      ])
    });

    this.goodsReturnNoteModel = {
      id: null,
      vendorId: null,
      returnDate: null,
      contact: null,
      grnId: null,
      campusId: null,
      goodsReturnNoteLines: []
    }

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isGoodsReturnNote = param.isGoodsReturnNote;
      this.isGRN = param.isGRN;
      if (id && this.isGRN) {
        this.getGRN(id);
      } else if (id && this.isGoodsReturnNote) {
        this.title = 'Edit Goods Return Note'
        this.getGoodsReturnNote(id);
      }
    })

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
  }

  // Form Reset
  reset() {
    // const goodsReturnNoteLineArray = this.goodsReturnNoteForm.get('goodsReturnNoteLines') as FormArray;
    // goodsReturnNoteLineArray.clear();
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const arrayControl = this.goodsReturnNoteForm.get('goodsReturnNoteLines') as FormArray;
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
    const arrayControl = this.goodsReturnNoteForm.get('goodsReturnNoteLines') as FormArray;
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
    const arrayControl = this.goodsReturnNoteForm.get('goodsReturnNoteLines') as FormArray;
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
    this.goodsReturnNoteModel.isSubmit = (val === 0) ? false : true;
  }


  // Add Goods Return Note Line
  addGoodsReturnNoteLineClick(): void {
    const controls = this.goodsReturnNoteForm.controls.goodsReturnNoteLines as FormArray;
    controls.push(this.addGoodsReturnNoteLines());
    this.table.renderRows();
  }

  addGoodsReturnNoteLines(): FormGroup {
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

  // Remove goodsReturnNote Line
  removeGoodsReturnNoteLineClick(goodsReturnNoteLineIndex: number): void {
    const goodsReturnNoteLineArray = this.goodsReturnNoteForm.get('goodsReturnNoteLines') as FormArray;

    if(goodsReturnNoteLineArray.length < 2 || goodsReturnNoteLineArray.length == 2) {
      this.hideDeleteButton = true;
    }

    if(goodsReturnNoteLineArray.length !== 1) {
      goodsReturnNoteLineArray.removeAt(goodsReturnNoteLineIndex);
      goodsReturnNoteLineArray.markAsDirty();
      goodsReturnNoteLineArray.markAsTouched();
      this.table.renderRows();
    }
  }

  //Get purchase Order Master Data
  private getGRN(id: number) {
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
      this.grnMaster = res.result
      this.patchGoodsReturnNote(this.grnMaster);
    });
  }

  // Get goodsReturnNote Data for Edit
  private getGoodsReturnNote(id: any) {
    this.isLoading = true;
    this.goodsReturnNoteService.getGoodsReturnNoteById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.goodsReturnNoteModel = res.result
      this.patchGoodsReturnNote(this.goodsReturnNoteModel)
    });
  }

  //Patch goodsReturnNote Form through goodsReturnNote Or purchase Order Master Data
  patchGoodsReturnNote(data: IPurchaseOrder | IGoodsReturnNote | any) {
    this.goodsReturnNoteForm.patchValue({
      vendorName: data.vendorId,
      goodsReturnNoteDate: data.returnDate ?? data.grnDate,
      campusId : data.campusId,
      contact: data.contact
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.goodsReturnNoteForm.setControl('goodsReturnNoteLines', this.patchGoodsReturnNoteLines(data.grnLines ?? data.goodsReturnNoteLines));
    this.totalCalculation();
  }

  //Patch goodsReturnNote Lines From GRN Or goodsReturnNote Master Data
  patchGoodsReturnNoteLines(Lines: IGoodsReturnNoteLines[] | IGRNLines[]): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: IGoodsReturnNoteLines | IGRNLines[] | any) => {
    if(line.pendingQuantity !== 0) {
      formArray.push(this.fb.group({
      itemId: [{value: line.itemId , disabled: true}, [Validators.required]],
      description: [{value: line.description , disabled: true}, Validators.required],
      cost: [line.cost, [Validators.required, Validators.min(1)]],
      quantity: [(line.pendingQuantity) ? line.pendingQuantity : line.quantity, [Validators.required, Validators.min(1), Validators.max(line.pendingQuantity)]],
      tax: [line.tax, [Validators.max(100), Validators.min(0)]],
      subTotal: [{value: line.subTotal, disabled: true}],
      warehouseId: [{value: line.warehouseId , disabled: true}, [Validators.required]]
    }))
    }
    })
    return formArray
  }

  // Submit goodsReturnNote Form
  onSubmit(): void {
    if (this.goodsReturnNoteForm.get('goodsReturnNoteLines').invalid) {
      this.goodsReturnNoteForm.get('goodsReturnNoteLines').markAllAsTouched();
    }
    const controls = this.goodsReturnNoteForm.controls.goodsReturnNoteLines as FormArray;
    if (controls.length == 0) {
      this.toastService.error('Please add goods received note lines', 'Error')
      return;
    }
    
    if (this.goodsReturnNoteForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Goods Return Note")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesTogoodsReturnNoteModel();
    console.log(this.goodsReturnNoteModel)
    if (this.goodsReturnNoteModel.id && this.isGoodsReturnNote) {
      console.log("entered 1")
      this.goodsReturnNoteService.updateGoodsReturnNote(this.goodsReturnNoteModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res) => {
            this.toastService.success('Updated Successfully', 'Goods Return Note')
            this.cdRef.detectChanges();
            this.router.navigate(['/'+ GOODS_RETURN_NOTE.ID_BASED_ROUTE('details', this.goodsReturnNoteModel.id)]);
          })
    } else if (this.grnMaster.id && this.isGRN) {
      delete this.goodsReturnNoteModel.id;
      console.log("entered 2")
      this.goodsReturnNoteService.createGoodsReturnNote(this.goodsReturnNoteModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res) => {
            this.toastService.success('Created Successfully', 'Goods Return Note')
            this.router.navigate(['/'+ GOODS_RETURN_NOTE.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesTogoodsReturnNoteModel() {
    this.goodsReturnNoteModel.vendorId = this.grnMaster?.vendorId || this.goodsReturnNoteModel?.vendorId;
    this.goodsReturnNoteModel.returnDate = this.transformDate(this.goodsReturnNoteForm.value.goodsReturnNoteDate, 'yyyy-MM-dd');
    this.goodsReturnNoteModel.contact = this.goodsReturnNoteForm.value.contact;
    this.goodsReturnNoteModel.campusId = this.goodsReturnNoteForm.getRawValue().campusId;
    this.goodsReturnNoteModel.grnId = this.grnMaster?.id || this.goodsReturnNoteModel?.grnId;
    this.goodsReturnNoteModel.goodsReturnNoteLines = this.goodsReturnNoteForm.getRawValue().goodsReturnNoteLines;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.goodsReturnNoteForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.goodsReturnNoteForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Goods Return Note")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.goodsReturnNoteForm.value.goodsReturnNoteLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Goods Return Note")
    }

     this.goodsReturnNoteForm.get('goodsReturnNoteLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
    //  if(this.showMessage) {
    //   this.toastService.info("Please Reselect Store!" , "Goods Received Note")
    //  }
     this.cdRef.detectChanges()
  }
}















