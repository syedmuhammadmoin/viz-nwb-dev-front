import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { REQUISITION } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IRequisitionLines } from '../model/IRequisitionLines';
import { IRequisition } from '../model/IRequisition';
import { RequisitionService } from '../service/requisition.service';

@Component({
  selector: 'kt-requisition-details',
  templateUrl: './requisition-details.component.html',
  styleUrls: ['./requisition-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RequisitionDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public REQUISITION = REQUISITION;

  requisitionId: number;

  //kt busy loading
  isLoading: boolean;

  //Variables for Requisition data
  requisitionLines: IRequisitionLines | any
  requisitionMaster: IRequisition | any;
  status: string;

  constructor(
    private requisitionService: RequisitionService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining columns for ag grid
  columnDefs = [
    { headerName: 'Item', field: 'item', sortable: true, filter: true, cellStyle: { 'font-size': '12px' }},
    { headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' }},
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: { 'font-size': '12px' }},
    { 
      headerName: 'Warehouse', 
      field: 'warehouse', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    }
  ];

  ngOnInit() {

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.requisitionId = id;
        this.getRequisitionData(id);
        this.cdr.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting invoice master data
  getRequisitionData(id: number) {
    this.requisitionService.getRequisitionById(id).subscribe((res: IApiResponse<IRequisition>) => {
      this.requisitionMaster = res.result;
      this.requisitionLines = res.result.requisitionLines;
      this.status = this.requisitionMaster.status;

      this.cdr.detectChanges();
    }, (err: any) => console.log(err));
  }

  workflow(action: number) {
    this.isLoading = true
    this.requisitionService.workflow({ action, docId: this.requisitionMaster.id })
      .subscribe((res) => {
        this.getRequisitionData(this.requisitionId);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.success('' + res.message, 'Requisition');
      }, (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastService.error('' + err.error.message, 'Requisition')
      })
  }
}

