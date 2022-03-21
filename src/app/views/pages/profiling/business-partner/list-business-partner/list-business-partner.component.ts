import { NgxsCustomService } from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent} from 'ag-grid-community';
import { MatDialog} from '@angular/material/Dialog'
import { CustomTooltipComponent} from "src/app/views/shared/components/custom-tooltip/custom-tooltip.component";
import { CreateBusinessPartnerComponent } from '../create-business-partner/create-business-partner.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IBusinessPartner } from '../model/IBusinessPartner';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { BusinessPartnerType } from 'src/app/views/shared/AppEnum';


@Component({
  selector: 'kt-list-business-partner',
  templateUrl: './list-business-partner.component.html',
  styleUrls: ['./list-business-partner.component.scss'],
  providers: [NgxsCustomService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListBusinessPartnerComponent extends AppComponentBase implements OnInit {

  businessPartnerList : IBusinessPartner[];
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"

  constructor(
               public dialog: MatDialog,
               public ngxsService:NgxsCustomService,
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) { super(injector);
                 this.gridOptions = <GridOptions>(
                   {
                     context : { componentParent : this }
                   }
                 );
               }

  columnDefs = [
    {headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Entity', field: 'entity', sortable: true, filter: true , tooltipField: 'name'},
    {
      headerName: 'Type',
      field: 'businessPartnerType',
      sortable: true,
      filter: true ,
      tooltipField: 'name',
      cellRenderer: (params: ICellRendererParams) => {
        return BusinessPartnerType[params.value]
      }
    },
    {headerName: 'Phone No', field: 'phone', sortable: true, filter: true ,tooltipField: 'name',
    cellRenderer: (params: ICellRendererParams) => {
      return params.value ? params.value  : "N/A"}},

    {headerName: 'Bank Account Title', field: 'bankAccountTitle', sortable: true, filter: true, tooltipField: 'name',
    cellRenderer: (params: ICellRendererParams) => {
      return params.value ? params.value  : "N/A"} },
    {headerName: 'Bank Account Number', field: 'bankAccountNumber', sortable: true, filter: true, tooltipField: 'name',
    cellRenderer: (params: ICellRendererParams) => {
      return params.value ? params.value  : "N/A"}},
    // {headerName: 'Address', field: 'address', sortable: true, filter: true ,tooltipField: 'name'},
    // {headerName: 'Mobile No', field: 'mobile', sortable: true, filter: true,tooltipField: 'name'},
    // {headerName: 'Email', field: 'email', sortable: true, filter: true, tooltipField: 'name'},
    // {headerName: 'Website', field: 'website', sortable: true, filter: true , tooltipField: 'name'},
    // {headerName: 'Income Tax Id', field: 'incomeTaxId', sortable: true, filter: true, tooltipField: 'name'},
    // {headerName: 'sales Tax Id', field: 'salesTaxId', sortable: true, filter: true, tooltipField: 'name'},
  ];

  ngOnInit() {

    this.getBusinessPartners()

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  }

  onFirstDataRendered(params : FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateBusinessPartnerComponent, {
      width: '800px',
      data: id
    });
    // Recalling getBusinessPartners function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getBusinessPartners()
    });
  }

  getBusinessPartners() : void {
    this.ngxsService.businessPartnerService.getBusinessPartners().subscribe((res: IPaginationResponse<IBusinessPartner[]>) => {
      this.businessPartnerList = res.result;
      this.cdRef.detectChanges();
    })
  }
}
