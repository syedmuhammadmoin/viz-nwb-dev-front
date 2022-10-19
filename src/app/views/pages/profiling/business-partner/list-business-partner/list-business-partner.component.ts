import { NgxsCustomService } from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ColDef, ColumnApi, ComponentType, FirstDataRenderedEvent, GridApi, GridOptions, GridParams, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, UserComponentFactory} from 'ag-grid-community';
import { MatDialog} from '@angular/material/Dialog'
import { CustomTooltipComponent} from "src/app/views/shared/components/custom-tooltip/custom-tooltip.component";
import { CreateBusinessPartnerComponent } from '../create-business-partner/create-business-partner.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IBusinessPartner } from '../model/IBusinessPartner';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { BusinessPartnerType, Permissions } from 'src/app/views/shared/AppEnum';
import { LoadingCellRenderer } from 'ag-grid-community/dist/lib/rendering/cellRenderers/loadingCellRenderer';
import { isEmpty } from 'lodash';
import { truncate } from 'fs';

@Component({
  selector: 'kt-list-business-partner',
  templateUrl: './list-business-partner.component.html',
  styleUrls: ['./list-business-partner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListBusinessPartnerComponent extends AppComponentBase implements OnInit {

  businessPartnerList : IBusinessPartner[];
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  //tooltipData : string = "double click to edit"

  // constructor
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
    {
      headerName: 'Name', 
      field: 'name', 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
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
      suppressMenu: true,
      cellRenderer: (params: ICellRendererParams) => {
        return BusinessPartnerType[params.value]
      }
    },
    {
      headerName: 'Phone Number', 
      field: 'phone', 
      tooltipField: 'name',
      suppressMenu: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value  : "N/A"
      }
    },

    {
      headerName: 'Bank Account Title', 
      field: 'bankAccountTitle', 
      tooltipField: 'name',
      suppressMenu: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value  : "N/A"
      } 
    },
    {
      headerName: 'Bank Account Number', 
      field: 'bankAccountNumber', 
      tooltipField: 'name',
      suppressMenu: true,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value  : "N/A"
      }
    },
  ];

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      resizable: true,
    }

    this.components = {
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if(!this.permission.isGranted(this.permissions.BUSINESSPARTNER_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
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
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getBusinessPartners(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.gridApi.hideOverlay();
      }
      // if (res.result) res.result.map((data: any, i: number) => data.index = i + 1)
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'businessPartnerPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getBusinessPartners(params: any): Promise<IPaginationResponse<IBusinessPartner[]>> {
    const result = await this.ngxsService.businessPartnerService.getRecords(params).toPromise()
    return result
  }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.setDatasource(this.dataSource);
  // }

  // async getBusinessPartners(params: any): Promise<IPaginationResponse<IBusinessPartner[]>> {
  //   const result = await this.ngxsService.businessPartnerService.getBusinessPartners(params).toPromise()
  //   return result
  // }

  // dataSource = {
  //   getRows: async (params: any) => {
  //    const res = await this.getBusinessPartners(params);

  //    if(isEmpty(res.result)) {  
  //     this.gridApi.showNoRowsOverlay() 
  //   } else {
  //    this.gridApi.hideOverlay();
  //   }
  //    //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
  //    params.successCallback(res.result || 0, res.totalRecords);
  //    this.paginationHelper.goToPage(this.gridApi, 'businessPartnerPageName')
  //    this.cdRef.detectChanges();
  //  },
  // };

  // getBusinessPartners() : void {
  //   this.ngxsService.businessPartnerService.getBusinessPartners().subscribe((res: IPaginationResponse<IBusinessPartner[]>) => {
  //     this.businessPartnerList = res.result;
  //     this.cdRef.detectChanges();
  //   })
  // }
}
