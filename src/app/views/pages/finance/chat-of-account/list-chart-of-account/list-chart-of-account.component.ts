import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ChartOfAccountService } from '../service/chart-of-account.service';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize, } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CreateLevel4Component } from '../level4/create-level4/create-level4.component';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { ChatOfAccountModule } from '../chat-of-account.module';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { Level4Filter } from '../model/Level4Filter';


@Component({
  selector: 'kt-list-chart-of-account',
  standalone: false,
  templateUrl: './list-chart-of-account.component.html',
  styleUrl: './list-chart-of-account.component.scss',
})
export class ListChartOfAccountComponent extends AppComponentBase implements OnInit {

  //fields
  isLoading: boolean = false;
  
  dataSource: any;

  //Aggrid fields
  defaultColDef: ColDef;
  gridOptions: any;
  FilteredData: any[] = [];
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: any;
  //gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  public filterModel: Level4Filter = new Level4Filter(); // Initialize with default values

  public rowData: any[] = [];
  public dropdownData: any = []; 
  public selectedDropdownId: number | null = null;
  //Defining AG Grid Columns
  columnDefs = [
    {
      headerName: 'Code',
      field: 'code',
      tooltipField: 'Code',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      editable: true,
      flex: 1 // Make this column editable
    },
    {
      headerName: 'Name',
      field: 'editableName',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      editable: true,
      flex: 1
    },
 {
      headerName: 'Type',
      field: 'level3Name',
      tooltipField: 'Type',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      editable: true,
      cellEditor: 'agSelectCellEditor', // Use AG Grid's built-in select cell editor
      cellEditorParams: {
        values: [] // Dropdown options will be set here dynamically
      },
      flex: 1
    }
  ];



  constructor(
    private chartOfAccService: ChartOfAccountService,
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

    this.gridOptions = {
      defaultColDef: {
        filter: true, // Enable filtering
      },
      onGridReady: this.onGridReady.bind(this),
    };

  }
  // onGridReady(params: any): void {
  //   this.loadGridData();
  // }

  // addNewItem() {

  //   const dialogRef = this.dialog.open(CreateLevel4Component, {
  //     width: '800px',
  //     data: { parentId: 0 }
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.chartOfAccService.getChartOfAccount()
  //       .pipe(
  //         take(1),
  //         finalize(() => {
  //           this.isLoading = false;
  //           this.cdRef.detectChanges();
  //         })
  //       )
  //       .subscribe((res) => {
  //         this.dataSource.data = res.result;
  //         this.cdRef.detectChanges();
  //       })
  //   });

  // }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
  onFilterChanged(params: any): void {
    const filterModel = params.api.getFilterModel();

    // Map the filter model to your Level4Filter
    this.filterModel.code = filterModel.code ? filterModel.code.filter : '';
    this.filterModel.name = filterModel.name ? filterModel.name.filter : '';
    this.filterModel.level1Name = filterModel.level1Name ? filterModel.level1Name.filter : '';

    // Reload the grid with filtered data
    this.loadGridData();
  }
  loadGridData(): void {
    // Use the filterModel with default or updated values to request data from the server
    this.chartOfAccService.getLevel4Accounts(this.filterModel).subscribe((data) => {
      this.rowData = data.result;
      this.gridApi.setRowData(this.rowData);
      this.cdRef.detectChanges();
    });
  }
  // onRowDoubleClicked(event: RowDoubleClickedEvent) {
  //   const dialogRef = this.dialog.open(CreateLevel4Component, {
  //     width: '800px',
  //     data: { modelId: event.data.id }
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.chartOfAccService.getChartOfAccount()
  //       .pipe(
  //         take(1),
  //         finalize(() => {
  //           this.isLoading = false;
  //           this.cdRef.detectChanges();
  //         })
  //       )
  //       .subscribe((res) => {
  //         //this.dataSource.data = res.result;
  //         this.cdRef.detectChanges();
  //       })
  //   });
  // }

  editItem(node) {
    if (node.level === 3 && node.id) {

    }
  }


  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;

  //   var dataSource = {
  //     getRows: (params: any) => {
  //       this.chartOfAccService.getLevel4Accounts().subscribe((data) => {
  //         if (isEmpty(data.result)) {
  //           this.gridApi.showNoRowsOverlay()
  //         } else {
  //           this.FilteredData = data.result;
  //           this.gridApi.hideOverlay();
  //         }
  //         params.successCallback(this.FilteredData || 0, data.totalRecords);
  //         //TODO: make enum for "journalPageName"
  //         this.paginationHelper.goToPage(this.gridApi, 'CoAPageName')
  //         this.cdRef.detectChanges();
  //       });
  //     },
  //   };
  //   params.api.setGridOption('datasource', dataSource);
  // }

  ngOnInit(): void {

    // this.gridOptions = {
    //   cacheBlockSize: 100,
    //   rowModelType: "infinite",
    //   paginationPageSize: 100,
    //   pagination: false,
    //   rowHeight: 30,
    //   headerHeight: 35,
    //   paginationPageSizeSelector: false,
    //   context: "double click to view detail",
    // };



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

    this.isLoading = true;
    this.loadGridData();
    this.getLevel3Accounts();

  }

  private gridApi!: GridApi;
  private columnApi!: ColumnApi;
  private editedRows: any[] = [];


  // rowData = [
  //   { make: 'Toyota', model: 'Celica', price: 35000 },
  //   { make: 'Ford', model: 'Mondeo', price: 32000 },
  //   { make: 'Porsche', model: 'Boxster', price: 72000 }
  // ];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  addNewRow() {
    const newRow = {
      code: '00000',
      editableName: 'Test Account',
      level3Name: 'Test Account'
    };
    this.gridApi.applyTransaction({ add: [newRow], addIndex: 0 });
    this.editedRows.push(newRow); 
  }

  saveChanges() {
    // This function can be expanded to save changes to a backend server or local storage
    console.log('Changes saved:', this.editedRows);
    this.editedRows = []; // Clear the edited rows after saving
  }

  onCellEditingStopped(event: any) {
    const rowNode = event.node;
    if (this.editedRows.indexOf(rowNode.data) === -1) {
      this.editedRows.push(rowNode.data);
    }
  }

  onCellValueChanged(event: any) {
    // Handle cell value changes
    console.log('Cell value changed:', event.data);
    this.onCellEditingStopped(event);
  }

  getLevel3Accounts(): void {
    this.chartOfAccService.getLevel3AccountsDropdown().subscribe(data => {
      this.dropdownData = data.result;
      console.log('Dropdown Data:', this.dropdownData);
      this.updateColumnDefs();
      this.cdRef.detectChanges(); // Trigger change detection
    });
  }

  updateColumnDefs() {
    const typeColDef = this.columnDefs.find(col => col.field === 'level3Name');
    if (typeColDef) {
      typeColDef.cellEditorParams = {
        values: this.dropdownData.map((item: any) => item.name) // Populate dropdown values
      };
      //this.columnApi.applyColumnState({ state: this.columnDefs, applyOrder: true });
    }
  }
}
