import { BILL } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions, ICellRendererParams } from 'ag-grid-community';
import { VendorBillService } from '../services/vendor-bill.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from "../../../../shared/app-component-base";
import { DocumentStatus } from 'src/app/views/shared/AppEnum';


@Component({
  selector: 'kt-list-vendor-bill',
  templateUrl: './list-vendor-bill.component.html',
  styleUrls: ['./list-vendor-bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListVendorBillComponent extends AppComponentBase implements OnInit {

  vendorBillList: any;
  gridOptions: GridOptions;
  frameworkComponents: any;
  defaultColDef: any;
  tooltipData: string = "double click to view detail"

  constructor(private router: Router,
    private vendorBillService: VendorBillService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  columnDefs = [
    { headerName: 'Bill #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status' },
    { headerName: 'Vendor Name', field: 'vendorName', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Bill',
      field: 'billDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.billDate != null ? params.data.billDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      },
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.dueDate != null ? params.data.dueDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      },
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'status',
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'status', 
      cellRenderer: (params: ICellRendererParams) => {
        return DocumentStatus[params.data.status]
      }
    },
  ];

  ngOnInit() {
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };

    this.loadVendorBillList();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  addVendorBill() {
    this.router.navigate(['/'+BILL.CREATE]);
  }

  onRowDoubleClicked(event: any) {
    this.router.navigate(['/'+BILL.ID_BASED_ROUTE('details',event.data.id) ]);
  }

  loadVendorBillList() {
    this.vendorBillService.getVendorBills().subscribe(
      (res) => {
        this.vendorBillList = res.result;
        this.cdRef.markForCheck();
      },
      (err) => {
        console.log(err)
      }
    )
  }

  agingReport() {
    this.router.navigate(['/'+BILL.AGING_REPORT]);
  }
}


