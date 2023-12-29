import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { isEmpty } from 'lodash';
import { AssetService } from '../service/asset.service';
import { IAsset } from '../model/IAsset';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Component({
  selector: 'kt-schedule-depreciation',
  templateUrl: './schedule-depreciation.component.html',
  styleUrls: ['./schedule-depreciation.component.scss']
})
export class ScheduleDepreciationComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean

  title: string = 'Depreciation Schedule'
  rowData: any = [];

  // frameworkComponents: { [p: string]: unknown };
  gridOptions: GridOptions;
  defaultColDef: ColDef;
  gridApi: GridApi;
  gridColumnApi: any;
  components: { loadingCellRenderer (params: any ) : unknown };
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    public assetService: AssetService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() public dialogRef: MatDialogRef<ScheduleDepreciationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  //Defining Employee Columns
  columnDefs = [
    {
      headerName: '#', 
      valueGetter: 'node.rowIndex + 1', 
      suppressMenu: true,
      width: 100,
      cellRenderer: "loadingCellRenderer",
    },
    {
      headerName: 'Transaction Date',
      field: 'transectionDate',
      cellStyle: { textAlign: 'left' },
      suppressMenu: true,
      cellRenderer: (params: any) => {
        const date = params?.data?.transectionDate != null ? params?.data?.transectionDate : null;
        return date == null ? null : this.transformDate(date, 'MMM d, y');
      }
    },

    {
      headerName: 'Begining Book Value',
      field: 'beginingBookValue',
      valueFormatter: (params) => this.valueFormatter(params.value),
      cellStyle: { textAlign: 'left' },
      suppressMenu: true,
    },
    {
      headerName: 'Depreciation Amount',
      field: 'depreciationAmount',
      suppressMenu: true,
      valueFormatter: (params) => this.valueFormatter(params.value),
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: 'Ending Book Value',
      field: 'endingBookValue',
      suppressMenu: true,
      valueFormatter: (params) => this.valueFormatter(params.value),
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: 'Description',
      field: 'description',
      suppressMenu: true,
      cellStyle: { textAlign: 'left' },
      width: 300,
    }
  ];

  async ngOnInit() {

    this.isLoading = true;
    var res = await this.getDepSchedule();
    if (!isEmpty(res.result?.["depriecaitonRegisterList"])) {
      this.rowData = res.result?.["depriecaitonRegisterList"];
      this.gridApi?.sizeColumnsToFit();
      this.gridApi?.hideOverlay();
    }
    else {
      this.gridApi?.showNoRowsOverlay()
    }
    this.isLoading = false;
    this.cdRef.detectChanges();
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
    }

    this.components = {
      loadingCellRenderer: function (params) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
  
  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  async getDepSchedule(): Promise<IApiResponse<any[]>> {
    const result = await this.assetService.getDepreciationSchedule(this._id).toPromise()
    return result
  }
}