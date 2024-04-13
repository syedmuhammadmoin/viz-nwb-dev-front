import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {MatDialog} from '@angular/material/dialog';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions, GridReadyEvent,
  RowDoubleClickedEvent,
  ValueFormatterParams
} from 'ag-grid-community';
import {Permissions} from '../../../../shared/AppEnum';
import {isEmpty} from 'lodash';
import {CustomTooltipComponent} from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {AdmissionCriteriaService} from '../services/admission-criteria.service';
import {IAdmissionCriteria} from '../model/IAdmissionCriteria';
import {CreateAdmissionCriteriaComponent} from '../create-admission-criteria/create-admission-criteria.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-admission-criteria',
  templateUrl: './list-admission-criteria.component.html',
  styleUrls: ['./list-admission-criteria.component.scss']
})
export class ListAdmissionCriteriaComponent extends AppComponentBase implements OnInit {

// Injecting Dependencies
  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private admissionCriteriaService: AdmissionCriteriaService,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }


// Loader
  isLoading: boolean;

// For AG Grid..
  admissionCriteriaList: IAdmissionCriteria[];
  gridOptions: any;
  defaultColDef: ColDef;
  public permissions = Permissions;
  
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


// Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'Program',
      field: 'program',
      tooltipField: 'program',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Description',
      field: 'description',
      tooltipField: 'program',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Qualification',
      field: 'qualification',
      tooltipField: 'program',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Subject',
      field: 'subject',
      tooltipField: 'program',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Required Marks',
      field: 'qualificationRequriedMarks',
      tooltipField: 'program',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Entry Test Required',
      field: 'isEntryTestRequired',
      tooltipField: 'program',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params) => params.value === true ? 'Yes' : 'No'
    },
    {
      headerName: 'Entry Test Required Marks',
      field: 'entryTestRequriedMarks',
      tooltipField: 'program',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Entry Test Date',
      field: 'entryTestDate',
      tooltipField: 'program',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Interview Required',
      field: 'isInterviewRequired',
      tooltipField: 'program',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params) => params.value === true ? 'Yes' : 'No'
    },
    {
      headerName: 'Interview Date',
      field: 'interviewDate',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
  ];

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getAdmissionCriteria(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'AdmissionCriteriaPageName');
      this.cdRef.detectChanges();
    },
  };

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: 'double click to edit'
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
      loadingCellRenderer(params: any) {
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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
    // this.router.navigate(['/' + BATCH.ID_BASED_ROUTE('details', event.data.id)]);
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateAdmissionCriteriaComponent, {
      width: '800px',
      data: id
    });
    // Getting Updated Warehouse
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getAdmissionCriteria(params: any): Promise<IPaginationResponse<IAdmissionCriteria[]>> {
    const result = await firstValueFrom(this.admissionCriteriaService.getRecords(params));
    return result
  }
}
