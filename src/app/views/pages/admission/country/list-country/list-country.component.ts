import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {MatDialog} from '@angular/material/dialog';
import {SemesterService} from '../../semester/services/semester.service';
import {ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {ISemester} from '../../semester/model/ISemester';
import {isEmpty} from 'lodash';
import {CustomTooltipComponent} from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import {CreateSemesterComponent} from '../../semester/create-semester/create-semester.component';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {CountryService} from '../service/country.service';
import {CreateCountryComponent} from '../create-country/create-country.component';

@Component({
  selector: 'kt-list-country',
  templateUrl: './list-country.component.html',
  styleUrls: ['./list-country.component.scss']
})
export class ListCountryComponent extends AppComponentBase implements OnInit {

// Injecting Dependencies
  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private countryService: CountryService,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }

// Loader
  isLoading: boolean;

// For AG Grid..
  FacultyList: ISemester[];
  gridOptions: GridOptions;
  defaultColDef: ColDef;
  public permissions = Permissions;
  frameworkComponents: { [p: string]: unknown };
  tooltipData = 'double click to view detail'
  components: { loadingCellRenderer(params: any): unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


// Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'Sr.No',
      field: 'index',
      cellRenderer: 'loadingCellRenderer',
      suppressMenu: true,
    },
    {
      headerName: 'Country',
      field: 'name',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
  ];

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getCountry(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      if (res.result) res.result.map((data: any, i: number) => data.index = i + 1);
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'CountryPageName');
      this.cdRef.detectChanges();
    },
  };

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: 'double click to view detail',
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
      loadingCellRenderer(params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCountryComponent, {
      width: '800px',
      data: id
    });
    // Getting Updated Warehouse
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getCountry(params: any): Promise<IPaginationResponse<ISemester[]>> {
    const result = await this.countryService.getRecords(params).toPromise()
    return result
  }

}
