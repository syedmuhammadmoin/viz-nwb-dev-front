import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import {ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ValueFormatterParams} from 'ag-grid-community';
import {ICampus} from '../model/ICampus';
import {IPaginationResponse} from 'src/app/views/shared/IPaginationResponse';
import {CampusService} from '../service/campus.service';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {isEmpty} from 'lodash';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-campus',
  templateUrl: './list-campus.component.html',
  styleUrls: ['./list-campus.component.scss']
})

export class ListCampusComponent extends AppComponentBase implements OnInit {

  campusList: ICampus[]
  gridOptions: any;
  defaultColDef: ColDef;
  components: any;
  gridApi: GridApi;
  public permissions = Permissions
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  // constructor
  constructor(
    public dialog: MatDialog,
    public campusService: CampusService,
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

  //Defining Campus Columns
  columnDefs = [
    {
      headerName: 'Sr.No',
      field: 'index',
      cellRenderer: 'loadingCellRenderer',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Name',
      field: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Active',
      field: 'isActive',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value) ? 'Yes' : 'No';
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
      loadingCellRenderer: function (params) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if (!this.permission.isGranted(this.permissions.CAMPUS_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
  }

// data rendering on first
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getCampuses(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      if (res.result) res.result.map((data: any, i: number) => data.index = i + 1)
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'campusPageName')
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getCampuses(params: any): Promise<IPaginationResponse<ICampus[]>> {
    const result = await firstValueFrom(this.campusService.getRecords(params));
    return result
  }
}
