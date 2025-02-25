import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ColDef, FirstDataRenderedEvent, GridApi, GridOptions, RowDoubleClickedEvent} from 'ag-grid-community';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {CreateFeeTypeComponent} from '../create-fee-type/create-fee-type.component';
import {IFee} from '../model/IFee';

@Component({
  selector: 'kt-list-fee',
  templateUrl: './list-fee.component.html',
  styleUrls: ['./list-fee.component.scss']
})
export class ListFeeComponent extends AppComponentBase implements OnInit {


//Loader
  isLoading: boolean;

// For AG Grid..
  FacultyList: IFee[];
  gridOptions: any;
  defaultColDef: ColDef;
  public permissions = Permissions;
  
  tooltipData: string = 'double click to view detail'
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

//Injecting Dependencies
  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: {componentParent: this}
      }
    );
  }


//Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'FeeType',
      field: 'feeType',
      tooltipField: 'feeType',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    }
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
      loadingCellRenderer: function (params: any) {
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
    const dialogRef = this.dialog.open(CreateFeeTypeComponent, {
      width: '800px',
      data: id
    });
    //Getting Updated Warehouse
    // dialogRef.afterClosed().subscribe(() => {
    //   this.gridApi.setGridOption('datasource', this.dataSource);
    //   this.cdRef.detectChanges();
    // });
  }

// dataSource = {
//   getRows: async (params: any) => {
//     const res = await this.getBudgetReappropriation(params);
//     if (isEmpty(res.result)) {
//       this.gridApi.showNoRowsOverlay()
//     } else {
//       this.gridApi.hideOverlay();
//     }
//     params.successCallback(res.result || 0, res.totalRecords);
//     this.paginationHelper.goToPage(this.gridApi, 'BudgetReappropriationPageName');
//     this.cdRef.detectChanges();
//   },
// };

// onGridReady(params: GridReadyEvent) {
//   this.gridApi = params.api;
//   params.api.setGridOption('datasource', this.dataSource);
// }

// async getFaculty(params: any): Promise<IPaginationResponse<IBudget[]>> {
//   const result = await this.Faculty.getRecords(params).toPromise()
//   return result
// }

}
