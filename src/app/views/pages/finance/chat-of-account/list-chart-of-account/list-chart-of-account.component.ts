import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ChartOfAccountService } from '../service/chart-of-account.service';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize, map, } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CreateLevel4Component } from '../level4/create-level4/create-level4.component';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { ChatOfAccountModule } from '../chat-of-account.module';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { Level4Filter } from '../model/Level4Filter';
import { ILevel4 } from '../level4/model/ILevel4';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GroupDropdownCellEditorComponent } from '../group-drop-down-cell-editor/group-drop-down-cell-editor.component';


@Component({
  selector: 'kt-list-chart-of-account',
  standalone: false,
  templateUrl: './list-chart-of-account.component.html',
  styleUrl: './list-chart-of-account.component.scss',
})
export class ListChartOfAccountComponent extends AppComponentBase implements OnInit {

  //fields
  isLoading: boolean = false;
  form: FormGroup;
  dataSource: any;
  model: ILevel4;
  private gridApi!: GridApi;
  private columnApi!: ColumnApi;
  private editedRows: any[] = [];
  private lastAddedRow: any = null;
  public showDiscardButton: boolean = false;

  //Aggrid fields
  defaultColDef: ColDef;
  domLayout: any;
  gridOptions: GridOptions;
  FilteredData: any[] = [];
  level3List: Level3Dropdown[];
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
      flex: 1
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
      cellEditor: GroupDropdownCellEditorComponent,
      cellEditorParams: {
        values: [] // Dropdown options will be set here dynamically
      },
      flex: 1,
      valueFormatter: (params: any) => {
        const selectedItem = this.dropdownData.find((item: any) => item.id === params.value);
        return selectedItem ? selectedItem.name : params.value;
      }
    }
  ];



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
      context: {
        chartOfAccountService: this.chartOfAccService // Pass the service via context
      },

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
      onGridReady: this.onGridReady.bind(this)

    }
  }
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
      this.gridApi.setGridOption('rowData', this.rowData)
      this.cdRef.detectChanges();
    });
  }


  
  editItem(node) {
    if (node.level === 3 && node.id) {

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
    const typeColDef = this.columnDefs.find(col => col.field === 'level3Name');
    if (typeColDef) {
      typeColDef.tooltipField = 'level3Name'; // This enables the tooltip
      typeColDef.cellEditorParams = {
        values: this.dropdownData.map((item: any) => item.name),
      };
    }


    this.isLoading = true;
    this.loadGridData();
    this.getLevel3Accounts();


     // Create a form with a FormArray for rows
     this.form = this.fb.group({
      rows: this.fb.array(this.rowData.map(data => this.createRowFormGroup(data)))
    });

    this.form.get('level3Ctrl')?.valueChanges.subscribe(value => {
      console.log('Value from level3Ctrl component:', value);
    });

    this.form.get('level3Name')?.valueChanges.subscribe(value => {
      console.log('Value from level3Name component:', value);
    });

    


  }

  createRowFormGroup(data: any): FormGroup {
    var form = this.fb.group({
     level3Name: [data.level3Name],
   });

   console.log('Exp. form', form)
   return form;
   
 }
 get rowsFormArray(): FormArray {
   return this.form.get('rows') as FormArray;
 }

 onSubmit() {
   console.log(this.form.value);
 }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  addNewRow() {
    const newRow = {
      code: ' ', // Blank values for new row
      editableName: ' ',
      level3Name: ''
    };

    this.gridApi.applyTransaction({ add: [newRow], addIndex: 0 });
    this.editedRows.push(newRow); // Track the new row
    this.lastAddedRow = newRow;
    this.showDiscardButton = true; // Show the discard button
    this.editedRows.push(newRow);

    //this.onCellValueChanged({ data: newRow });
  }
  discardLastRow() {
    if (this.lastAddedRow) {
      // Remove the last added row from the grid
      this.gridApi.applyTransaction({ remove: [this.lastAddedRow] });

      // Reset the last added row and hide the discard button
      this.lastAddedRow = null;
      this.showDiscardButton = false;
    }
  }

  saveChanges() {
    if (this.lastAddedRow) {
      this.editedRows = [];

      this.showDiscardButton = true;
    }
  }


  onCellValueChanged(event: any) {
    console.log('Selected Level 3 Account ID'); 

    const isRowNew = this.editedRows.some(row => row === event.data);

    // If the column is 'level3Name' (which stores the ID), log the ID for both new and existing rows
    if (event.colDef.field === 'level3Name') {
      console.log('Selected Level 3 Account ID:', event.value); // This logs the ID
    }

    // Create a model object for new or existing row updates

    const model = { ...event.data, level3_id: event.value };
    if (isRowNew && model.code && model.editableName && model.level3_id) {
      delete model.level3Name;
      this.chartOfAccService.createLevel4Account(model).subscribe(res => {
        this.showDiscardButton = false
        this.toast.success("Created Successfully", "Chart of Account")
      });
    }
    if (!isRowNew) {
     // delete model.level3_id;
      this.showDiscardButton = false
      this.chartOfAccService.updateLevel4Account(model).subscribe(res => {
        this.toast.success("Updated Successfully", "Chart of Account")
      });
    }
  }

  getLevel3Accounts(): void {
    this.chartOfAccService.getLevel3AccountsDropdown().subscribe(res => {
      this.dropdownData = res.result;
      console.log(this.dropdownData, "DropdownData");
      this.updateColumnDefs();
    })
  }

  updateColumnDefs() {
    const typeColDef = this.columnDefs.find(col => col.field === 'level3Name');
    if (typeColDef) {
      typeColDef.cellEditorParams = {
        values: this.dropdownData.map((item: any) => item.id),
      };
      typeColDef.valueFormatter = (params: any) => {
        const selectedItem = this.dropdownData.find((item: any) => item.id === params.value);
        return selectedItem ? selectedItem.name : params.value;
      };

      this.columnDefs = [...this.columnDefs];
    }
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