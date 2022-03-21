import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AccessManagementService } from '../../service/access-management.service';
import { CreateRoleComponent } from '../create-role/create-role.component';

@Component({
  selector: 'kt-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
  
export class RoleListComponent implements OnInit {

  gridOptions: any;
  frameworkComponents: any;
  defaultColDef: any;
  roleList: any;
  tooltipData: string = "double click to edit"

  columnDefs = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', tooltipField: 'name' },
    { headerName: 'Role Name', field: 'name', sortable: true, filter: true, tooltipField: 'name' },
    // { headerName: 'Claims', field: 'claims', sortable: true, filter: true },
  ];
  constructor(
    private accessManagementService: AccessManagementService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  ngOnInit() {
    this.getRoles();
    // this.gridOptions.rowHeight = 40;
    // this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: false
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event) {
    this.createRoleDialog(event.data.id);
  }

  createRoleDialog(id?: any): void {
    const dialogRef = this.dialog.open(CreateRoleComponent, {
      width: '840px',
      data: id
    });
    // Recalling getInvoiceMasterData function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getRoles();
    });
  }

  getRoles() {
    this.accessManagementService.getRoles().subscribe((res: any) => {
      console.log(res);
      this.roleList = res.result
      this.cdRef.detectChanges();
    });
  }
}



