import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {ActionButton, DocType, DocumentStatus, Permissions} from '../../../../shared/AppEnum';
import {DEPRECIATION_ADJUSTMENT, JOURNAL_ENTRY} from '../../../../shared/AppRoutes';
import {ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams} from 'ag-grid-community';
import {IJournalEntryLines} from '../../../finance/journalEntry/model/IJournalEntryLines';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {JournalEntryService} from '../../../finance/journalEntry/services/journal-entry.service';
import {MatDialog} from '@angular/material/dialog';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {finalize, take} from 'rxjs/operators';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IJournalEntry} from '../../../finance/journalEntry/model/IJournalEntry';
import {CustomRemarksComponent} from '../../../../shared/components/custom-remarks/custom-remarks.component';
import {CustomUploadFileComponent} from '../../../../shared/components/custom-upload-file/custom-upload-file.component';
import {IDepreciationAdjustment, IDepreciationAdjustmentLines, IRemarksList} from '../model/IDepreciationAdjustment';
import {DepreciationAdjustmentService} from '../service/depreciation-adjustment.service';

@Component({
  selector: 'kt-detail-asset-adjustment',
  templateUrl: './detail-depreciation-adjustment.component.html',
  styleUrls: ['./detail-depreciation-adjustment.component.scss']
})
export class DetailDepreciationAdjustmentComponent extends AppComponentBase implements OnInit {

  // Loader
  isLoading: boolean;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // need for routing
  depreciationAdjustmentId: number;

  public depreciationAdjustmentRoute = DEPRECIATION_ADJUSTMENT

  // For ag grid
  gridOptions: GridOptions = ({} as GridOptions);
  defaultColDef: ColDef;
  frameworkComponents: { [p: string]: unknown };

  // Detail Data
  depreciationAdjustmentMaster: IDepreciationAdjustment = {} as IDepreciationAdjustment;
  depreciationAdjustmentLines: IDepreciationAdjustmentLines[] | any;

  // Showing Remarks
  remarksList: IRemarksList[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private depreciationAdjustmentService: DepreciationAdjustmentService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private layoutUtilService: LayoutUtilsService,
    injector: Injector
  ) {
    super(injector)
  }

  // Defining AG Grid Columns
  columnDefs = [
    {headerName: 'Fixed Asset', field: 'fixedAsset', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Account', field: 'level4', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {
      headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Debit', field: 'debit', sortable: true, filter: true, cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Credit', field: 'credit', sortable: true, filter: true, cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
  ];

  ngOnInit(): void {

    this.gridOptions.rowStyle = {color: 'black'};
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.getDepreciationAdjustmentData(id);
        this.depreciationAdjustmentId = id;
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

  private getDepreciationAdjustmentData(id: number) {
    this.depreciationAdjustmentService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IDepreciationAdjustment>) => {
        this.depreciationAdjustmentMaster = res.result;
        this.depreciationAdjustmentLines = res.result.depreciationAdjustmentLines;
        this.remarksList = this.depreciationAdjustmentMaster.remarksList ?? []
        this.cdRef.markForCheck();
      })
  }

  // Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    // Getting Updated Depreciation Adjustment Data
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.depreciationAdjustmentService.workflow({action, docId: this.depreciationAdjustmentMaster.id, remarks})
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.getDepreciationAdjustmentData(this.depreciationAdjustmentId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Depreciation Adjustment');
      })
  }

  // Upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.depreciationAdjustmentMaster,
        serviceClass: this.depreciationAdjustmentService,
        functionName: 'uploadFile',
        name: 'Depreciation Adjustment'
      },
    }).afterClosed().subscribe(() => {
      this.getDepreciationAdjustmentData(this.depreciationAdjustmentId)
      this.cdRef.detectChanges()
    })
  }
}
