import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { DesignationService } from '../service/designation.service';
import { CreateDesignationComponent } from '../create-designation/create-designation.component';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from 'src/app/views/shared/AppConst';
import { firstValueFrom } from 'rxjs';
  
@Component({
  selector: 'kt-list-designation',
  templateUrl: './list-designation.component.html',
  styleUrls: ['./list-designation.component.scss']
})

export class ListDesignationComponent extends AppComponentBase implements OnInit {
  
    designationList: [];
    public permissions = Permissions;
    defaultColDef: ColDef;
    
    gridOptions: any;
    components: any;
    gridApi: GridApi;
    overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
 
  
    constructor(
      private designationService: DesignationService,
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
    public currentClient : any ={};
    columnDefs = [
      { 
        headerName: 'Name', 
        field: 'name', 
        cellRenderer: "loadingCellRenderer",
        filter: 'agTextColumnFilter',
          menuTabs: ['filterMenuTab'],
          filterParams: {
            filterOptions: ['contains'],
            suppressAndOrCondition: true,
        },
      },
    ];
  
    ngOnInit() {
      this.currentClient = AppConst.ClientConfig.config     
      this.gridOptions = {
        cacheBlockSize: 20,
        rowModelType: "infinite",
        paginationPageSize: 10,
        paginationPageSizeSelector: false,
        pagination: true,
        rowHeight: 30,
        headerHeight: 35,
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

    dataSource = {
      getRows: async (params: any) => {
       const res = await this.getDesignations(params);
       if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.gridApi.hideOverlay();
      }
       params.successCallback(res.result || 0, res.totalRecords);
       this.paginationHelper.goToPage(this.gridApi, 'designationPageName');
       this.cdRef.detectChanges();
     },
    };
  
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      params.api.setGridOption('datasource', this.dataSource);
    }
  
    async getDesignations(params: any): Promise<IPaginationResponse<[]>> {
      const result = await firstValueFrom(this.designationService.getRecords(params));
      return result
    }

    onRowDoubleClicked(event : RowDoubleClickedEvent) {
      this.openDialog(event.data.id)
    }
  
    openDialog(id?: number): void {
      const dialogRef = this.dialog.open(CreateDesignationComponent, {
        width: '800px',
        data: id
      });
      //Getting Updated Warehouse
      dialogRef.afterClosed().subscribe(() => {
        this.gridApi.setGridOption('datasource', this.dataSource);
        this.cdRef.detectChanges();
      });
  }
  
  
  
  
}
  
  








