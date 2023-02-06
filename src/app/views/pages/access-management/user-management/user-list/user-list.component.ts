import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirstDataRenderedEvent, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AccessManagementService } from '../../service/access-management.service';
import { CreateUserComponent } from '../create-user/create-user.component';

@Component({
  selector: 'kt-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
  
export class UserListComponent extends AppComponentBase implements OnInit {

  gridOptions: any;
  frameworkComponents: any;
  defaultColDef: any;
  userList: any;
  permissions = Permissions
  tooltipData: string = "double click to edit"
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


  //Defining Ag Grid Columns
  columnDefs = [
    { 
      headerName: 'S.No', 
      field: 'index', 
      tooltipField: 'email', 
      suppressMenu: true
    },
    { 
      headerName: 'User Name', 
      field: 'name', 
      tooltipField: 'email',
      menuTabs: ['filterMenuTab'],
      filter: 'agTextColumnFilter',
      filterParams : {
        filterOptions: ['contains'],
        suppressAndOrCondition: true
      }
     },
    { headerName: 'Email', field: 'email', suppressMenu: true, },
  ];

  //Injecting Dependencies
  constructor (
    private accessManagementService: AccessManagementService,
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
   }

  ngOnInit() {
    //Get Users Data
    this.getUsers();

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
      filter: 'agSetColumnFilter'
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };

    //Change content On Behave of Permissions
    if(!this.permission.isGranted(this.permissions.AUTH_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.createUserDialog(event.data.id);
  }

  //Modal
  createUserDialog(id?: any): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      data: id
    });
    //Get Updated User Data on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }

  getUsers() {
    this.accessManagementService.getUsers().subscribe((res: any) => {
      this.userList = res.result;
      //Setting Seriol Nos of rows in Grid
      if (res.result) res.result.map((data: any, i: number) => data.index = i + 1)
      this.cdRef.detectChanges();
    });
  }
}



