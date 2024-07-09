import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ValueFormatterParams
} from 'ag-grid-community';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {IBatch} from '../../batch-type/model/IBatch';
import {Permissions} from '../../../../shared/AppEnum';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IShift} from '../../shift/model/IShift';
import {isEmpty} from 'lodash';
import {BatchService} from '../service/batch.service';
import {BATCH} from '../../../../shared/AppRoutes';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-batch',
  templateUrl: './list-batch.component.html',
  styleUrls: ['./list-batch.component.scss']
})
export class ListBatchComponent extends AppComponentBase implements OnInit {

// Injecting Dependencies
  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private batchService: BatchService,
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
  batchList: IBatch[];
  gridOptions: any;
  defaultColDef: ColDef;
  public permissions = Permissions;
  
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


// Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'Batch',
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
      headerName: 'Start Date',
      field: 'startDate',
      tooltipField: 'name',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Semester',
      field: 'semester',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Campus',
      field: 'campus',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Shift',
      field: 'shift',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Admission Open',
      field: 'isAdmissionOpen',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params) => params.value === true ? 'Yes' : 'No'
    },
  ];

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getBatch(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'BatchPageName');
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
      paginationPageSizeSelector: false,
      context: 'double click to view detail'
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
    this.router.navigate(['/' + BATCH.ID_BASED_ROUTE('details', event.data.id)]);
  }

  openDialog(id?: number): void {
    this.router.navigate(['/' + BATCH.CREATE]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getBatch(params: any): Promise<IPaginationResponse<IShift[]>> {
    const result = await firstValueFrom(this.batchService.getRecords(params));
    return result
  }
}
