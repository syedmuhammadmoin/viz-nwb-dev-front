import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CreateDomicileComponent } from '../create-domicile/create-domicile.component';
import { IDomicile } from '../model/IDomicile';
import { DomicileService } from '../service/domicile.service';

@Component({
  selector: 'kt-list-domicile',
  templateUrl: './list-domicile.component.html',
  styleUrls: ['./list-domicile.component.scss']
})
export class ListDomicileComponent extends AppComponentBase implements OnInit {

  gridOptions: any;
  defaultColDef: any;
  tooltipData: string = "double click to edit"
  domicileList: IDomicile[] = [];
  frameworkComponents: any;
  components: { loadingCellRenderer(params: any): unknown };
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  columnDefs = [
    {
      headerName: 'Domicile',
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
      headerName: 'District',
      field: 'district',
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
  ]


  constructor(
    injector: Injector,
    private domicileService: DomicileService,
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
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      resizable: true,
      cellStyle: (params: ICellRendererParams) => {
        return (params?.data?.state === 1 || params?.data?.state === 5) ? { 'pointer-events': 'none', 'color': '#87837e' } : null;
      }
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

  getAllDomicile() {
    this.domicileService.getDomicileDropdown().subscribe((res) => {
      this.domicileList = res.result;
      this.cdRef.detectChanges()
    });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
      this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateDomicileComponent, {
      width: '740px',
      data: id
    });

    //Getting Updated Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    })
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getDomicile(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'DomicilePageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getDomicile(params: any): Promise<IPaginationResponse<IDomicile[]>> {
    const result = await this.domicileService.getRecords(params).toPromise()
    return result
  }
}
