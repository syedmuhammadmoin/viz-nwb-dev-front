import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AccessManagementService } from '../../service/access-management.service';
import { CreateUserComponent } from '../create-user/create-user.component';

@Component({
  selector: 'kt-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
  
export class UserListComponent implements OnInit {

  gridOptions: any;
  frameworkComponents: any;
  defaultColDef: any;
  userList: any;
  tooltipData: string = "double click to edit"

  columnDefs = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', tooltipField: 'userName' },
    { headerName: 'User Name', field: 'userName', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Email', field: 'email', sortable: true, filter: true, tooltipField: 'name' },
  ];


  constructor (
    private accessManagementService: AccessManagementService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
   }

  ngOnInit() {
    this.getUsers();
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
    this.createUserDialog(event.data.id);
  }

  createUserDialog(id?: any): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      // height: '750px',
      data: id
    });
    // Recalling getInvoiceMasterData function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }

  getUsers() {
    this.accessManagementService.getUsers().subscribe((res: any) => {
      console.log(res);
      this.userList = res.result
      this.cdRef.detectChanges();
    });
  }
}



