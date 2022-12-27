import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { QUOTATION } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { RequisitionService } from '../../requisition/service/requisition.service';
import { IRequisition } from '../../requisition/model/IRequisition';
import { IQuotationComparative } from '../model/IQuotationComparative';
import { QuotationComparativeService } from '../service/quotation-comparative.service';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, IsRowMaster , DetailGridInfo} from 'ag-grid-community';
import { QuotationService } from '../../quotation/service/quotation.service';







@Component({
  selector: 'kt-create-quotation-comparative',
  templateUrl: './create-quotation-comparative.component.html',
  styleUrls: ['./create-quotation-comparative.component.scss']
})
export class CreateQuotationComparativeComponent extends AppComponentBase implements OnInit {


  public rowData = 
    [
      {
          "id": 1,
          "name": "Nora Thomas",
          "account": 177000,
          "calls": 0,
          "minutes": 0,
          "callRecords": []
      },
      {
          "id": 2,
          "name": "Mila Smith",
          "account": 177001,
          "calls": 24,
          "minutes": 26.216666666666665,
          "callRecords": [
              {
                  "name": "susan",
                  "callId": 579,
                  "duration": 23,
                  "switchCode": "SW5",
                  "direction": "Out",
                  "number": "(02) 47485405"
              },
              {
                  "name": "susan",
                  "callId": 580,
                  "duration": 52,
                  "switchCode": "SW3",
                  "direction": "In",
                  "number": "(02) 32367069"
              }
          ]
      },
      {
          "id": 3,
          "name": "Evelyn Taylor",
          "account": 177002,
          "calls": 25,
          "minutes": 30.633333333333333,
          "callRecords": [
              {
                  "name": "susan",
                  "callId": 603,
                  "duration": 80,
                  "switchCode": "SW8",
                  "direction": "Out",
                  "number": "(05) 35713044"
              },
              {
                  "name": "susan",
                  "callId": 604,
                  "duration": 33,
                  "switchCode": "SW2",
                  "direction": "Out",
                  "number": "(01) 66861341"
              }
          ]
      },
      {
          "id": 4,
          "name": "Harper Johnson",
          "account": 177003,
          "calls": 0,
          "minutes": 0,
          "callRecords": []
      },
      {
          "id": 5,
          "name": "Addison Wilson",
          "account": 177004,
          "calls": 23,
          "minutes": 24.4,
          "callRecords": [
              {
                  "name": "susan",
                  "callId": 652,
                  "duration": 32,
                  "switchCode": "SW9",
                  "direction": "Out",
                  "number": "(04) 77524120"
              },
              {
                  "name": "susan",
                  "callId": 653,
                  "duration": 44,
                  "switchCode": "SW3",
                  "direction": "Out",
                  "number": "(06) 477252"
              }
          ]
      }
  ]

  

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  quotationComparativeForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'price', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Quotation Model
  quotationComparativeModel: IQuotationComparative;

  // For DropDown
  salesItem: IProduct[];

  //sales Order Data
  salesOrderMaster: any;

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

  //payment
  subscription1$: Subscription
  //sales Order
  subscription2$: Subscription

  title: string = 'Create Quotation Comparative'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    requisitionId: {
      required: 'Requisition No is required.',
    },
    quotationComparativeDate: {
      required: 'Date is required.',
    },
    remarks: {
      required: 'Remarks is required.',
    },
    // contact: {
    //   required: 'Contact Name is required.',
    // }
  };

  // error keys..
  formErrors = {
    requisitionId: '',
    quotationComparativeDate: '',
    remarks: '',
  };




















  public gridApi: GridApi


  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private quotationComparativeService: QuotationComparativeService,
    private quotationService: QuotationService,
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

  public isRowMaster: IsRowMaster = (dataItem: any) => {
    console.log(dataItem)
    return dataItem ? dataItem.callRecords?.length > 0 : false;
  };
  public columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    { headerName: 'the',field: 'name', cellRenderer: 'agGroupCellRenderer', 
    headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressMenu: true
  },
    { field: 'account' , suppressMenu: true},
    { field: 'calls' , suppressMenu: true},
    { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" , suppressMenu: true},
  ];
  public defaultColDef: ColDef = {
    flex: 1,
  };
  public detailCellRendererParams: any = {
    detailGridOptions: {


      columnDefs: [
        { field: 'callId', suppressMenu: true },
        { field: 'direction', suppressMenu: true },
        { field: 'number', minWidth: 150 , suppressMenu: true},
        { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" , suppressMenu: true},
        { field: 'switchCode', minWidth: 150 , suppressMenu: true},
      ],
      angularCompileRows: false,
      defaultColDef: {
        flex: 1,
      },
    },
    getDetailRowData: function (params) {
      console.log(params)
      params.successCallback(params.data.callRecords);
    },
  
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  















































  ngOnInit() {

    // Creating Forms
    this.quotationComparativeForm = this.fb.group({
      requisitionId: ['', [Validators.required]],
      quotationComparativeDate: ['', [Validators.required]],
      remarks: ['', [Validators.required]]
    });

    this.quotationComparativeModel = {
      id: null,
      requisitionId: null,
      quotationComparativeDate: '',
      remarks: '',
      quotationIds: []
    }
    
    this.ngxsService.getCampusFromState()
    
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isQuotationComparative = param.isQuotationComparative;

      if (id && isQuotationComparative) {
        this.isLoading = true;
        this.title = 'Edit Quotation Comparative'
        this.getQuotationComparative(id);
      }
    });

    //get requisitions from store
    this.ngxsService.getRequisitionFromState()
  }

  // Form Reset
  reset() {
    // const invoiceLineArray = this.invoiceForm.get('quotationLines') as FormArray;
    // invoiceLineArray.clear();
    this.formDirective.resetForm();
    this.showMessage = false;
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
      this.quotationComparativeModel = res.result
      this.patchQuotationComparative(this.quotationComparativeModel)
    });
  }

  //Get Quotation Data for Edit
  private getQuotationComparative(id: number) {
    // this.quotationComparativeService.getQuotationComparativeById(id)
    // .pipe(
    //   take(1),
    //    finalize(() => {
    //     this.isLoading = false;
    //     this.cdRef.detectChanges();
    //    })
    //  )
    // .subscribe((res) => {
    //   if (!res) return
    //   this.quotationComparativeModel = res.result
    //   this.patchQuotationComparative(this.quotationComparativeModel)
    // });
  }

  //Patch Quotation Form through Quotation Or sales Order Master Data
  
  patchQuotationComparative(data: any ) {
    this.quotationComparativeForm.patchValue({
      requisitionId: data.requisitionId ?? data.employeeId,
      quotationComparativeDate: data.quotationComparativeDate ?? data.requisitionDate,
      remarks: data.remarks
    });


    //this.onCampusSelected(data.requisitionId)
    this.showMessage = true;

    this.quotationComparativeForm.setControl('quotationLines', this.patchQuotationComparativeLines(data.quotationLines ?? data.requisitionLines))
    //this.totalCalculation();
  }

  //Patch Quotation Comparative Lines Quotation Comparative Master Data
  patchQuotationComparativeLines(lines: any): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemId: [line.itemId],
        description: [line.description , Validators.required],
        price: [line.price , [Validators.required, Validators.min(1)]],
        quantity: [line.quantity , [Validators.required,Validators.min(1)]]
      }))
    })
    return formArray
  }

  //Submit Form Function
  onSubmit(): void {
    console.log('Yes')
    console.log(this.gridApi?.getSelectedRows())
    // if (this.quotationComparativeForm.get('quotationLines').invalid) {
    //   this.quotationComparativeForm.get('quotationLines').markAllAsTouched();
    // }
    // const controls = <FormArray>this.quotationComparativeForm.controls['quotationLines'];
    // if (controls.length == 0) {
    //   this.toastService.error('Please add quotation lines', 'Error')
    //   return;
    // }
    
    // if (this.quotationComparativeForm.invalid) {
    //   this.toastService.error("Please fill all required fields!", "Quotation")
    //   return;
    // }

    // this.isLoading = true;
    // this.mapFormValuesToQuotationComparativeModel();
    // console.log(this.quotationComparativeModel)
    // if (this.quotationComparativeModel.id) {
    //   this.quotationComparativeService.updateQuotationComparative(this.quotationComparativeModel)
    //   .pipe(
    //     take(1),
    //      finalize(() => {
    //       this.isLoading = false;
    //       this.cdRef.detectChanges();
    //      })
    //    )
    //     .subscribe((res: IApiResponse<IQuotationComparative>) => {
    //       this.toastService.success('Updated Successfully', 'Quotation')
    //       this.cdRef.detectChanges();
    //       this.router.navigate(['/' + QUOTATION.ID_BASED_ROUTE('details', this.quotationComparativeModel.id)]);
    //     })
    // } else {
    //   delete this.quotationComparativeModel.id;
    //   this.quotationComparativeService.updateQuotationComparative(this.quotationComparativeModel)
    //   .pipe(
    //     take(1),
    //      finalize(() => {
    //       this.isLoading = false;
    //       this.cdRef.detectChanges();
    //      })
    //    )
    //     .subscribe((res: IApiResponse<IQuotationComparative>) => {
    //         this.toastService.success('Created Successfully', 'Quotation')
    //         this.router.navigate(['/' + QUOTATION.ID_BASED_ROUTE('details', res.result.id)]);
    //       });
    // }
  }

  // Mapping value to model
  mapFormValuesToQuotationComparativeModel() {
    this.quotationComparativeModel.requisitionId = this.quotationComparativeForm.value.requisitionId;
    this.quotationComparativeModel.quotationComparativeDate = this.transformDate(this.quotationComparativeForm.value.quotationComparativeDate, 'yyyy-MM-dd');
    this.quotationComparativeModel.remarks = this.quotationComparativeForm.value.remarks;
    this.quotationComparativeModel.quotationIds = this.quotationComparativeForm.value.quotationIds;
  }

  getQuotation(id: number) {
    this.quotationService.getQuotatationByReqId(id).subscribe(res => {
      console.log(res)
    }) 
  }

  //for save or submit
  isSubmit(val: number) {
    this.quotationComparativeModel.isSubmit = (val === 0) ? false : true;
  }
}




