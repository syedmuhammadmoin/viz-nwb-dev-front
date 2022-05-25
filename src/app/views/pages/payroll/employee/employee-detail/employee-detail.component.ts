import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions, PayrollType, PayrollItemType } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPayrollItem } from '../../payroll-item/model/IPayrollItem';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'kt-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})

export class EmployeeDetailComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  employeeId: number;

  //Variables for employee data
  payrollItems: IPayrollItem | any
  employeeMaster:  any;
  status: string;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  //Defining columns for ag grid
  columnDefs = [
    { headerName: 'Item Name', field: 'name', sortable: true, filter: true, tooltipField: 'name', cellRenderer: "loadingCellRenderer" },
    //{ headerName: 'Item Code', field: 'itemCode', sortable: true, filter: true, tooltipField: 'name' },
    { 
      headerName: 'Payroll Type', 
      field: 'payrollType', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return PayrollType[params.value];
      }
     },
    { 
      headerName: 'Item Type', 
      field: 'payrollItemType', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return PayrollItemType[params.value];
      }
     },
    {
      headerName: 'Account',
      field: 'accountName',
      sortable: true,
      filter: true,
      tooltipField: 'name'
    },
    {
      headerName: 'Value',
      field: 'value',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return this.valueFormatter(params.value);
      }
    },
    // {
    //   headerName: 'Remarks', field: 'remarks', sortable: true, filter: true
    // },
    { 
      headerName: 'Active', 
      field: 'isActive', 
      sortable: true, 
      filter: true, 
      valueFormatter: (params: ValueFormatterParams) => {
         return (params.value === true) ? 'Yes' : "No"
      }
    }
  ];

  ngOnInit() {

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.employeeId = id;
        this.getEmployeeData(id);
        this.cdr.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Employee Master Data
  getEmployeeData(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((res: IApiResponse<any>) => {
      this.employeeMaster = res.result;
      this.payrollItems = res.result.payrollItems;
    
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, (err: any) => console.log(err));
  }
}
