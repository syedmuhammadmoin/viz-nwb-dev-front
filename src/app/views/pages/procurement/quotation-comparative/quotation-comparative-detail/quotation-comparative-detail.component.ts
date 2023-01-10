import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, IsRowMaster } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { QUOTATION_COMPARATIVE } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { QuotationComparativeService } from '../service/quotation-comparative.service';
import { IQuotationComparative } from '../model/IQuotationComparative';
import { AwardVendorComponent } from '../award-vendor/award-vendor.component';
import { isEmpty } from 'lodash';


@Component({
  selector: 'kt-quotation-comparative-detail',
  templateUrl: './quotation-comparative-detail.component.html',
  styleUrls: ['./quotation-comparative-detail.component.scss']
})

export class QuotationComparativeDetailComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;

  public QUOTATION_COMP = QUOTATION_COMPARATIVE;

  quotationComparativeMaster: any

  //handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  quotationComparativeId: number;

  checkBoxSelection: boolean = false;

  quotationId: number;

  status: boolean = false;

  quotationList: any;

  loader: boolean = true;

  public gridApi: GridApi
 
  //Showing Remarks
  //remarksList: string[] = [];

  constructor(
    private quotationComparativeService: QuotationComparativeService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }



  public isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem ? dataItem.quotationLines?.length > 0 : false;
  };
  public columnDefs: ColDef[] = [

    // group cell renderer needed for expand / collapse icons
    { headerName: 'Quotation #', 
      field: 'docNo', 
      cellRenderer: 'agGroupCellRenderer', 
      //headerCheckboxSelection: this.value,
      // checkboxSelection: (params) => {
      //   console.log(params)
      //   return false
      // },
      checkboxSelection: () => (this.checkBoxSelection),
      suppressMenu: true
    },
    { headerName: 'Vendor', field: 'vendorName' , suppressMenu: true},
    { 
      headerName: 'Quotation Date', 
      field: 'quotationDate' , 
      suppressMenu: true,
      valueFormatter: (params: ICellRendererParams) => {
        return this.dateHelperService.transformDate(params.value, 'MMM d, y')
      }
    },
    { headerName: 'Time Frame', field: 'timeframe', suppressMenu: true}
  ];

  public defaultColDef: ColDef = {
    flex: 1,
  };
  public detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        { headerName: 'Item', field: 'itemName', suppressMenu: true },
        { headerName: 'Description', field: 'description', suppressMenu: true },
        { headerName: 'Quantity', field: 'quantity', minWidth: 150 , suppressMenu: true},
        { headerName: 'Price', 
        field: 'price', 
        suppressMenu: true,
        valueFormatter: (params: ICellRendererParams) => {
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
   
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.quotationComparativeId = id;
        this.isLoading = true;
        this.getQuotationComparativeData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions = {
      rowClassRules: {
        "selected-row": (params) => (params.data.state === 4)
      }
    }
  }

  //First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting quotation master data
  getQuotationComparativeData(id: number) {
    this.quotationComparativeService.getQuotationComparativeById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IQuotationComparative | any>) => {

      this.quotationComparativeMaster = res.result;
      this.quotationList = res.result.quotations;
      this.checkBoxSelection = (res.result.state === 5) ? true : false;

      this.status = (res.result.state === DocumentStatus.Submitted) ? true : false; 

      console.log(this.status)

      this.cdRef.detectChanges();
    });
  }

  openDialog(): void {

    if(isEmpty(this.gridApi.getSelectedRows())){
      this.toastService.warning('Please Select Vendor.', 'Warning') 
      return; 
    }
    
    const dialogRef = this.dialog.open(AwardVendorComponent, {
      width: '800px',
      data: {
        id: this.quotationComparativeId,
        quotationId: this.gridApi.getSelectedRows()[0].id,
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getQuotationComparativeData(this.quotationComparativeId);
      this.cdRef.detectChanges();
    });
  }

  //Get Remarks From User
  // remarksDialog(action: any): void {
  //   const dialogRef = this.dialog.open(CustomRemarksComponent, {
  //     width: '740px'
  //   });
  //   //sending remarks data after dialog closed
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       this.workflow(action, res.data)
  //     }
  //   })
  // }

  // workflow(action: number , remarks: string) {
  //   this.isLoading = true
  //   this.quotationService.workflow({ action, docId: this.quotationMaster.id , remarks })
  //   .pipe(
  //     take(1),
  //      finalize(() => {
  //       this.isLoading = false;
  //       this.cdRef.detectChanges();
  //      })
  //    )
  //     .subscribe((res) => {
  //       this.getQuotationComparativeData(this.quotationId);
  //       this.cdRef.detectChanges();
  //       this.toastService.success('' + res.message, 'Quotation');
  //     })
  // }

  //upload File
  // openFileUploadDialog() {
  //   this.dialog.open(CustomUploadFileComponent, {
  //     width: '740px',
  //     data: {
  //       response: this.quotationMaster,
  //       serviceClass: this.quotationService,
  //       functionName: 'uploadFile',
  //       name: 'Quotation'
  //     },
  //   }).afterClosed().subscribe(() => {
  //     this.getQuotationComparativeData(this.quotationId)
  //     this.cdRef.detectChanges()
  //   })
  // }
}

