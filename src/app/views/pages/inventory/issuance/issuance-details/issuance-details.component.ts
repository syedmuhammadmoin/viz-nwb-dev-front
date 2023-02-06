import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { finalize, take } from 'rxjs/operators';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ISSUANCE, ISSUANCE_RETURN, REQUISITION } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IIssuanceLines } from '../model/IssuanceLines';
import { IIssuance } from '../model/IIssuance';
import { IssuanceService } from '../service/issuance.service';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';


@Component({
  selector: 'kt-issuance-details',
  templateUrl: './issuance-details.component.html',
  styleUrls: ['./issuance-details.component.scss']
})

export class IssuanceDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public ISSUANCE = ISSUANCE;
  public ISSUANCE_RETURN = ISSUANCE_RETURN;
  public REQUISITION = REQUISITION;

  showReference: boolean = false;

  gridApi: any

  //Loader
  isLoading: boolean;

  //need for routing
  issuanceId: number;

  //Variables for Issuance data
  issuanceLines: IIssuanceLines | any
  issuanceMaster: IIssuance | any;

  //Showing Remarks
  remarksList: string[] = [];

  constructor(
    private issuanceService: IssuanceService,
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
      field: 'itemName', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return params.value || 'N/A'
      }
     },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { 
      headerName: 'Quantity', 
      field: 'quantity', 
      cellStyle: { 'font-size': '12px' }
     },
     {
      headerName: 'Returned', 
      field: 'receivedQuantity',  
      cellStyle: {'font-size': '12px'}
    },
    { 
      headerName: 'Store', 
      field: 'warehouseName', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return params.value || 'N/A'
      }
    }
  ];

  ngOnInit() {

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.issuanceId = id;
        this.isLoading = true;
        this.getIssuanceData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Issuance master data
  getIssuanceData(id: number) {
    this.issuanceService.getIssuanceById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IIssuance>) => {
      this.issuanceMaster = res.result;
      this.issuanceLines = res.result.issuanceLines;
      this.remarksList = this.issuanceMaster.remarksList ?? [] 

      //Checking grn status to show Requisition reference
      this.showReference = (["Draft" , "Rejected"].includes(this.issuanceMaster.status)) ? false : true;

      if([DocumentStatus.Draft , DocumentStatus.Rejected , DocumentStatus.Submitted].includes(this.issuanceMaster.state)) {
        this.gridOptions.columnApi.setColumnVisible('receivedQuantity', false);
      }
      else {
        this.gridOptions.columnApi.setColumnVisible('receivedQuantity', true);
        this.gridApi?.sizeColumnsToFit();
      }
      this.cdRef.detectChanges();
    });
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
    this.issuanceService.workflow({ action, docId: this.issuanceMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getIssuanceData(this.issuanceId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Issuance');
      })
  }
}



