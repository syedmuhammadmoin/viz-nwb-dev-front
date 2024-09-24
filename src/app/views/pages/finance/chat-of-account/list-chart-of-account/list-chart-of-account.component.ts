import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartOfAccountService } from '../service/chart-of-account.service';
import { MatDialog } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { Level4Filter } from '../model/Level4Filter';
import { ILevel4 } from '../level4/model/ILevel4';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GroupDropdownCellEditorComponent } from '../group-drop-down-cell-editor/group-drop-down-cell-editor.component';
import { Level4AccountModel } from '../model/Level4AccountModel';
import { lastValueFrom } from 'rxjs';
import { CheckboxSelectionComponent } from 'ag-grid-enterprise';


@Component({
  selector: 'kt-list-chart-of-account',
  standalone: false,
  templateUrl: './list-chart-of-account.component.html',
  styleUrl: './list-chart-of-account.component.scss',
  encapsulation: ViewEncapsulation.None, // Add this line
})
export class ListChartOfAccountComponent extends AppComponentBase implements OnInit {

  //fields
  isLoading: boolean = false;
  form: FormGroup;
  //dataSource: any;
  //model: ILevel4;
  private gridApi!: GridApi;
  // private columnApi!: ColumnApi;
  // private editedRows: any[] = [];
  private lastAddedRow: any = null;
  public showDiscardButton: boolean = false;
  public isNewRowAdded: boolean = false;
  public settingBtn: boolean = false;
  selectedRowCount: number[] = []


  //Aggrid fields
  defaultColDef: ColDef;
  domLayout: any;
  gridOptions: GridOptions;
  FilteredData: any[] = [];
  level3List: Level3Dropdown[];
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: any;
  public editingRowId: string | null = null; // Initialize it in your class
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  // Add a property to store the original data
  private originalRowData: any = null;
  public filterModel: Level4Filter = new Level4Filter(); // Initialize with default values

  public rowData: any[] = [];
  public dropdownData: any = [];
  public selectedDropdownId: number | null = null;
  columnDefs: any;
  // Error map to track which fields have validation errors
  public rowValidationErrors: { [rowId: string]: { [field: string]: boolean } } = {};





  constructor(
    private chartOfAccService: ChartOfAccountService,
    public dialog: MatDialog,
    public toast: ToastrService,
    private cdRef: ChangeDetectorRef,
    injector: Injector,
    private fb: FormBuilder
  ) {
    super(injector)
    this.form = this.fb.group({
      level3Ctrl: [''],  // Add the control you're binding to
      level3Name: ['']  // Add the control you're binding to
    });

    this.components = {
      groupDropdownCellEditor: GroupDropdownCellEditorComponent
    };



    this.gridOptions = {
      rowSelection: 'multiple',
      singleClickEdit: true,
      onRowClicked: this.onRowClicked.bind(this),
      rowClassRules: {
        'row-editing': params => {
          const editingCells = params.api.getEditingCells();
          return editingCells.some(cell => cell.rowIndex === params.node.rowIndex);
        },
      },
      context: {
        chartOfAccountService: this.chartOfAccService // Pass the service via context
      },

      onCellEditingStarted: (event) => this.onCellEditingStarted(event),
      onCellEditingStopped: (event) => this.onCellEditingStopped(event),

      components: {
        groupDropdownCellEditor: GroupDropdownCellEditorComponent,
        customTooltip: CustomTooltipComponent,
        loadingCellRenderer: function (params: any) {
          if (params.value !== undefined) {
            return params.value;
          } else {
            return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
          }
        },
      },
      defaultColDef: {
        editable: true,
        filter: true, // Enable filtering
      },
      onGridReady: this.onGridReady.bind(this),
    }
  }
  ngOnInit(): void {
    this.domLayout = "autoHeight";
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
    this.getLevel3Accounts();
    this.loadGridData();


    // Create a form with a FormArray for rows
    this.form = this.fb.group({
      rows: this.fb.array(this.rowData.map(data => this.createRowFormGroup(data)))
    });

    // this.form.get('level3Ctrl')?.valueChanges.subscribe(value => {

    // });

    // this.form.get('level3Name')?.valueChanges.subscribe(value => {

    // });




  }
  // Event when cell editing starts
  onCellEditingStarted(event: any) {
    // console.log('Editing started on:', event);
    if (event.data) {
      this.originalRowData = { ...event.data }; // Deep clone the row data
    }
    this.editingRowId = event.data.id;
    this.gridApi.refreshCells({ force: true });
  }

  // Event when cell editing stops
  onCellEditingStopped(event: any) {
    // console.log('Editing stopped on:', event);
    this.editingRowId = null;
    this.gridApi.refreshCells({ force: true });
  }
  // Method to handle row click
  onRowClicked(event: any) {
    this.gridApi.startEditingCell({
      rowIndex: event.rowIndex,
      colKey: 'code' // Start editing the first column or whichever you prefer
    });
  }
  isRowEditable(rowId: string): boolean {
    // Allow editing only if the row is in edit mode or if no row is in edit mode
    return this.editingRowId === null || this.editingRowId === rowId;
  }
  // Helper method to compare original and updated data
  hasDataChanged(newData: any): boolean {
    return JSON.stringify(this.originalRowData) !== JSON.stringify(newData);
  }
  initializeColumnDefs() {

    this.columnDefs = [
      { width: 50, checkboxSelection: true , headerCheckboxSelection: true, },
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

        flex: 1,
        editable: (params) => this.isRowEditable(params.data.id), // Conditional editability
        cellClassRules: {
          'cell-error': (params: any) => this.hasError(params.data.id, 'code')
        }
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
        flex: 3,
        editable: (params) => this.isRowEditable(params.data.id),

        cellClassRules: {
          'cell-error': (params: any) => this.hasError(params.data.id, 'editableName')
        }
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
        flex: 2,
        editable: (params) => this.isRowEditable(params.data.id),
        cellEditor: GroupDropdownCellEditorComponent,
        cellEditorParams: {
          values: this.dropdownData // Pass the dropdown data to the cell editor
        },

        cellClassRules: {
          'cell-error': (params: any) => this.hasError(params.data.id, 'level3_id')

        },
        valueFormatter: (params: any) => {
          console.log('params', params);
          //Recursive function to find item by level3_id
          function findItemByLevel3Id(data: any[], level3Id: string): any {
            for (const item of data) {
              if (item.id === level3Id) {
                console.log('item', item);
                return item;
              }
              if (item.children && item.children.length) {
                const found = findItemByLevel3Id(item.children, level3Id);
                if (found) {
                  return found;
                }
              }
            }
            return null;
          }

          // Use the recursive function to find the item
          const selectedItem = findItemByLevel3Id(this.dropdownData, params.value);
          params.data.level3Name =  params.value;
          return selectedItem ? selectedItem.name : params.value;
          //return params.value;
        }
      },

    ];



  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    //params.api.sizeColumnsToFit();
  }

  onFilterChanged(params: any): void {
    const filterModel = params.api.getFilterModel();

    // Map the filter model to your Level4Filter
    this.filterModel.code = filterModel.code ? filterModel.code.filter : '';
    this.filterModel.name = filterModel.name ? filterModel.name.filter : '';
    this.filterModel.level1Name = filterModel.level1Name ? filterModel.level1Name.filter : '';

    // Reload the grid with filtered data
    this.loadGridData();
    this.cdRef.detectChanges();
  }
  loadGridData(): void {
    // Use the filterModel with default or updated values to request data from the server
    this.chartOfAccService.getLevel4Accounts(this.filterModel).subscribe((data) => {
      this.rowData = data.result;
      this.gridApi?.setGridOption('rowData', this.rowData)
      this.cdRef.detectChanges();
    });
  }


  hasError(rowId: string, field: string): boolean {
    return this.rowValidationErrors[rowId] && this.rowValidationErrors[rowId][field];
  }

  createRowFormGroup(data: any): FormGroup {
    var form = this.fb.group({
      level3Name: [data.level3Name],
    });


    return form;

  }
  get rowsFormArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }




  onGridReady(params: any) {
    this.gridApi = params.api;

  }

  // Method to check if a row already exists based on its unique ID
  isRowDuplicate(newRow: any, existingRows: any[]): boolean {
    return existingRows.some(row => row.id === newRow.id); // Adjust 'id' to your unique identifier
  }

  getAllRows(): any[] {
    const rowNodes = [];
    this.gridApi.forEachNode(node => rowNodes.push(node.data));
    return rowNodes;
  }

  addNewRow() {
    const newRow = {
      code: null,
      editableName: null,
      level3Name: null
    };


    // Retrieve all rows from the grid
    const existingRows = this.getAllRows();

    // Check if the row already exists
    if (this.isRowDuplicate(newRow, existingRows)) {
      console.warn('Row already exists, not adding duplicate.');
      return; // Exit if row is a duplicate
    }

    this.gridApi.applyTransaction({ add: [newRow], addIndex: 0 });
    // this.editedRows.push(newRow); // Track the new row
    this.lastAddedRow = newRow;
    this.showDiscardButton = true; // Show the discard button
    this.isNewRowAdded = true;
    //this.editedRows.push(newRow);

    //this.onCellValueChanged({ data: newRow });



    // Start editing the 'code' cell in the first row (index 0)
    this.startEditingCell(0, 'code');


  }
  discardLastRow() {
    if (this.lastAddedRow) {
      // Remove the last added row from the grid
      this.gridApi.applyTransaction({ remove: [this.lastAddedRow] });

      // Reset the last added row and hide the discard button
      this.lastAddedRow = null;
      this.showDiscardButton = false;
      this.isNewRowAdded = false;

    }
  }

  saveChanges() {

    this.gridApi.stopEditing();

    if (this.lastAddedRow) {



    }
  }

  validateRow(model: any): boolean {

    if (!model.code || !model.editableName || !model.level3_id) {
      this.toastService.error('All fields are required!', 'Validation Error');

      return false;
    }

    // Validation for updating (id is required for update)
    if (!model.code || !model.editableName || !model.level3_id || !model.id) {
      this.toastService.error('All fields are required!', 'Validation Error');
      return false;
    }

    return true;
  }
  findNameByLevel3Id(level3Id: string): string {
    const item = this.dropdownData.find(d => d.level3_id === level3Id);
    return item ? item.level3Name : '';
  }
  onRowValueChanged(event: any) {
    debugger;
     console.log('Row editing stopped. Data:', event.data);
     if(this.checkCode(event.data.code) == false){
      return;
    }

    const model: Level4AccountModel = this.mapToLevel4AccountModel(event.data);



    const isRowNew = !event.data.id; // If id is null/undefined, it's a new row

    // // Check if the row is new or already existing by comparing with the editedRows array
    // var isRowNew = this.editedRows.some(row => row === event.data);


    if (event.data) {

      // Check if the data has changed compared to the original data
      if (!this.hasDataChanged(event.data)) {
        console.log('Data not changed, skipping the service call.');
        return; // Skip the service call if no data has changed
      }

      // Validation for insertion
      if (isRowNew && (!model.code || !model.editableName || !model.level3_id)) {
        this.toast.error('Code, Name, and Account Type are required for creating a new account.', 'Chart of Account');
        return;
      }

      // Validation for updating (id is required for update)
      if (!isRowNew && (!model.code || !model.editableName || !model.level3_id || !model.id)) {
        this.toast.error('ID, Code, Name, and and Account Type are required for updating the account.', 'Chart of Account');
        return;
      }

    }

    this.showDiscardButton = false;
    this.isNewRowAdded = false;
    // new row creation 
    if (isRowNew) {
      this.chartOfAccService.createLevel4Account(model).subscribe({
        next: (res) => {
          this.showDiscardButton = false;
          var response: any = res;
          event.data.id = response.result.id; // Assuming the API returns the inserted record's ID
          this.showDiscardButton = false;
          this.isNewRowAdded = false;
          this.cdRef.markForCheck();

          this.toast.success("Created Successfully", "Chart of Account");
        }
      });
    }
    // Handle existing row updates if the row is not new
    else if (!isRowNew) {
      this.chartOfAccService.updateLevel4Account(model).subscribe({
        next: (res) => {
          this.showDiscardButton = false;
          this.isNewRowAdded = false;
          this.cdRef.markForCheck();
          this.toast.success("Updated Successfully", "Chart of Account");
        }
      });
    }
  }


  onCellValueChanged(event: any) {
    debugger;
    const rowData = event.data;
   
    if(this.checkCode(event.data.code) == false){
      return;
    }
    
    const rowId = rowData.id || rowData.tempId; // You can use id or create a tempId for new rows
    const model: Level4AccountModel = this.mapToLevel4AccountModel(rowData);

    // Initialize error tracking for the row
    if (!this.rowValidationErrors[rowId]) {
      this.rowValidationErrors[rowId] = {};
    }

    // Validate fields and update the error map
    this.rowValidationErrors[rowId]['code'] = !model.code;
    this.rowValidationErrors[rowId]['editableName'] = !model.editableName;
    this.rowValidationErrors[rowId]['level3_id'] = !model.level3_id;

    // Trigger grid refresh to apply error styles
    this.gridApi.refreshCells({ force: true });
  }


  getLevel3Accounts(): void {
    this.chartOfAccService.getAccountsTypeDropdown().subscribe(res => {
      this.dropdownData = res.result;
      this.initializeColumnDefs(); // Call this after data is loaded

      //  this.updateColumnDefs();
    })
  }



  mapToLevel4AccountModel(eventData: any): Level4AccountModel {
    //  console.log('mapToLevel4AccountModel: eventData', eventData)
    return {
      id: eventData.id,
      editableName: eventData.editableName,
      code: eventData.code,
      level3_id: eventData.level3_id ? eventData.level3_id : eventData.level3Name
    };
  }

  private startEditingCell(rowIndex: number, colKey: string) {
    this.gridApi.startEditingCell({
      rowIndex: rowIndex,
      colKey: colKey,
    });
  }
  onRowSelected(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.selectedRowCount = selectedRows.length
    this.settingBtn = selectedRows.length > 0;

  }

  DeselectRows() {
    this.gridApi.deselectAll();
  }
  DeleteRows(){
    const selectedRows = this.gridApi.getSelectedRows();
    const selectedIds = selectedRows.map(row => row.id);
   lastValueFrom(this.chartOfAccService.deleteCOA(selectedIds)).then(res => {
    if(res){
      this.gridApi.deselectAll();
      this.rowData = this.rowData.filter(row => !selectedRows.includes(row));
      this.gridApi.setGridOption('rowData',this.rowData); 
      this.toastService.success("Deleted Successfully");
    }
    
   })       
};
checkCode(code: string) : any {
  const regex = /[A-Za-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (regex.test(code)) {
    this.toastService.error("Code Cannot Contain Alphabets or Special Characters.");
    return false;
}
return true;
}
}



export interface Level3Dropdown {
  id: number;
  name: string;
  children: Level3Children[]
}
export interface Level3Children {
  id: number;
  name: string;
  code: string;
  editableName: string;
  accountType: number;
}


