import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DepartmentService } from '../service/department.service';
import { ColDef, FirstDataRenderedEvent, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateDepartmentComponent } from '../create-department/create-department.component';
import { IDepartment } from '../model/IDepartment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Component({
  selector: 'kt-list-department',
  templateUrl: './list-department.component.html',
  styleUrls: ['./list-department.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListDepartmentComponent implements OnInit {
  
  departmentList : IDepartment[];
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"

  constructor( private _departmentService: DepartmentService,
               public dialog: MatDialog,
               private cdRef: ChangeDetectorRef
             ) {
                 this.gridOptions = <GridOptions>(
                  { 
                    context : { componentParent : this } 
                  }
                 );
               }

  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name'},
    { headerName: 'Organization', field: 'orgnizationName', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'H.O.D', field: 'headOfDept', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Country', field: 'country', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'State', field: 'state', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'City', field: 'city', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Address', field: 'address', sortable: true, filter: true, tooltipField: 'name' },
  ];

  ngOnInit() {

    this.getDepartments()
    
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateDepartmentComponent, {
      width: '800px',
      data: id
    });
    // Recalling getDepartments function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getDepartments()
    });
  }

  getDepartments() : void {
    this._departmentService.getDepartments().subscribe((res: IPaginationResponse<IDepartment[]>) => {
      this.departmentList = res.result;
      this.cdRef.detectChanges()
    })
  }
}
