
import { CWIP } from 'src/app/views/shared/AppRoutes';
import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions, DepreciationMethod } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { finalize, take } from 'rxjs/operators';
import { CwipService } from '../service/cwip.service';
import { CreateCwipComponent } from '../create-cwip/create-cwip.component';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';

@Component({
  selector: 'kt-cwip-details',
  templateUrl: './cwip-details.component.html',
  styleUrls: ['./cwip-details.component.scss']
})
export class CwipDetailsComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  public CWIP = CWIP;
  action = ActionButton
  docStatus = DocumentStatus

  modelType: any = DepreciationMethod

  //For ag grid
  gridOptions: any;
  defaultColDef: ColDef;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  cwipId: number;

  //Variables for CWIP data
  cwip: any
  cwipMaster:  any;
  status: string;

    //Showing Remarks
    remarksList: string[] = [];

  constructor(
    private cwipService: CwipService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.cwipId = id;
        this.getCwipData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

   //this.straightLineProrataBasis();
   //this.decliningBalanceProrataBasis()
   //this.decliningBalance()
   //this.calculateDepreciationForStraightLineWithoutProrataBasis();

   //this.straightLineProrataBasisForDatabase()

  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting CWIP Master Data
  getCwipData(id: number) {
    this.cwipService.getCwipById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<any>) => {
      this.cwipMaster = res.result;
      this.remarksList = this.cwipMaster.remarksList ?? [] 
      this.cdRef.detectChanges();
    })
  }

  editCwip(id?: number): void {
    this.dialog.open(CreateCwipComponent, {
      width: '800px',
      data: {
        id:id
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
    this.cwipService.workflow({ action, docId: this.cwipMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getCwipData(this.cwipId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'CWIP');
        
      })
  }
}
