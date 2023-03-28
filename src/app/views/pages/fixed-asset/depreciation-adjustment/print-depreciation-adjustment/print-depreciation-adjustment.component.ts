import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {ActionButton, DocType, DocumentStatus, Permissions} from '../../../../shared/AppEnum';
import {DEPRECIATION_ADJUSTMENT, JOURNAL_ENTRY} from '../../../../shared/AppRoutes';
import {ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams} from 'ag-grid-community';
import {IDepreciationAdjustment, IDepreciationAdjustmentLines, IRemarksList} from '../model/IDepreciationAdjustment';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DepreciationAdjustmentService} from '../service/depreciation-adjustment.service';
import {MatDialog} from '@angular/material/dialog';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import {finalize, take} from 'rxjs/operators';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {CustomRemarksComponent} from '../../../../shared/components/custom-remarks/custom-remarks.component';
import {CustomUploadFileComponent} from '../../../../shared/components/custom-upload-file/custom-upload-file.component';
import {DynamicColorChangeService} from '../../../../shared/services/dynamic-color/dynamic-color-change.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'kt-print-asset-adjustment',
  templateUrl: './print-depreciation-adjustment.component.html',
  styleUrls: ['./print-depreciation-adjustment.component.scss']
})
export class PrintDepreciationAdjustmentComponent extends AppComponentBase implements OnInit {

  // Loader
  isLoading: boolean;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  // need for routing
  depreciationAdjustmentId: number;

  public depreciationAdjustmentRoute = DEPRECIATION_ADJUSTMENT

  // Detail Data
  depreciationAdjustmentMaster: IDepreciationAdjustment = {} as IDepreciationAdjustment;
  depreciationAdjustmentLines: IDepreciationAdjustmentLines[];

  // Showing Remarks
  remarksList: IRemarksList[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private depreciationAdjustmentService: DepreciationAdjustmentService,
    private cdRef: ChangeDetectorRef,
    private layoutUtilService: LayoutUtilsService,
    public dynamicColorChanging : DynamicColorChangeService,
    public  sanitizer: DomSanitizer,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {

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

    this.dynamicColorChanging.global_color.subscribe((res: any) => {

      if (localStorage.getItem('global_color')) {
        this.localsto = JSON.parse(localStorage.getItem('global_color'))
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      }
      else {
        this.localsto = res;
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      }

      if(this.edinfini){
        this.className = 'edinfini row'
      }
      else if(this.sbbu){
        this.className = 'sbbu row'
      }
      else if(this.vizalys){
        this.className = 'vizalys row'
      }

      this.cdRef.detectChanges()
    })
  }

  printDiv(divName : string) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-bill.component.scss">')
    window.print();
    window.document.close();
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

}
