import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/Dialog'
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AssetType, Permissions } from 'src/app/views/shared/AppEnum';
import { IProgram } from '../model/Iprogram';
import { ProgramService } from '../service/program.service';
import { CWIP } from 'src/app/views/shared/AppRoutes';
import { isEmpty } from 'lodash';
import { CreateProgramComponent } from '../create-program/create-program.component';

@Component({
  selector: 'kt-list-program',
  templateUrl: './list-program.component.html',
  styleUrls: ['./list-program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListProgramComponent extends AppComponentBase implements OnInit{

  defaultColDef: ColDef;
  gridOptions: GridOptions;
  ProgramList: IProgram[];
  frameworkComponents: {[p: string]: unknown};
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  // Injecting dependencies
  constructor(
    private programService: ProgramService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  // Declaring AgGrid data
  columnDefs = [
    { 
      headerName: 'Doc No', 
      field: 'cwipCode', 
      tooltipField: 'name', 
      cellRenderer: "loadingCellRenderer", 
      // filter: 'agTextColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['contains'],
      //     suppressAndOrCondition: true,
      //   },
    },
    { 
      headerName: 'Acquisition Date', 
      field: 'dateOfAcquisition', 
      tooltipField: 'name', 
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => { 
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    { 
      headerName: 'Asset Cost', 
      field: 'cost', 
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      } 
      
    },
    {
      headerName: 'Asset Account',
      field: 'assetAccount',
      tooltipField: 'name',
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Salvage Value',
      field: 'salvageValue',
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Dep Applicability',
      field: 'depreciationApplicability',
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value){
          return 'Applicable'
        }
        else{
          return 'Not Applicable'
        }
        // return params.value ?? 'N/A'
      }
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
    {
      headerName: 'Status',
      field: 'status',
      tooltipField: 'name',
      // valueFormatter: (params: ValueFormatterParams) => {
      //   if(params.value){
      //     return 'Applicable'
      //   }
      //   else{
      //     return 'Not Applicable'
      //   }
      // }
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    }
  ];


  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: "double click to view detail",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
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

  onRowDoubleClicked(event : RowDoubleClickedEvent){
    this.router.navigate(['/' + CWIP.ID_BASED_ROUTE('details' , event.data.id)])
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateProgramComponent, {
      width: '800px',
      data: id
    });
    // Recalling getBusinessPartners function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      // this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }



  dataSource = {
    // getRows: (params: any) => {
    //   this.programService.getRecords(params).subscribe((data) => {
    //     if(isEmpty(data.result)) {  
    //       this.gridApi.showNoRowsOverlay() 
    //     } else {
    //       this.gridApi.hideOverlay();
    //     }
    //     params.successCallback(data.result || 0, data.totalRecords);
    //     this.paginationHelper.goToPage(this.gridApi, 'CWIPPageName')
    //     this.cdRef.detectChanges();
    //   });
    // },
  };

  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.setDatasource(this.dataSource);
  }
}