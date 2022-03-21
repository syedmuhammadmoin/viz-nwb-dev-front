import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateStatusComponent } from '../create-status/create-status.component';
import { IStatus } from '../model/IStatus';
import { StatusService } from '../service/status.service';

@Component({
  selector: 'kt-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  
export class ListStatusComponent extends AppComponentBase implements OnInit {

  gridOptions: any;
  defaultColDef: any;
  tooltipData: string = "double click to edit"
  statusList: IStatus[] = [];
  frameworkComponents: any;

  columnDefs = [
    { headerName: "S.No", valueGetter: 'node.rowIndex + 1', tooltipField: 'status' },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'State',
      field: 'state',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params) => { return AppConst.DocStatus[params.value].viewValue }
    },
  ]


  constructor(
    injector: Injector,
    private statusService: StatusService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  ngOnInit() {
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };
    this.getAllStatus();
  }

  getAllStatus() {
    this.statusService.getStatuses().subscribe((res) => {
      this.statusList = res.result;
      this.cdRef.detectChanges()
    });
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: any) {
    console.log(event);
    this.addStatusDialog(event.data.id)
  }

  addStatusDialog(id?) {
    const dialogRef = this.dialog.open(CreateStatusComponent, {
      width: '740px',
      data: id
    });
    // Recalling getStates function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.statusService.getStatuses().subscribe((res) => {
        this.statusList = res.result;
        this.cdRef.detectChanges();
      })
    })
  }

}
