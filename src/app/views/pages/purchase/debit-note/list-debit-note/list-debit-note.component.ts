import { DEBIT_NOTE } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions, ICellRenderer, ICellRendererParams } from 'ag-grid-community';
import { DebitNoteService } from '../service/debit-note.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DocumentStatus } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-list-debit-note',
  templateUrl: './list-debit-note.component.html',
  styleUrls: ['./list-debit-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListDebitNoteComponent extends AppComponentBase implements OnInit {

  debitNoteList: any;
  defaultColDef: any;
  frameworkComponents: any;
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"

  constructor(
    private debitNoteService: DebitNoteService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
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
    { headerName: 'Debit Note #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status' },
    { headerName: 'Vendor Name', field: 'vendorName', sortable: true, filter: true, tooltipField: 'vendor' },
    {
      headerName: 'Note Date',
      field: 'noteDate',
      sortable: true,
      filter: true,
      tooltipField: 'vendor',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.noteDate != null ? params.data.noteDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      },
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'vendor',
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

    this.loadDebitNoteList();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  addDebitNote() {
    this.router.navigate(['/'+DEBIT_NOTE.CREATE]);
  }

  onRowDoubleClicked(event: any) {
    this.router.navigate(['/'+DEBIT_NOTE.ID_BASED_ROUTE('details',event.data.id) ]);
  }

  loadDebitNoteList() {
    this.debitNoteService.getDebitNotes().subscribe(
      (res) => {
        this.debitNoteList = res.result;
        this.cdRef.markForCheck();
      },
      (err: any) => {
        console.log(err)
      })
  }
}





