

import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { IQuotation } from '../model/IQuotation';
import { QuotationService } from '../service/quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { QUOTATION } from 'src/app/views/shared/AppRoutes';
import { IQuotationLines } from '../model/IQuotationLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { RequisitionService } from '../../requisition/service/requisition.service';
import { IRequisition } from '../../requisition/model/IRequisition';


@Component({
  selector: 'kt-create-quotation',
  templateUrl: './create-quotation.component.html',
  styleUrls: ['./create-quotation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateQuotationComponent extends AppComponentBase implements OnInit {
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  // Declaring form variable
  quotationForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'price', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Quotation Model
  quotationModel: IQuotation = {} as IQuotation;

  requisitionId: number;

  // For DropDown
  salesItem: IProduct[];

  //variables for calculation
  grandTotal: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  title: string = 'Create Quotation'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    vendorId: {
      required: 'Vendor is required.',
    },
    quotationDate: {
      required: 'Quotation Date is required.',
    },
    timeframe: {
      required: 'Time Frame is required.',
    }
  };

  // error keys..
  formErrors = {
    vendorId: '',
    quotationDate: '',
    timeframe: '',
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private quotationService: QuotationService,
    private requisitionService: RequisitionService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.quotationForm = this.fb.group({
      vendorId: ['', [Validators.required]],
      quotationDate: ['', [Validators.required]],
      timeframe: ['', [Validators.required]],
      quotationLines: this.fb.array([
        this.addQuotationLines()
      ])
    });

    //Get Data From Store
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getOtherAccountsFromState()
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getCampusFromState()

    this.ngxsService.products$.subscribe(res => this.salesItem = res)

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isQuotation = param.isQuotation;
      const isRequisition = param.isRequisition;
      if (id && isQuotation) {
        this.isLoading = true;
        this.title = 'Edit Quotation'
        this.getQuotation(id);
      }

      if (id && isRequisition) {
        this.isLoading = true;
        this.requisitionId = +id;
        this.getRequisition(id);
      }
    });
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    let arrayControl = this.quotationForm.get('quotationLines') as FormArray;
    if (itemId) {
      const price = this.salesItem.find(i => i.id === itemId).purchasePrice

      // set values for purchasePrice & tax
      arrayControl.at(index).get('price').setValue(price);
    }
  }

  //Add Quotation Lines
  addQuotationLineClick(): void {
    const controls = this.quotationForm.controls.quotationLines as FormArray;
    controls.push(this.addQuotationLines());
    this.table.renderRows();
  }

  // Add Quotation Lines
  addQuotationLines(): FormGroup {
    return this.fb.group({
      itemId: [null , Validators.required],
      quantity: ['', [Validators.required,Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  //Remove Quotation Line
  removeQuotationLineClick(quotationLineIndex: number): void {
    const quotationLineArray = this.quotationForm.get('quotationLines') as FormArray;
    quotationLineArray.removeAt(quotationLineIndex);
    quotationLineArray.markAsDirty();
    quotationLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Get Requisition Data
  private getRequisition(id: number) {
    this.requisitionService.getRequisitionById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: any) => {
      if (!res) return
      this.patchQuotation(res.result)
    });
  }

  //Get Quotation Data for Edit
  private getQuotation(id: number) {
    this.quotationService.getQuotationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.quotationModel = res.result
      this.patchQuotation(this.quotationModel)
    });
  }

  //Patch Quotation Form through Quotation Or Requisition Master Data

  patchQuotation(data: IQuotation | IRequisition | any ) {
    this.quotationForm.patchValue({
      vendorId: data.vendorId,
      quotationDate: data.quotationDate ?? data.requisitionDate,
      timeframe: data.timeframe
    });

    this.showMessage = true;

    this.quotationForm.setControl('quotationLines', this.patchQuotationLines(data.quotationLines ?? data.requisitionLines))
  }

  //Patch Quotation Lines From Requisition Or Quotation Master Data
  patchQuotationLines(lines: IQuotationLines[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: (this.requisitionId) ? 0 : line.id,
        itemId: [line.itemId ,[Validators.required]],
        description: [line.description , Validators.required],
        price: [line.price ?? line.purchasePrice , [Validators.required, Validators.min(1)]],
        quantity: [line.quantity , [Validators.required,Validators.min(1)]]
      }))
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {

    if (this.quotationForm.get('quotationLines').invalid) {
      this.quotationForm.get('quotationLines').markAllAsTouched();
    }
    const controls = <FormArray>this.quotationForm.controls['quotationLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add quotation lines', 'Quotation')
      return;
    }

    if (this.quotationForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToQuotationModel();
    if (this.quotationModel.id) {
      this.quotationService.updateQuotation(this.quotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IQuotation>) => {
          this.toastService.success('Updated Successfully', 'Quotation')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + QUOTATION.ID_BASED_ROUTE('details', this.quotationModel.id)]);
        })
    } else {
      delete this.quotationModel.id;
      this.quotationService.createQuotation(this.quotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IQuotation>) => {
            this.toastService.success('Created Successfully', 'Quotation')
            this.router.navigate(['/' + QUOTATION.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToQuotationModel() {
    this.quotationModel.vendorId = this.quotationForm.value.vendorId;
    this.quotationModel.quotationDate = this.transformDate(this.quotationForm.value.quotationDate, 'yyyy-MM-dd');
    this.quotationModel.timeframe = this.quotationForm.value.timeframe;
    this.quotationModel.requisitionId = this.requisitionId || this.quotationModel.requisitionId || null;
    this.quotationModel.quotationLines = this.quotationForm.value.quotationLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.quotationModel.isSubmit = (val === 0) ? false : true;
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
}
