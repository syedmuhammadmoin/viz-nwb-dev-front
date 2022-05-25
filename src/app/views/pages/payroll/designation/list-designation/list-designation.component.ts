import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { DesignationService } from '../service/designation.service';
  
@Component({
  selector: 'kt-list-designation',
  templateUrl: './list-designation.component.html',
  styleUrls: ['./list-designation.component.scss']
})

export class ListDesignationComponent extends AppComponentBase implements OnInit {
  
    designationList: [];
    defaultColDef: ColDef;
    frameworkComponents: {[p: string]: unknown};
    gridOptions: GridOptions;
    //tooltipData: string = "double click to view detail"
    components: { loadingCellRenderer (params: any ) : unknown };
    gridApi: GridApi;
    gridColumnApi: ColumnApi;
    overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
    constructor(
      private designationService: DesignationService,
      private router: Router,
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
  
    columnDefs = [
      { headerName: 'Name', field: 'name', sortable: true, filter: true , cellRenderer: "loadingCellRenderer" },
    ];
  
    ngOnInit() {
      
      this.gridOptions = {
        cacheBlockSize: 20,
        rowModelType: "infinite",
        paginationPageSize: 10,
        pagination: true,
        rowHeight: 40,
        headerHeight: 35,
        //context: "double click to edit",
      };
  
      //this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  
      // this.defaultColDef = {
      //   tooltipComponent: 'customTooltip'
      // }
  
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
  
    onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.sizeColumnsToFit();
    }
  
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.setDatasource(this.dataSource);
    }
  
    async getDesignations(params: any): Promise<IPaginationResponse<[]>> {
      const result = await this.designationService.getDesignations(params).toPromise()
      return result
    }
  
    dataSource = {
      getRows: async (params: any) => {
       const res = await this.getDesignations(params);
  
       if (!res.result) { 
        this.gridApi.showNoRowsOverlay() 
      } else {
       this.gridApi.hideOverlay();
      }
       //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
       params.successCallback(res.result || 0, res.totalRecords);
       this.paginationHelper.goToPage(this.gridApi, 'designationPageName')
       this.cdRef.detectChanges();
     },
    };
  }
  
  
  
  
  
  
  








