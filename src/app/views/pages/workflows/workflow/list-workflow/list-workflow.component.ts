import { WORKFLOW } from './../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { AppConst } from 'src/app/views/shared/AppConst';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { WorkflowService } from '../service/workflow.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  
export class ListWorkflowComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;
  workflowList: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;
  tooltipData: string = "double click to view details"

  columnDefs = [
    { headerName: 'S.NO', valueGetter: 'node.rowIndex + 1', tooltipField: 'name' },
    { headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name' },
    {
      headerName: 'Doc Type',
      field: 'docType',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params) => {
        return AppConst.Documents.find(x => x.id === params.value).value
      }
    },
    {
      headerName: 'Active',
      field: 'isActive',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params) => { return params.value ? 'Yes' : 'No' }
    },
  ];

  constructor(
    private workflowService: WorkflowService,
    private router: Router,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {

    super(injector)

    this.defaultColDef = { resizable: true };
    //for tooltip dynamic massage
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }

    );
  }
  ngOnInit() {
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = { customTooltip: CustomTooltipComponent };

    this.loadWorkflowList();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }


  onRowDoubleClicked(event) {
    this.router.navigate(['/'+WORKFLOW.ID_BASED_ROUTE('edit',event.data.id)]);
  }

  loadWorkflowList() {
    this.workflowService.getWorkflows().subscribe(
      (res) => {
        this.workflowList = res.result;
        console.log(res.result)
        this.cdRef.detectChanges();
      },
      (err: any) => {
        console.log(err)
      })
  }

}
