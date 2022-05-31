import { WORKFLOW } from './../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppConst } from 'src/app/views/shared/AppConst';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { WorkflowService } from '../service/workflow.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IWorkflow } from '../model/IWorkflow';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  
export class ListWorkflowComponent extends AppComponentBase implements OnInit {

  workflowList: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;
  tooltipData: string = "double click to view details"
  components: { loadingCellRenderer (params: any ) : unknown };
  public permissions = Permissions;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  columnDefs = [
    //{ headerName: 'S.NO', valueGetter: 'node.rowIndex + 1', tooltipField: 'name', cellRenderer: "loadingCellRenderer" },
    { headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name', cellRenderer: "loadingCellRenderer" },
    {
      headerName: 'Doc Type',
      field: 'docType',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => {
      return (params.value || params.value === 0) ? AppConst.Documents.find(x => x.id === params.value).value : null
      }
    },
    {
      headerName: 'Active',
      field: 'isActive',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { return params.value ? 'Yes' : 'No' }
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
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.components = {
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }


  onRowDoubleClicked(event) {
    this.router.navigate(['/'+WORKFLOW.ID_BASED_ROUTE('edit',event.data.id)]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getWorkflows(params: any): Promise<IPaginationResponse<IWorkflow[]>> {
    const result = await  this.workflowService.getWorkflows(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getWorkflows(params);

     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }

     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'workflowPageName')
     this.cdRef.detectChanges();
   },
  };

  // loadWorkflowList() {
  //   this.workflowService.getWorkflows().subscribe(
  //     (res) => {
  //       this.workflowList = res.result;
  //       console.log(res.result)
  //       this.cdRef.detectChanges();
  //     },
  //     (err: any) => {
  //       console.log(err)
  //     })
  // }
}
