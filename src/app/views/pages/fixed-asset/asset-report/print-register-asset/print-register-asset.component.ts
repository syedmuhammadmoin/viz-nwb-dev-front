import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {DynamicColorChangeService} from '../../../../shared/services/dynamic-color/dynamic-color-change.service';
import { IRegisterAsset } from '../model/IRegisterAssetReport';
import { AssetService } from '../../asset/service/asset.service';
import { finalize, take } from 'rxjs/operators';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Component({
  selector: 'kt-print-register-asset',
  templateUrl: './print-register-asset.component.html',
  styleUrls: ['./print-register-asset.component.scss']
})
export class PrintRegisterAssetComponent extends AppComponentBase implements OnInit {

  isLoading = true;
  masterData: IRegisterAsset[] | any = [];
  fromDate: string;
  toDate: string;
  fixedAsset: string;
  warehouse: string;
  edinfini: boolean;
  sbbu: boolean;
  vizalys: boolean;
  localsto: any;
  className: any;
  fixedAssetName: string = '';


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private assetService: AssetService,
    private cdRef: ChangeDetectorRef,
    public dynamicColorChanging: DynamicColorChangeService,
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param) => {
     this.assetService.getAssetById(+(param.fixedAssetId))
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<any>) => {
        this.masterData = res.result?.depreciationRegisterList;
        this.fixedAssetName = res.result?.name;
      })
    });

    this.dynamicColorChanging.global_color.subscribe((res: any) => {

      if (localStorage.getItem('global_color')) {
        this.localsto = JSON.parse(localStorage.getItem('global_color'))
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      } else {
        this.localsto = res;
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      }

      if (this.edinfini) {
        this.className = 'edinfini row'
      } else if (this.sbbu) {
        this.className = 'sbbu row'
      } else if (this.vizalys) {
        this.className = 'vizalys row'
      }

      this.cdRef.detectChanges()
    })

  }
  printForm(){
    window.print();
  }
}
