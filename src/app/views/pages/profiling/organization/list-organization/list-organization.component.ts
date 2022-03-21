import { NgxsCustomService } from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/Dialog'
import { CreateOrganizationComponent } from '../create-organization/create-organization.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IOrganization } from '../model/IOrganization';

@Component({
  selector: 'kt-list-organization',
  templateUrl: './list-organization.component.html',
  styleUrls: ['./list-organization.component.scss'],
  providers:[NgxsCustomService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListOrganizationComponent extends AppComponentBase implements OnInit {

  organizationList : IOrganization[];
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  frameworkComponents : { [p: string]: unknown }
  tooltipData : string = "double click to edit"

  constructor(
               public dialog: MatDialog,
               private cdRef: ChangeDetectorRef,
               public ngxsService:NgxsCustomService,
               injector : Injector
             ) {
                  super(injector)
                  this.gridOptions = <GridOptions>(
                  {
                    context : { componentParent : this }
                  }
                 );
               }

  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name'},
    { headerName: 'Country', field: 'country', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Contact', field: 'phone', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Industry', field: 'industry', sortable: true, filter: true, tooltipField: 'name' },
    // { headerName: 'Description', field: 'description', sortable: true, filter: true, tooltipField: 'name' },
    // { headerName: 'Email', field: 'email', sortable: true, filter: true, tooltipField: 'name' },
    // { headerName: 'Website', field: 'website', sortable: true, filter: true, tooltipField: 'name' },
    // { headerName: 'Legal Status', field: 'legalStatus', sortable: true, filter: true, tooltipField: 'name' },
    // { headerName: 'Income Tax Id', field: 'incomeTaxId', sortable: true, filter: true, tooltipField: 'name' },
    // { headerName: 'sales Tax Id', field: 'salesTaxId', sortable: true, filter: true, tooltipField: 'name' },
    {
      headerName: 'Start Date',
      field: 'startDate',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.startDate != null ? params.data.startDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.endDate != null ? params.data.endDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
  ];


  ngOnInit() {
    this.getOrganizations()

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateOrganizationComponent, {
      width: '800px',
      data: id
    });
    // Recalling getOrganization function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getOrganizations()
    });
  }

  getOrganizations() : void {
    this.ngxsService.organizationService.getOrganizations().subscribe((res: IPaginationResponse<IOrganization[]>) => {
       this.organizationList = res.result;
       this.cdRef.detectChanges()
    })
  }
}





