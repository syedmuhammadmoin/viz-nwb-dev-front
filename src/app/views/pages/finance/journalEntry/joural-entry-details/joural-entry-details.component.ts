import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { JournalEntryService } from '../services/journal-entry.service';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { LayoutUtilsService } from 'src/app/core/_base/crud';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { JOURNAL_ENTRY } from 'src/app/views/shared/AppRoutes';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IJournalEntry } from '../model/IJournalEntry';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IJournalEntryLines } from '../model/IJournalEntryLines';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'kt-joural-entry-details',
  templateUrl: './joural-entry-details.component.html',
  styleUrls: ['./joural-entry-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class JouralEntryDetailsComponent extends AppComponentBase implements OnInit {

  //for busy loading
  isLoading: boolean;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //need for routing
  journalEntryId: number;

  public journalEntryRoute = JOURNAL_ENTRY

  //For ag grid
  gridOptions: GridOptions = ({} as GridOptions);
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};

  //Detail Data
  journalEntryMaster: any;
  journalEntryLines: IJournalEntryLines[];

  constructor(private activatedRoute: ActivatedRoute,
    private journalEntryService: JournalEntryService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private layoutUtilService: LayoutUtilsService,
    injector: Injector
  ) {
    super(injector)
  }


  columnDefs = [
    { headerName: 'Account', field: 'accountName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { headerName: 'Partner', field: 'businessPartnerName', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    { 
      headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: { 'font-size': '12px' } },
    {
      headerName: 'Debit', field: 'debit', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Credit', field: 'credit', sortable: true, filter: true, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { 
      headerName: 'Store', 
      field: 'warehouseName', 
      sortable: true, 
      filter: true, 
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ICellRendererParams) => {
        return params.value || 'N/A'
      }
    },
  ];

  ngOnInit(): void {

    this.gridOptions.rowStyle = { color: 'black' };
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.getJournalEntryData(id);
        this.journalEntryId = id;
        this.cdRef.markForCheck();
      } else {
        this.layoutUtilService.showActionNotification('Cannot find record with out id parameter', null, 5000, true, false)
        this.router.navigate(['/' + JOURNAL_ENTRY.LIST])
      }
    });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  private getJournalEntryData(id: number) {
    this.journalEntryService.getJournalEntryById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IJournalEntry>) => {
      this.journalEntryMaster = res.result;
      this.journalEntryLines = res.result.journalEntryLines
      this.cdRef.markForCheck();
    })
  }

  workflow(action: number) {
    this.isLoading = true
    this.journalEntryService.workflow({ action, docId: this.journalEntryMaster.id })
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getJournalEntryData(this.journalEntryId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Journal Entry');
      })
  }
}


