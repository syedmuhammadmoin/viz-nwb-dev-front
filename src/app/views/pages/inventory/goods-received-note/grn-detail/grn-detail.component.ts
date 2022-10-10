import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GrnService }                                                    from '../service/grn.service';
import { ActivatedRoute, Router }                                        from '@angular/router';
import { LayoutUtilsService }                                            from '../../../../../core/_base/crud';
import { GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BILL, GOODS_RECEIVED_NOTE, GOODS_RETURN_NOTE, ISSUANCE, PURCHASE_ORDER } from 'src/app/views/shared/AppRoutes';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'kt-grn-detail',
  templateUrl: './grn-detail.component.html',
  styleUrls: ['./grn-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GrnDetailComponent extends AppComponentBase implements OnInit {
// routing variables
  public GOODS_RECEIVED_NOTE=GOODS_RECEIVED_NOTE;
  public PURCHASE_ORDER = PURCHASE_ORDER;
  public ISSUANCE = ISSUANCE;
  public BILL = BILL;
  public GOODS_RETURN_NOTE = GOODS_RETURN_NOTE;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  showReference: boolean = false;

  // handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  gridApi: any

  //need for routing
  grnId: number;


   //For ag grid
   gridOptions = ({} as GridOptions);
   defaultColDef: any;
   frameworkComponents : any;

   // Variables for Goods Received Note data
   grnLines: any;
   grnMaster: any;

   //Showing Remarks
  remarksList: string[] = [];

 constructor( private activatedRoute: ActivatedRoute,
              private grnService: GrnService,
              private cdRef: ChangeDetectorRef,
              private dialog: MatDialog,
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
    {
      headerName: 'Quantity', 
      field: 'quantity', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Returned', 
      field: 'receivedQuantity',  
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 0
      }
    },
    {
      headerName: 'Cost', 
      field: 'cost', 
      cellStyle: {'font-size': '12px'}
    },
    {headerName: 'Tax', field: 'tax', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {
      headerName: 'Store', 
      field: 'warehouse', 
      sortable: true, 
      filter: true, 
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
  ];
  

  ngOnInit(): void {
    this.gridOptions.rowStyle = {color: 'black'};
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.getGRNMasterData(id);
        this.grnId = id;
        this.cdRef.markForCheck();
      }
    });
  }

  onFirstDataRendered(params : any) {
    this.gridApi = params.api
    params.api.sizeColumnsToFit();
  }

  private getGRNMasterData(id: number) {
    this.isLoading = true;
    this.grnService.getGRNById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.grnMaster = res.result;
      this.grnLines = res.result.grnLines;
      this.remarksList = this.grnMaster.remarksList ?? [] 

      //Checking grn status to show purchase order reference
      this.showReference = (["Draft" , "Rejected"].includes(this.grnMaster.status)) ? false : true;

      if([DocumentStatus.Draft , DocumentStatus.Rejected , DocumentStatus.Submitted].includes(this.grnMaster.state)) {
        this.gridOptions.columnApi.setColumnVisible('receivedQuantity', false);
      }
      else {
        this.gridOptions.columnApi.setColumnVisible('receivedQuantity', true);
        this.gridApi?.sizeColumnsToFit();
      }
      this.cdRef.markForCheck();
    })
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
    this.grnService.workflow({action, docId: this.grnMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getGRNMasterData(this.grnId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Goods Received Note');
      })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.grnMaster,
        serviceClass: this.grnService,
        functionName: 'uploadFile',
        name: 'GRN'
      },
    }).afterClosed().subscribe(() => {
      this.getGRNMasterData(this.grnId)
      this.cdRef.detectChanges()
    })
  }
}





