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
import { finalize, take } from 'rxjs/operators';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';

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
  gridOptions: any;
  defaultColDef: ColDef;

  //Loader
  isLoading: boolean;

  //need for routing
  employeeId: number;

  //Variables for employee data
  payrollItems: IPayrollItem | any
  employeeMaster:  any;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  //Defining Employee Columns
  columnDefs = [
    { headerName: 'Item Name', field: 'name', sortable: false, filter: true, tooltipField: 'name', cellRenderer: "loadingCellRenderer" },
    { 
      headerName: 'Payroll Type', 
      field: 'payrollType', 
      sortable: false, 
      filter: true, 
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return PayrollType[params.value];
      }
     },
    { 
      headerName: 'Item Type', 
      field: 'payrollItemType', 
      sortable: false, 
      filter: true, 
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return PayrollItemType[params.value];
      }
     },
    {
      headerName: 'Account',
      field: 'accountName',
      sortable: false,
      filter: true,
      tooltipField: 'name'
    },
    {
      headerName: 'Value',
      field: 'value',
      sortable: false,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return this.valueFormatter(params.value);
      }
    },
    { 
      headerName: 'Active', 
      field: 'isActive', 
      sortable: false, 
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
        this.isLoading = true;
        this.employeeId = id;
        this.getEmployeeData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Employee Master Data
  getEmployeeData(id: number) {
    this.employeeService.getEmployeeById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<any>) => {
      this.employeeMaster = res.result;
      this.payrollItems = res.result.payrollItems;
    
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    })
  }

  openEmployeeDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      width: '800px',
      data: this.employeeId
    });
    //Get Updated Employee Data
    dialogRef.afterClosed().subscribe(() => {
      this.getEmployeeData(this.employeeId);
    });
  }
}
