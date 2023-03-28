import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FirstDataRenderedEvent, GridOptions, RowDoubleClickedEvent} from 'ag-grid-community';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {ACCESS_MANAGEMENT, APP_ROUTES} from 'src/app/views/shared/AppRoutes';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {AccessManagementService} from '../../service/access-management.service';
import {CreateRoleComponent} from '../create-role/create-role.component';

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
  tooltipData: string = 'double click to edit'
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


  //Defining Ag Grid Columns
  columnDefs = [
    {
      headerName: 'S.No',
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
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true
      }
    },
  ];

  //Injecting Dependencies
  constructor(
    private accessManagementService: AccessManagementService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: {componentParent: this}
      }
    );
  }

  ngOnInit() {
    //Get Roles Data
    this.getRoles();

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: 'agSetColumnFilter'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    if (!this.permission.isGranted(this.permissions.AUTH_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }

  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.createRoleDialog(event.data.id);
  }

  createRoleDialog(id?: any): void {
    const dialogRef = this.dialog.open(CreateRoleComponent, {
      width: '840px',
      data: id
    });
    //Get Updated Roles Data on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getRoles();
    });
  }

  getRoles() {
    this.accessManagementService.getRoles().subscribe((res: any) => {
      this.roleList = res.result
      //Setting Seriol Nos of rows in Grid
      if (res.result) res.result.map((data: any, i: number) => data.index = i + 1)
      this.cdRef.detectChanges();
    });
  }

  printPermission() {
    this.router.navigate(['/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.ROLE_PERMISSIONS])
  }
}
