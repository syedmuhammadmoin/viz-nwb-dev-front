import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AccessManagementService } from '../../service/access-management.service';
import { CreateRoleComponent } from '../create-role/create-role.component';

@Component({
  selector: 'kt-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
  
export class RoleListComponent extends AppComponentBase implements OnInit {

  gridOptions: any;
  frameworkComponents: any;
  defaultColDef: any;
  permissions = Permissions
  roleList: any;
  tooltipData: string = "double click to edit"
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


  columnDefs = [
    { 
      headerName: 'S.No', 
      //valueGetter: 'node.rowIndex + 1', 
      field: 'index',
      tooltipField: 'name',
      suppressMenu: true,
    },
    { 
      headerName: 'Role Name', 
      field: 'name', 
      tooltipField: 'name',
      menuTabs: ['filterMenuTab'],
      filter: 'agTextColumnFilter',
      filterParams : {
        filterOptions: ['contains'],
        suppressAndOrCondition: true
      }
    },
  ];
  constructor(
    private accessManagementService: AccessManagementService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  ngOnInit() {
    this.getRoles();
    // this.gridOptions.rowHeight = 30;
    // this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: 'agSetColumnFilter' 
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };

    if(!this.permission.isGranted(this.permissions.AUTH_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }

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
      this.roleList = res.result
      if (res.result) res.result.map((data: any, i: number) => data.index = i + 1)
      this.cdRef.detectChanges();
    });
  }
}



