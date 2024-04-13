import { WORKFLOW } from './../../../../shared/AppRoutes';
import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppConst } from 'src/app/views/shared/AppConst';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { WorkflowService } from '../service/workflow.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IWorkflow } from '../model/IWorkflow';
import { isEmpty } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss']
})

export class ListWorkflowComponent extends AppComponentBase implements OnInit {

  workflowList: any;
  
  gridOptions: any;
  defaultColDef: any;
  tooltipData: string = "double click to view details"
  components: any;
  public permissions = Permissions;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Document Type',
      field: 'docType',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
      return (params.value || params.value === 0) ? AppConst.Documents.find(x => x.id === params.value).value : null
      }
    },
    {
      headerName: 'Active',
      field: 'isActive',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => { return params.value ? 'Yes' : 'No' }
    },
  ];

  constructor(
    private workflowService: WorkflowService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {

    super(injector)

    //for tooltip dynamic massage
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }

    );
  }
  ngOnInit() {
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: "double click to edit",
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
    }

    this.components = {
      customTooltip: CustomTooltipComponent,
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if(!this.permission.isGranted(this.permissions.WORKFLOW_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }


  onRowDoubleClicked(event) {
    this.router.navigate(['/'+WORKFLOW.ID_BASED_ROUTE('edit',event.data.id)]);
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getWorkflows(params);
      if(isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'workflowPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getWorkflows(params: any): Promise<IPaginationResponse<IWorkflow[]>> {
    const result = await firstValueFrom(this.workflowService.getRecords(params));
    return result
  }
}
