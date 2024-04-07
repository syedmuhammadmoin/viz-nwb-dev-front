import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { LayoutUtilsService } from 'src/app/core/_base/crud';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { PETTY_CASH } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';
import { MatDialog } from '@angular/material/dialog';
import { PettyCashService } from '../service/petty-cash.service';
import { IPettyCashEntry } from '../model/IPettyCashEntry';
import { IPettyCashEntryLines } from '../model/IPettyCashEntryLines';
import { AppConst } from 'src/app/views/shared/AppConst';


@Component({
  selector: 'kt-petty-cash-details',
  templateUrl: './petty-cash-details.component.html',
  styleUrls: ['./petty-cash-details.component.scss']
})
export class PettyCashDetailsComponent extends AppComponentBase implements OnInit {

  // Loader
  isLoading: boolean;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // need for routing
  pettycashEntryId: number;

  public pettyEntryRoute = PETTY_CASH  
  currentClient : any = {};
  // For ag grid
  gridOptions: GridOptions = ({} as GridOptions);
  defaultColDef: ColDef;
  frameworkComponents: { [p: string]: unknown };

  // Detail Data  
  pettyEntryMaster: any; 
  pettycashEntryLines: IPettyCashEntryLines[] | any; 

  // Showing Remarks
  remarksList: string[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private pettyEntryService: PettyCashService, 
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
      headerName: 'Account Head', field: 'accountName', filter: 'agTextColumnFilter',
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
      headerName: 'Date',
      field: 'date',
      sortable: true,
      filter: true,
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
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
        this.getPettyEntryData(id);
        this.pettycashEntryId = id;
        this.cdRef.markForCheck();
      } else {
        this.layoutUtilService.showActionNotification('Cannot find record with out id parameter', null, 5000, true, false)
        this.router.navigate(['/' + PETTY_CASH.LIST])
      }
    });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
  
  private getPettyEntryData(id: number) {
    this.pettyEntryService.getPettyCashEntryById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IPettyCashEntry>) => {
        this.pettyEntryMaster = res.result;
        this.pettycashEntryLines = res.result.pettyCashLines;
        this.remarksList = this.pettyEntryMaster.remarksList ?? []
        this.cdRef.markForCheck();
      })
  }

  // Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    // Getting Updated Petty Entry Data
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.pettyEntryService.workflow({ action, docId: this.pettyEntryMaster.id, remarks })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.getPettyEntryData(this.pettycashEntryId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Petty Cash Entry');
      })
  }

  // Upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.pettyEntryMaster,
        serviceClass: this.pettyEntryService,
        functionName: 'uploadFile',
        name: 'Petty Cash'
      },
    }).afterClosed().subscribe(() => {
      this.getPettyEntryData(this.pettycashEntryId)
      this.cdRef.detectChanges()
    })
  }
}
