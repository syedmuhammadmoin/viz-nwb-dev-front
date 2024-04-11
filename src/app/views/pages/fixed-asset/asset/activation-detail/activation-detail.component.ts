import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { isEmpty } from 'lodash';
import { AssetService } from '../service/asset.service';


@Component({
  selector: 'kt-activation-detail',
  templateUrl: './activation-detail.component.html',
  styleUrls: ['./activation-detail.component.scss']
})
export class ActivationDetailComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean

  title: string = 'Activation Detail'
  rowData: any = [];

  // 
  gridOptions: any;
  defaultColDef: ColDef;
  gridApi: GridApi;
  gridColumnApi: any;
  components: any;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    public assetService: AssetService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() public dialogRef: MatDialogRef<ActivationDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private fixedAssetLines: any,
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
      suppressHeaderMenuButton: true,
      width: 100,
      cellRenderer: "loadingCellRenderer",
    },
    {
      headerName: 'Active Date',
      field: 'activeDate',
      cellStyle: { textAlign: 'left' },
      suppressHeaderMenuButton: true,
      cellRenderer: (params: any) => {
        const date = params?.data?.activeDate != null ? params?.data?.activeDate : null;
        return date == null ? 'N/A' : this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'In Active Date',
      field: 'inactiveDate',
      cellStyle: { textAlign: 'left' },
      suppressHeaderMenuButton: true,
      cellRenderer: (params: any) => {
        const date = params?.data?.inactiveDate != null ? params?.data?.inactiveDate : null;
        return date == null ? 'N/A' : this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Active Days',
      field: 'activeDays',
      suppressHeaderMenuButton: true,
      cellStyle: { textAlign: 'left' }
    }
  ];

  ngOnInit() {

    if (!isEmpty(this.fixedAssetLines)) {
      this.rowData = this.fixedAssetLines;
      this.gridApi?.sizeColumnsToFit();
      this.gridApi?.hideOverlay();
    }
    else {
      this.gridApi?.showNoRowsOverlay()
    }
    this.cdRef.detectChanges();
    this.defaultColDef = {
      sortable: false,
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
}
