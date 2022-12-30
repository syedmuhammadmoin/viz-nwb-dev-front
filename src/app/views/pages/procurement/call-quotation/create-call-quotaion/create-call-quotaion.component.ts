import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ICallQuotation } from '../model/ICallQuotation';
import { CallQuotationService } from '../service/call-quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CALL_QUOTATION } from 'src/app/views/shared/AppRoutes';
import { ICallForQuotationLines } from '../model/ICallQuotationLines';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { RequisitionService } from '../../requisition/service/requisition.service';
import { IRequisition } from '../../requisition/model/IRequisition';


@Component({
  selector: 'kt-create-call-quotaion',
  templateUrl: './create-call-quotaion.component.html',
  styleUrls: ['./create-call-quotaion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateCallQuotaionComponent extends AppComponentBase implements OnInit {
  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  callQuotationForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity' , 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Quotation Model
  callQuotationModel: ICallQuotation;

  // For DropDown
  salesItem: IProduct[];

  isRequisition: number;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  title: string = 'Create Call Quotation'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    vendorId: {
      required: 'Vendor is required.',
    },
    callForQuotationDate: {
      required: 'Call Quotation Date is required.',
    },
    description: {
      required: 'Description is required.',
    },
    // contact: {
    //   required: 'Contact Name is required.',
    // }
  };

  // error keys..
  formErrors = {
    vendorId: '',
    callForQuotationDate: '',
    description: '',
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private callQuotationService: CallQuotationService,
    private requisitionService: RequisitionService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.callQuotationForm = this.fb.group({
      vendorId: ['', [Validators.required]],
      callForQuotationDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      callForQuotationLines: this.fb.array([
        this.addCallQuotationLines()
      ])
    });

    this.callQuotationModel = {
      id: null,
      vendorId: null,
      callForQuotationDate: null,
      description: null,
      callForQuotationLines: []
    }

    // get customer from state
    this.ngxsService.getBusinessPartnerFromState();
    // get item from state
    this.ngxsService.getProductFromState();

    this.ngxsService.products$.subscribe(res => this.salesItem = res)
    
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isCallQuotation = param.isCallQuotation;
      this.isRequisition = param.isRequisition;
      if (id && isCallQuotation) {
        this.isLoading = true;
        this.title = 'Edit Call Quotation'
        this.getCallQuotation(id);
      }

      if(id && this.isRequisition) {
        this.isLoading = true;
        this.getRequisition(id);
      }
    });

    //handling dueDate logic
    // this.quotationForm.get('invoiceDate').valueChanges.subscribe((value) => {
    //   this.minDate = new Date(value);
    //   this.dateCondition = this.quotationForm.get('dueDate').value < this.quotationForm.get('invoiceDate').value
    // })
  }


  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.table.renderRows();
  }

  //Add Call Quotation Lines
  addCallQuotationLineClick(): void {
    const controls = this.callQuotationForm.controls.callForQuotationLines as FormArray;
    controls.push(this.addCallQuotationLines());
    this.table.renderRows();
  }

  // Add Call Quotation Lines
  addCallQuotationLines(): FormGroup {
    return this.fb.group({
      itemId: [null , Validators.required],
      quantity: ['', [Validators.required,Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  //Remove Quotation Line
  removeCallQuotationLineClick(callQuotationLineIndex: number): void {
    const callQuotationLineArray = this.callQuotationForm.get('callForQuotationLines') as FormArray;
    callQuotationLineArray.removeAt(callQuotationLineIndex);
    callQuotationLineArray.markAsDirty();
    callQuotationLineArray.markAsTouched();
    this.table.renderRows();
  }

  private getRequisition(id: number) {
    this.requisitionService.getRequisitionById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.patchCallQuotation(res.result)
    });
  }

  
  //Get Quotation Data for Edit
  private getCallQuotation(id: number) {
    this.callQuotationService.getCallQuotationById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.callQuotationModel = res.result
      this.patchCallQuotation(this.callQuotationModel)
    });
  }

  //Patch Call Quotation Form through Call Quotation Or Requisition Master Data
  patchCallQuotation(data: ICallQuotation | IRequisition | any) {
    this.callQuotationForm.patchValue({
      vendorId: data.vendorId,
      callForQuotationDate: data.callForQuotationDate ?? data.requisitionDate,
      description: data.description
    });

    this.callQuotationForm.setControl('callForQuotationLines', this.patchCallQuotationLines(data.callForQuotationLines ?? data.requisitionLines))
  }

  //Patch Call Quotation Lines From Requisition Or Call Quotation Master Data
  patchCallQuotationLines(lines: ICallForQuotationLines[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: (this.isRequisition) ? 0 : line.id,
        itemId: [line.itemId ,[Validators.required]],
        quantity: [line.quantity , [Validators.required,Validators.min(1)]],
        description: [line.description , Validators.required]
      }))
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {

    if (this.callQuotationForm.get('callForQuotationLines').invalid) {
      this.callQuotationForm.get('callForQuotationLines').markAllAsTouched();
    }
    const controls = <FormArray>this.callQuotationForm.controls['callForQuotationLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add call quotation lines', 'Error')
      return;
    }
    
    if (this.callQuotationForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Call Quotation")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToCallQuotationModel();
    //console.log(this.quotationModel)
    if (this.callQuotationModel.id) {
      this.callQuotationService.updateCallQuotation(this.callQuotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<ICallQuotation>) => {
          this.toastService.success('Updated Successfully', 'Call Quotation')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + CALL_QUOTATION.ID_BASED_ROUTE('details', this.callQuotationModel.id)]);
        })
    } else {
      delete this.callQuotationModel.id;
      this.callQuotationService.createCallQuotation(this.callQuotationModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<ICallQuotation>) => {
            this.toastService.success('Created Successfully', 'Call Quotation')
            this.router.navigate(['/' + CALL_QUOTATION.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToCallQuotationModel() {
    this.callQuotationModel.vendorId = this.callQuotationForm.value.vendorId;
    this.callQuotationModel.callForQuotationDate = this.transformDate(this.callQuotationForm.value.callForQuotationDate, 'yyyy-MM-dd');
    this.callQuotationModel.description = this.callQuotationForm.value.description
    this.callQuotationModel.callForQuotationLines = this.callQuotationForm.value.callForQuotationLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.callQuotationModel.isSubmit = (val === 0) ? false : true;
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

