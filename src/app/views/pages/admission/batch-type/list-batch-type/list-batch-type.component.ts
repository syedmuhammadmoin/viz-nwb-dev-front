import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateBatchTypeComponent } from '../create-batch-type/create-batch-type.component';
import { IBatch } from '../model/IBatch';

@Component({
  selector: 'kt-list-batch-type',
  templateUrl: './list-batch-type.component.html',
  styleUrls: ['./list-batch-type.component.scss']
})
export class ListBatchTypeComponent extends AppComponentBase implements OnInit {

//Loader
isLoading: boolean;

// For AG Grid..
BatchTypeList: IBatch[];
gridOptions: GridOptions;
defaultColDef: ColDef;
public permissions = Permissions;
frameworkComponents: { [p: string]: unknown };
tooltipData: string = "double click to view detail"
components: { loadingCellRenderer(params: any): unknown };
gridApi: GridApi;
gridColumnApi: ColumnApi;
overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

//Injecting Dependencies
constructor(
  private router: Router,
  public dialog: MatDialog,
  private cdRef: ChangeDetectorRef,
  injector: Injector
) {
  super(injector)
  this.gridOptions = <GridOptions>(
    {
      context: { componentParent: this }
    }
  );
}


//Defining AG Grid Columns

columnDefs = [
  {
    headerName: 'BatchType',
    field: 'batchType',
    tooltipField: 'batchType',
    cellRenderer: "loadingCellRenderer",
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
    rowModelType: "infinite",
    paginationPageSize: 10,
    pagination: true,
    rowHeight: 30,
    headerHeight: 35,
    context: "double click to view detail",
  };

  this.frameworkComponents = { customTooltip: CustomTooltipComponent };

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

}

onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.sizeColumnsToFit();
}

onRowDoubleClicked(event: RowDoubleClickedEvent) {
  this.openDialog(event.data.id)
}

openDialog(id?: number): void {
  const dialogRef = this.dialog.open(CreateBatchTypeComponent, {
    width: '800px',
    data: id
  });
  //Getting Updated Warehouse
  // dialogRef.afterClosed().subscribe(() => {
  //   this.gridApi.setDatasource(this.dataSource)
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
//   this.gridColumnApi = params.columnApi;
//   params.api.setDatasource(this.dataSource);
// }

// async getFaculty(params: any): Promise<IPaginationResponse<IBudget[]>> {
//   const result = await this.Faculty.getRecords(params).toPromise()
//   return result
// }

}


