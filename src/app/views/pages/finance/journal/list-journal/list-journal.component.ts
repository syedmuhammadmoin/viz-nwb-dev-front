import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog'
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { JournalService } from '../services/journal.service';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { JOURNAL } from 'src/app/views/shared/AppRoutes';
import { IJournal } from '../model/IJournal';
import { JournalType, Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: ['./list-journal.component.scss'],
})

export class ListJournalComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: any;
  selectedRowCount : number;
  deleteBtn : boolean;
  domLayout: any;
  JournalList: IJournal[];
  public rowData : any[] = [];
  params: GridReadyEvent
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  //Injecting Dependencies
  constructor(
    private journalService: JournalService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  //Defining AG Grid Columns
  columnDefs = [
    { width: 20, checkboxSelection: true , headerCheckboxSelection: true },
    {
      headerName: 'JRN #',
      field: 'id',
      tooltipField: 'id',
      cellRenderer: "loadingCellRenderer",
      flex: 3,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    
    {
      headerName: 'Name',
      field: 'name',
      tooltipField: 'name',
      flex: 3,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Type',
      field: 'type',
      tooltipField: 'type',
      flex: 3,
      suppressHeaderMenuButton: true,
      valueFormatter: params => this.getJournalTypeText(params.value)
    },
    {
      headerName: 'Default Account',
      field: 'defaultAccount',
      flex: 5,
      tooltipField: 'Default Account',
      suppressHeaderMenuButton: true,
    },
  ];


  ngOnInit() {
    this.domLayout = "autoHeight";
    this.gridOptions = {
      rowSelection: 'multiple',    
      //rowModelType: "infinite",           
      // rowHeight: 30,
      // headerHeight: 35,      
      context: "double click to view detail",
      defaultColDef: {
        editable: true,
        filter: true, // Enable filtering
      },
      onGridReady: this.onGridReady.bind(this),
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 20,
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
    this.loadGridData();
  }
  loadGridData(): void {   
    lastValueFrom(this.journalService.getRecords()).then(res => {
      if(res){
        this.rowData = res.result;
      this.gridApi?.setGridOption('rowData', this.rowData)
      this.cdRef.detectChanges();
      }
    })
  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // params.api.sizeColumnsToFit();
  }

  addJournal() {
    this.router.navigate(['/' + JOURNAL.CREATE])
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(
      ['/' + JOURNAL.ID_BASED_ROUTE('edit', event.data.id)], 
      { queryParams: { q: event.data.id, isJournal: true } }
    );
  }
  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    var dataSource = {
      getRows: (params: any) => {
        this.journalService.getRecords(params).subscribe((data) => {
          if(isEmpty(data.result)) {
            this.gridApi.showNoRowsOverlay()
          } else {
            this.rowData = data.result;
            this.gridApi.hideOverlay();
          }
          params.successCallback(this.rowData || 0, data.totalRecords);
          //TODO: make enum for "journalPageName"
          this.paginationHelper.goToPage(this.gridApi, 'journalPageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }

//   fetchData(x: any) {           
//     const dataSource = {
//       getRows: (params: any) => {        
//         this.journalService.getRecordByYearMonth(x.startDate ,x.endDate)
//           .subscribe((data) => {
//             if (isEmpty(data.result)) {
//               this.gridApi.showNoRowsOverlay();
//             } else {
//               this.gridApi.hideOverlay();             
//               this.rowData = data.result;
//             }
//             params.successCallback(this.rowData || 0 ,data.totalRecords);
//             this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName');
//             this.cdRef.detectChanges();
//         });
//       },
//     };
//     this.gridApi.setDatasource(dataSource);
// }
 getJournalTypeText(value: number): string {
  switch (value) {
    case JournalType.Sales:
      return 'Sales';
    case JournalType.Purchase:
      return 'Purchase';
    case JournalType.Cash:
      return 'Cash';
    case JournalType.Bank:
      return 'Bank';
    case JournalType.Miscellaneous:
      return 'Miscellaneous';
    default:
      return 'Unknown';
  }
}

onRowSelected(event: any) {
  const selectedRows = event.api.getSelectedRows();
  this.selectedRowCount = selectedRows.length;
  this.deleteBtn = selectedRows.length > 0;

}

DeleteRows(){
  const selectedRows = this.gridApi.getSelectedRows();
  const selectedIds = selectedRows.map(row => row.id);   
  this.toastService.info("Deleting Records ,Please Wait!")
 lastValueFrom(this.journalService.deleteJournals(selectedIds)).then(res => {
  if(res){
    this.gridApi.deselectAll();
    this.rowData = this.rowData.filter(row => !selectedRows.includes(row));
    this.gridApi.setGridOption('rowData',this.rowData); 
    this.toastService.success("Deleted Successfully");
  }
  
 })       
};
DeselectRows() {
  this.gridApi.deselectAll();
}
}

