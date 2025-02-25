import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CreateDistrictComponent } from '../create-district/create-district.component';
import { IDistrict } from '../model/IDistrict';
import { DistrictService } from '../service/district.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-district',
  templateUrl: './list-district.component.html',
  styleUrls: ['./list-district.component.scss']
})
export class ListDistrictComponent extends AppComponentBase implements OnInit {

  gridOptions: any;
  defaultColDef: any;
  districtList: IDistrict[] = [];
  
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  columnDefs = [
    {
      headerName: 'District',
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
      headerName: 'City',
      field: 'city',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
  ]


  constructor(
    injector: Injector,
    private districtService: DistrictService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  ngOnInit() {
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: "double click to view detail",
    };

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
      cellStyle: (params: ICellRendererParams) => {
        return (params?.data?.state === 1 || params?.data?.state === 5) ? { 'pointer-events': 'none', 'color': '#87837e' } : null;
      }
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

  }

  getAllDistrict() {
    this.districtService.getDistrictDropdown().subscribe((res) => {
      this.districtList = res.result;
      this.cdRef.detectChanges()
    });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
      this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateDistrictComponent, {
      width: '740px',
      data: id
    });

    //Getting Updated Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    })
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getDistricts(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'DistrictPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getDistricts(params: any): Promise<IPaginationResponse<IDistrict[]>> {
    const result = await firstValueFrom(this.districtService.getRecords(params));
    return result
  }
}
