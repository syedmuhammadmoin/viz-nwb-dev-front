import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions, DepreciationMethod } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { finalize, take } from 'rxjs/operators';
import { DisposalService } from '../service/disposal.service';
import { CreateDisposalComponent } from '../create-disposal/create-disposal.component';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { ASSET, DISPOSAL } from 'src/app/views/shared/AppRoutes';
import {IDisposal} from '../model/IDisposal';
import { ConfirmationDialogComponent } from 'src/app/views/shared/components/confirmation-dialog/confirmation-dialog.component';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';




@Component({
  selector: 'kt-disposal-details',
  templateUrl: './disposal-details.component.html',
  styleUrls: ['./disposal-details.component.scss']
})
export class DisposalDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  public DISPOSAL = DISPOSAL;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  disposalId: number;

  //Variables for asset data
  disposal: any
  disposalMaster:  any;
  status: string;

    //Showing Remarks
    remarksList: string[] = [];

  constructor(
    private disposalService: DisposalService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    injector: Injector,
    private router: Router,
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.disposalId = id;
        this.getDisposalData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Asset Master Data
  getDisposalData(id: number) {
    this.disposalService.getDisposalById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<any>) => {
      this.disposalMaster = res.result;
      this.remarksList = this.disposalMaster.remarksList ?? []
      // this.assets = res.result;
      this.cdRef.detectChanges();
    })
  }

  editDisposal(id?: number): void {
    this.dialog.open(CreateDisposalComponent, {
      width: '800px',
      data: {
        id: id
      }
    });
  }


   //Get Remarks From User
   remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    //sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

 

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.disposalService.workflow({ action, docId: this.disposalMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getDisposalData(this.disposalId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Disposal');
      })
  }

}

