import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { REQUISITION } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { IRequestRequisitionLines } from '../model/IRequestRequisitionLine';
import { IRequestRequisition } from '../model/IRequestRequisition';
import { RequestRequisitionService } from '../service/request-requisition.service';


@Component({
  selector: 'kt-request-requisition-details',
  templateUrl: './request-requisition-details.component.html',
  styleUrls: ['./request-requisition-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestRequisitionDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public REQUISITION = REQUISITION;

  requestRequisitionId: number;

  //kt busy loading
  isLoading: boolean;

  gridApi: any

  //Variables for Request Requisition data
  requestRequisitionLines: IRequestRequisitionLines | any
  requestRequisitionMaster: IRequestRequisition | any;
  status: string;

  //Showing Remarks
  remarksList: string[] = [];

  constructor(
    private requestRequisitionService: RequestRequisitionService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining columns for ag grid
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
      headerName: 'Issued', 
      field: 'issuedQuantity',  
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 0
      }
    },
    // { 
    //   headerName: 'Store', 
    //   field: 'warehouse', 
    //   cellStyle: { 'font-size': '12px' },
    //   valueFormatter: (params: ValueFormatterParams) => {
    //     return params.value || 'N/A'
    //   }
    // }
  ];

  ngOnInit() {

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.requestRequisitionId = id;
        this.getRequestRequisitionData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    this.gridApi = params.api
    params.api.sizeColumnsToFit();
  }

  //Getting Request Requisition Data
  getRequestRequisitionData(id: number) {
    this.requestRequisitionService.getRequestRequisitionById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IRequestRequisition>) => {
      this.requestRequisitionMaster = res.result;
      this.requestRequisitionLines = res.result.requestRequisitionLines;
      this.status = this.requestRequisitionMaster.status;
      this.remarksList = this.requestRequisitionMaster.remarksList ?? [] 

      if([DocumentStatus.Draft , DocumentStatus.Rejected , DocumentStatus.Submitted].includes(this.requestRequisitionMaster.state)) {
        this.gridOptions.columnApi.setColumnVisible('issuedQuantity', false);
      }
      else {
        this.gridOptions.columnApi.setColumnVisible('issuedQuantity', true);
        console.log("entered")
        this.gridApi?.sizeColumnsToFit();
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
    this.requestRequisitionService.workflow({ action, docId: this.requestRequisitionMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getRequestRequisitionData(this.requestRequisitionId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Request Requisition');
      })
  }

  //upload File
  // openFileUploadDialog() {
  //   this.dialog.open(CustomUploadFileComponent, {
  //     width: '740px',
  //     data: {
  //       response: this.requisitionMaster,
  //       serviceClass: this.requisitionService,
  //       functionName: 'uploadFile',
  //       name: 'Requisition'
  //     },
  //   }).afterClosed().subscribe(() => {
  //     this.getRequisitionData(this.requisitionId)
  //     this.cdRef.detectChanges()
  //   })
  // }
}

