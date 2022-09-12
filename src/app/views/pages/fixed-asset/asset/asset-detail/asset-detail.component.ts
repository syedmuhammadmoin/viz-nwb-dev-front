import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { finalize, take } from 'rxjs/operators';
import { AssetService } from '../service/asset.service';

@Component({
  selector: 'kt-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})
export class AssetDetailComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  assetId: number;

  //Variables for asset data
  assets: any
  assetMaster:  any;
  status: string;

  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
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
        this.assetId = id;
        this.getAssetData(id);
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
  getAssetData(id: number) {
    this.assetService.getAssetById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<any>) => {
      this.assetMaster = res.result;
      this.assets = res.result;
      this.cdRef.detectChanges();
    })
  }
}



