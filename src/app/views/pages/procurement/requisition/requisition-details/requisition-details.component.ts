import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BID_EVALUATION, CALL_QUOTATION, ISSUANCE, PURCHASE_ORDER, QUOTATION, REQUEST_REQUISITION, REQUISITION } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IRequisitionLines } from '../model/IRequisitionLines';
import { IRequisition } from '../model/IRequisition';
import { RequisitionService } from '../service/requisition.service';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { AppConst } from 'src/app/views/shared/AppConst';


@Component({
  selector: 'kt-requisition-details',
  templateUrl: './requisition-details.component.html',
  styleUrls: ['./requisition-details.component.scss']
})

export class RequisitionDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: any;
  defaultColDef: ColDef;

  public REQUISITION = REQUISITION;
  public ISSUANCE = ISSUANCE
  public REQUEST = REQUEST_REQUISITION
  public PURCHASE_ORDER = PURCHASE_ORDER
  public BIDEVALUATION = BID_EVALUATION
  public QUOTATION = QUOTATION
  public CALL_QUOTATION = CALL_QUOTATION

  requisitionId: number;

  //Loader
  isLoading: boolean;

  gridApi: any

  //Variables for Requisition data
  requisitionLines: IRequisitionLines | any
  requisitionMaster: IRequisition | any;
  status: string;

  //Showing Remarks
  remarksList: string[] = [];

  constructor(
    private requisitionService: RequisitionService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  //Defining Requisition Columns
  columnDefs = [
    { 
      headerName: 'Item', 
      field: 'item', 
      cellStyle: { 'font-size': '12px' }
    },
    { 
      headerName: 'Description', 
      field: 'description', 
      cellStyle: { 'font-size': '12px' }
    },
    { 
      headerName: 'Quantity', 
      field: 'quantity', 
      cellStyle: { 'font-size': '12px' }
    },
    { 
      headerName: 'Reserve Quantity', 
      field: 'reserveQuantity', 
      cellStyle: { 'font-size': '12px' }
    },
    { 
      headerName: 'Issued Quantity', 
      field: 'issuedQuantity', 
      cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Price', 
      field: 'purchasePrice',  
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Subtotal', 
      field: 'subTotal',  
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Store', 
      field: 'warehouse',  
      cellStyle: {'font-size': '12px'}
    }
  ];
  public currentClient : any ={};
  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.requisitionId = id;
        this.getRequisitionData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    this.gridApi = params.api
   // params.api.sizeColumnsToFit();
  }

  //Getting Requisition Master Data
  getRequisitionData(id: number) {
    this.requisitionService.getRequisitionById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IRequisition>) => {
      this.requisitionMaster = res.result;
      this.requisitionLines = res.result.requisitionLines;
      this.status = this.requisitionMaster.status;
      this.remarksList = this.requisitionMaster.remarksList ?? [] 

      if([DocumentStatus.Draft , DocumentStatus.Rejected , DocumentStatus.Submitted].includes(this.requisitionMaster.state)) {
        this.gridOptions.columnApi.setColumnVisible('issuedQuantity', false);
      }
      else {
        this.gridOptions.columnApi.setColumnVisible('issuedQuantity', true);
        //this.gridApi?.sizeColumnsToFit();
      }
      this.cdRef.detectChanges()
    })
  }

  //Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    //sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.requisitionService.workflow({ action, docId: this.requisitionMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getRequisitionData(this.requisitionId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Requisition');
      })
  }
}

