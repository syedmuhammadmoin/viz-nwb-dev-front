import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GrnService }                                                    from '../service/grn.service';
import { ActivatedRoute, Router }                                        from '@angular/router';
import { LayoutUtilsService }                                            from '../../../../../core/_base/crud';
import { GridOptions } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { GOODS_RECEIVED_NOTE } from 'src/app/views/shared/AppRoutes';

@Component({
  selector: 'kt-grn-detail',
  templateUrl: './grn-detail.component.html',
  styleUrls: ['./grn-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GrnDetailComponent extends AppComponentBase implements OnInit {
// routing variables
  public GOODS_RECEIVED_NOTE=GOODS_RECEIVED_NOTE;
  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  grnId: number;


   //For ag grid
   gridOptions = ({} as GridOptions);
   defaultColDef: any;
   frameworkComponents : any;

   // Variables for Goods Received Note data
   grnLines: any;
   grnMaster: any;

 constructor( private activatedRoute: ActivatedRoute,
              private grnService: GrnService,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private layoutUtilService: LayoutUtilsService,
              injector: Injector
              ) {
                super(injector)
                this.gridOptions = ({} as GridOptions);
              }


  columnDefs = [
    {headerName: 'Item', field: 'item', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Cost', field: 'cost', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Tax', field: 'tax', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Location', field: 'location', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
  ];
  

  ngOnInit(): void {
    this.gridOptions.rowStyle = {color: 'black'};
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.getGRNMasterData(id);
        this.grnId = id;
        this.cdRef.markForCheck();
      } else {
        this.layoutUtilService.showActionNotification('Cannot find record with out id parameter', null, 5000, true, false)
        this.router.navigate(['/'+GOODS_RECEIVED_NOTE.LIST])
      }
    });
  }

  onFirstDataRendered(params : any) {
    params.api.sizeColumnsToFit();
  }

  private getGRNMasterData(id: number) {
    this.grnService.getGRNMasterById(id).subscribe((res) => {
      this.grnMaster = res.result;
      this.grnLines = res.result.grnLines;
      this.cdRef.markForCheck();
    }, (error => {
      console.log(error);
    }))
  }

  workflow(action: any) {
    this.isLoading = true
    this.grnService.workflow({action, docId: this.grnMaster.id})
      .subscribe((res) => {
        this.getGRNMasterData(this.grnId);
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'GRN');
      }, (err) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.error('' + err.error.message, 'GRN')
      })
  }
}





