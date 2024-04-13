import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {CreateShiftComponent} from '../create-shift/create-shift.component';
import {IShift} from '../model/IShift';
import {Permissions} from '../../../../shared/AppEnum';
import {isEmpty} from 'lodash';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {ShiftService} from '../service/shift.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-shift',
  templateUrl: './list-shift.component.html',
  styleUrls: ['./list-shift.component.scss']
})
export class ListShiftComponent extends AppComponentBase implements OnInit {

// Injecting Dependencies
  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private shiftService: ShiftService,
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
  shiftList: IShift[];
  gridOptions: any;
  defaultColDef: ColDef;
  public permissions = Permissions;
  
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


// Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'Sr.No',
      field: 'index',
      tooltipField: 'name',
      cellRenderer: 'loadingCellRenderer',
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Shift',
      field: 'name',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    }
  ];

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getShift(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      if (res.result) res.result.map((data: any, i: number) => data.index = i + 1);
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'ShiftPageName');
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
      context: 'double click to edit'
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
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateShiftComponent, {
      width: '800px',
      data: id
    });
    // Getting Updated Warehouse
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getShift(params: any): Promise<IPaginationResponse<IShift[]>> {
    const result = await firstValueFrom(this.shiftService.getRecords(params));
    return result
  }
}
