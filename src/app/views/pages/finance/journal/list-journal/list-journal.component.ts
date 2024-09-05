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

@Component({
  selector: 'kt-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: ['./list-journal.component.scss'],
})

export class ListJournalComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: any;
  JournalList: IJournal[];
  FilteredData : any[] = [];
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
    {
      headerName: 'JRN #',
      field: 'id',
      tooltipField: 'id',
      cellRenderer: "loadingCellRenderer",
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
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Type',
      field: 'type',
      tooltipField: 'type',
      suppressHeaderMenuButton: true,
      valueFormatter: params => this.getJournalTypeText(params.value)
    },
    {
      headerName: 'Default Account',
      field: 'defaultAccount',
      tooltipField: 'Default Account',
      suppressHeaderMenuButton: true,
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
            this.FilteredData = data.result;
            this.gridApi.hideOverlay();
          }
          params.successCallback(this.FilteredData || 0, data.totalRecords);
          //TODO: make enum for "journalPageName"
          this.paginationHelper.goToPage(this.gridApi, 'journalPageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }

  fetchData(x: any) {           
    const dataSource = {
      getRows: (params: any) => {        
        this.journalService.getRecordByYearMonth(x.startDate ,x.endDate)
          .subscribe((data) => {
            if (isEmpty(data.result)) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();             
              this.FilteredData = data.result;
            }
            params.successCallback(this.FilteredData || 0 ,data.totalRecords);
            this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName');
            this.cdRef.detectChanges();
        });
      },
    };
    this.gridApi.setDatasource(dataSource);
}
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
}
