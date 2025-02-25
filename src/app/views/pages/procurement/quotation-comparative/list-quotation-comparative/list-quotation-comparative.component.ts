import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { QUOTATION_COMPARATIVE } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IQuotationComparative } from '../model/IQuotationComparative';
import { QuotationComparativeService } from '../service/quotation-comparative.service';

@Component({
  selector: 'kt-list-quotation-comparative',
  templateUrl: './list-quotation-comparative.component.html',
  styleUrls: ['./list-quotation-comparative.component.scss']
})

export class ListQuotationComparativeComponent extends AppComponentBase implements OnInit {

  quotationComparativeList: IQuotationComparative[];
  defaultColDef: ColDef;
  
  gridOptions: any;
  tooltipData: string = "double click to view detail"
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private quotationComparativeService: QuotationComparativeService,
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

  //Defining Quotation Comparative Columns
  columnDefs = [
    {
      headerName: 'Quotation Comparative #',
      field: 'docNo',
      tooltipField: 'docNo',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Quotation Comparative Date',
      field: 'quotationComparativeDate',
      tooltipField: 'docNo',
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
      headerName: 'Remarks',
      field: 'remarks',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          values: ['Draft', 'Rejected', 'Unpaid', 'Partial', 'Paid', 'Submitted', 'Reviewed'],
          defaultToNothingSelected: true,
          suppressSorting:true,
          suppressSelectAll: true,
          suppressAndOrCondition: true,
        },
    },
  ];

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: "double click to view detail",
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
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  addQuotationComparative() {
    this.router.navigate(['/' + QUOTATION_COMPARATIVE.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + QUOTATION_COMPARATIVE.ID_BASED_ROUTE('details', event.data.id)]);
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    var dataSource = {
      getRows: (params: any) => {
        this.quotationComparativeService.getRecords(params).subscribe((data) => {
          if(isEmpty(data.result)) {
            this.gridApi.showNoRowsOverlay()
          } else {
            this.gridApi.hideOverlay();
          }
          params.successCallback(data.result || 0, data.totalRecords);
          this.paginationHelper.goToPage(this.gridApi, 'quotationComparativePageName')
          this.cdRef.detectChanges();
        });
      },
    };
    params.api.setGridOption('datasource', dataSource);
  }
}
