import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, IsRowMaster, ValueFormatterParams } from 'ag-grid-community';
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
  gridOptions: any;;

  public QUOTATION_COMP = QUOTATION_COMPARATIVE;

  quotationComparativeMaster: any

  //Loader
  isLoading: boolean;

  //need for routing
  quotationComparativeId: number;

  checkBoxSelection: boolean = false;

  quotationId: number;

  quotationList: any;

  public gridApi: GridApi

  constructor(
    private quotationComparativeService: QuotationComparativeService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }


 //Master Detail Work in AG Grid
  public isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem ? dataItem.quotationLines?.length > 0 : false;
  };

  public columnDefs: ColDef[] = [

    // group cell renderer needed for expand / collapse icons
    { headerName: 'Quotation #', 
      field: 'docNo', 
      cellRenderer: 'agGroupCellRenderer', 
      checkboxSelection: () => (this.checkBoxSelection),
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
    { headerName: 'Time Frame', field: 'timeframe', suppressHeaderMenuButton: true}
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
}

