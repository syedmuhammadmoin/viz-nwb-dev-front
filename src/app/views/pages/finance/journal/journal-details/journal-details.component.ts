import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { JournalService } from '../services/journal.service';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { LayoutUtilsService } from 'src/app/core/_base/crud';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { JOURNAL_ENTRY } from 'src/app/views/shared/AppRoutes';
import { IJournal } from '../model/IJournal';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IJournalLines } from '../model/IJournalLines';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from 'src/app/views/shared/AppConst';

@Component({
  selector: 'kt-journal-details',
  templateUrl: './journal-details.component.html',
  styleUrls: ['./journal-details.component.scss'],
})

export class JournalDetailsComponent extends AppComponentBase implements OnInit {

  // Loader
  isLoading: boolean;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // need for routing
  JournalId: number;
  currentClient : any = {};
  public JournalRoute = JOURNAL_ENTRY

  // For ag grid
  gridOptions: any = ({} as GridOptions);
  defaultColDef: ColDef;
  

  // Detail Data
  JournalMaster: any;
  JournalLines: IJournalLines[] | any;

  // Showing Remarks
  remarksList: string[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private JournalService: JournalService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private layoutUtilService: LayoutUtilsService,
    injector: Injector
  ) {
    super(injector)
  }

  // Defining AG Grid Columns
  columnDefs = [
    {
      headerName: 'COA', field: 'accountName', filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Partner', field: 'businessPartnerName', filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Description', field: 'description', filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' }
    },
    {
      headerName: 'Debit', field: 'debit', filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Credit', field: 'credit', filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      }, cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Store',
      field: 'warehouseName',
      sortable: false,
      filter: true,
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
  ];

  ngOnInit(): void {
    this.currentClient = AppConst.ClientConfig.config
    this.gridOptions.rowStyle = { color: 'black' };
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.getJournalData(id);
        this.JournalId = id;
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

  private getJournalData(id: number) {
    this.JournalService.getJournalById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IJournal>) => {
        this.JournalMaster = res.result;
        this.JournalLines = res.result.JournalLines;
        this.remarksList = this.JournalMaster.remarksList ?? []
        this.cdRef.markForCheck();
      })
  }

  // Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    // Getting Updated Journal Entry Data
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.JournalService.workflow({ action, docId: this.JournalMaster.id, remarks })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.getJournalData(this.JournalId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Journal Entry');
      })
  }

  // Upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.JournalMaster,
        serviceClass: this.JournalService,
        functionName: 'uploadFile',
        name: 'Journal Entry'
      },
    }).afterClosed().subscribe(() => {
      this.getJournalData(this.JournalId)
      this.cdRef.detectChanges()
    })
  }
}
