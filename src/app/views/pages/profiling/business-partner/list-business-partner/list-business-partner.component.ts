import {NgxsCustomService} from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  RowDoubleClickedEvent
} from 'ag-grid-community';
import {MatDialog} from '@angular/material/dialog'
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {CreateBusinessPartnerComponent} from '../create-business-partner/create-business-partner.component';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {IBusinessPartner} from '../model/IBusinessPartner';
import {IPaginationResponse} from 'src/app/views/shared/IPaginationResponse';
import {BusinessPartnerType, Permissions} from 'src/app/views/shared/AppEnum';
import {isEmpty} from 'lodash';
import {APP_ROUTES} from 'src/app/views/shared/AppRoutes';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-business-partner',
  templateUrl: './list-business-partner.component.html',
  styleUrls: ['./list-business-partner.component.scss']
})

export class ListBusinessPartnerComponent extends AppComponentBase implements OnInit {

  businessPartnerList: IBusinessPartner[];
  
  gridOptions: any;
  defaultColDef: ColDef;
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    public dialog: MatDialog,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: {componentParent: this}
      }
    );
  }

  //Defining Business Partner Columns
  columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      tooltipField: 'name',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Business Partner Type',
      field: 'businessPartnerType',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      cellRenderer: (params: ICellRendererParams) => {
        return BusinessPartnerType[params.value]
      }
    },
    {
      headerName: 'Phone Number',
      field: 'phone',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value : 'N/A'
      }
    },

    {
      headerName: 'Bank Account Title',
      field: 'bankAccountTitle',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value : 'N/A'
      }
    },
    {
      headerName: 'Bank Account Number',
      field: 'bankAccountNumber',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value : 'N/A'
      }
    },
  ];

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: 'double click to edit',
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
    }

    this.components = {
      customTooltip: CustomTooltipComponent,
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if (!this.permission.isGranted(this.permissions.BUSINESSPARTNER_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateBusinessPartnerComponent, {
      width: '800px',
      data: id
    });
    // Recalling getBusinessPartners function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getBusinessPartners(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'businessPartnerPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getBusinessPartners(params: any): Promise<IPaginationResponse<IBusinessPartner[]>> {
    const result = await firstValueFrom(this.ngxsService.businessPartnerService.getRecords(params));
    return result
  }

  printBusinessPartner() {
    this.router.navigate(['/' + APP_ROUTES.BUSINESS_PARTNER + '/print/?']);
  }
}
