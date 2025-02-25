import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { QUOTATION_COMPARATIVE } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IQuotationComparative } from '../model/IQuotationComparative';
import { QuotationComparativeService } from '../service/quotation-comparative.service';
import { ColDef, GridApi, GridReadyEvent, IsRowMaster , ICellRendererParams, ValueFormatterParams} from 'ag-grid-community';
import { QuotationService } from '../../quotation/service/quotation.service';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'kt-create-quotation-comparative',
  templateUrl: './create-quotation-comparative.component.html',
  styleUrls: ['./create-quotation-comparative.component.scss']
})
export class CreateQuotationComparativeComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  quotationComparativeForm: FormGroup;

  // Quotation Model
  quotationComparativeModel: IQuotationComparative;

  //taking in string because send in query params
  quotationCompId: any = '';

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  quotationList: any = []

  title: string = 'Create Quotation Comparative'

  public gridApi: GridApi

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    requisitionId: {
      required: 'Requisition No is required.',
    },
    quotationComparativeDate: {
      required: 'Date is required.',
    }
  };

  // error keys..
  formErrors: any = {
    requisitionId: '',
    quotationComparativeDate: ''
  };


  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private quotationComparativeService: QuotationComparativeService,
    private quotationService: QuotationService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }


  public isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem ? dataItem.quotationLines?.length > 0 : false;
  };

  public columnDefs: ColDef[] = [

    // group cell renderer needed for expand / collapse icons
    { headerName: 'Quotation #',
      field: 'docNo',
      cellRenderer: 'agGroupCellRenderer',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressHeaderMenuButton: true
    },
    { headerName: 'Vendor', field: 'vendorName' , suppressHeaderMenuButton: true},
    {
      headerName: 'Quotation Date',
      field: 'quotationDate' ,
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.dateHelperService.transformDate(params.value, 'MMM d, y')
      }
    },
    { headerName: 'Time Frame', field: 'timeframe', suppressHeaderMenuButton: true},
  ];

  public defaultColDef: ColDef = {
    flex: 1,
  };
  public detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        { headerName: 'Item', field: 'itemName', suppressHeaderMenuButton: true },
        { headerName: 'Description', field: 'description', suppressHeaderMenuButton: true },
        { headerName: 'Quantity', field: 'quantity', minWidth: 150 , suppressHeaderMenuButton: true},
        { headerName: 'Price',
        field: 'price',
        suppressHeaderMenuButton: true,
        valueFormatter: (params: ValueFormatterParams) => {
          return this.valueFormatter(params.value)
        }
      },

      ],
      angularCompileRows: false,
      defaultColDef: {
        flex: 1,
      },
    },
    getDetailRowData: function (params) {
      params.successCallback(params.data.quotationLines);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  ngOnInit() {
    //Creating Form
    this.quotationComparativeForm = this.fb.group({
      requisitionId: ['', [Validators.required]],
      quotationComparativeDate: ['', [Validators.required]],
      //remarks: ['', [Validators.required]]
    });

    //Initializing empty model
    this.quotationComparativeModel = {
      id: null,
      requisitionId: null,
      quotationComparativeDate: '',
      //remarks: '',
      quotationComparativeLines: []
    }

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      const isQuotationComparative = param.isQuotationComparative;

      if (id && isQuotationComparative) {
        this.isLoading = true;
        this.title = 'Edit Quotation Comparative'
        this.quotationCompId = +id
        this.getQuotationComparative(id);
      }
    });

    //get requisitions from store
    this.ngxsService.getRequisitionFromState()
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.quotationList = [];
  }

  //Get Quotation Data for Edit
  private getQuotationComparative(id: number) {
    this.quotationComparativeService.getQuotationComparativeById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.quotationComparativeModel = res.result
      this.patchQuotationComparative(this.quotationComparativeModel)
    });
  }

  //Patch Quotation Comparative Form through Quotation Comparative Master Data
  async patchQuotationComparative(data: any ) {
    this.quotationComparativeForm.patchValue({
      requisitionId: data.requisitionId,
      quotationComparativeDate: data.quotationComparativeDate,
      remarks: data.remarks
    });

    await this.getQuotations(data.requisitionId);
    this.patchQuotationComparativeLines(data.quotations);
  }

  //Patch Quotation Comparative Lines Quotation Comparative Master Data
  patchQuotationComparativeLines(quotations: any) {
    this.gridApi.forEachNode(node => {
      const isSelect = quotations.some((x: any) => x.id === node.data.id);

      if(isSelect){
        node.setSelected(true)
      }
    })
  }

  //Submit Form Function
  onSubmit(): void {

    if(this.gridApi?.getSelectedRows().length < 3) {
      this.toastService.error('Select at least 3 Quotations.', 'Quotation Comparative')
      return;
    }

    if (this.quotationComparativeForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToQuotationComparativeModel();
    if (this.quotationComparativeModel.id) {
      this.quotationComparativeService.updateQuotationComparative(this.quotationComparativeModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IQuotationComparative>) => {
          this.toastService.success('Updated Successfully', 'Quotation Comparative')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + QUOTATION_COMPARATIVE.ID_BASED_ROUTE('details', this.quotationComparativeModel.id)]);
        })
    } else {
      delete this.quotationComparativeModel.id;
      this.quotationComparativeService.createQuotationComparative(this.quotationComparativeModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IQuotationComparative>) => {
            this.toastService.success('Created Successfully', 'Quotation Comparative')
            this.router.navigate(['/' + QUOTATION_COMPARATIVE.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToQuotationComparativeModel() {
    this.quotationComparativeModel.requisitionId = this.quotationComparativeForm.value.requisitionId;
    this.quotationComparativeModel.quotationComparativeDate = this.transformDate(this.quotationComparativeForm.value.quotationComparativeDate, 'yyyy-MM-dd');
    this.quotationComparativeModel.quotationComparativeLines = [];
    this.quotationList.forEach((res: any) => {
      const val = this.gridApi?.getSelectedRows().includes(res);
      this.quotationComparativeModel.quotationComparativeLines.push({ quotationId: res.id , isSelected: ((val) ? true : false)})
    })
  }

  //Get Quotations by requisition Id
  async getQuotations(reqId: number): Promise<IApiResponse<any[]>> {
    this.isLoading = true;
    const res = await firstValueFrom(this.quotationService.getQuotatationByReqId({RequisitionId: reqId , quotationCompId: this.quotationCompId}));
    this.quotationList = res.result;
    this.isLoading = false;
    this.cdRef.detectChanges()
    return res.result
  }

  //for save or submit
  isSubmit(val: number) {
    this.quotationComparativeModel.isSubmit = (val === 0) ? false : true;
  }
}
