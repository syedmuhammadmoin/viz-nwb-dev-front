import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { PaymentService } from '../service/payment.service';
import { DocType, DocumentStatus, Permissions } from 'src/app/views/shared/AppEnum';
import { MatDialog } from '@angular/material/dialog';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';
import { PAYMENT } from 'src/app/views/shared/AppRoutes';
import { IPayment } from '../model/IPayment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Component({
  selector: 'kt-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListPaymentComponent extends AppComponentBase implements OnInit, OnDestroy {

  public permissions = Permissions;
  docType = DocType

  paymentList: IPayment[];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"

  //subscription
  subscription$: Subscription

  constructor(private paymentService: PaymentService,
    private router: Router,
    public dialog: MatDialog,
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

  //ag-Grid Columns
  columnDefs = [
    { headerName: 'Doc #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status' },
    // { headerName: 'Payment No.', field: 'docNo', sortable: true, filter: true ,tooltipField: 'status' },
    { headerName: 'Business Partner', field: 'businessPartnerName', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Payment Date',
      field: 'paymentDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.paymentDate != null ? params.data.paymentDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Discount',
      field: 'discount',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'sales Tax',
      field: 'salesTax',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Income Tax',
      field: 'incomeTax',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Net Payment', field: 'netPayment', sortable: true, filter: true, tooltipField: 'status',
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

  ngOnInit(): void {

    this.getPayments()

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };
  }

  ngOnDestroy() {
    if (this.subscription$) this.subscription$.unsubscribe()
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + PAYMENT.ID_BASED_ROUTE('details', event.data.id)]);
  }

  addPaymentDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreatePaymentComponent, {
      width: '800px',
      data: id
    });
    // Recalling getPaymets function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getPayments();
    });
  }

  getPayments() {
    this.subscription$ = this.paymentService.getPayments().subscribe((res: IPaginationResponse<IPayment[]>) => {
        this.paymentList = res.result;
        this.cdRef.detectChanges()
      })
  }
}
