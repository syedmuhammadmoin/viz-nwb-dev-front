import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { GOODS_RECEIVED_NOTE, GOODS_RETURN_NOTE } from 'src/app/views/shared/AppRoutes';
import { finalize, take } from 'rxjs/operators';
import { GoodsReturnNoteService } from '../service/goods-return-note.service';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'kt-goods-return-note-detail',
  templateUrl: './goods-return-note-detail.component.html',
  styleUrls: ['./goods-return-note-detail.component.scss']
})

export class GoodsReturnNoteDetailComponent extends AppComponentBase implements OnInit {

// routing variables
  public GOODS_RETURN_NOTE = GOODS_RETURN_NOTE;
  public GOODS_RECEIVED_NOTE = GOODS_RECEIVED_NOTE;
  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  showReference: boolean = false;

  // handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  goodsReturnNoteId: number;


   //For ag grid
   gridOptions = ({} as GridOptions);
   defaultColDef: any;
   frameworkComponents : any;

   // Variables for Goods Received Note data
   goodsReturnNoteLines: any;
   goodsReturnNoteMaster: any;

   //Showing Remarks
  remarksList: string[] = [];

 constructor( private activatedRoute: ActivatedRoute,
              private goodsReturnNoteService: GoodsReturnNoteService,
              private cdRef: ChangeDetectorRef,
              private dialog: MatDialog,
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
        this.getGoodsReturnNoteMasterData(id);
        this.goodsReturnNoteId = id;
        this.cdRef.markForCheck();
      }
    });
  }

  onFirstDataRendered(params : any) {
    params.api.sizeColumnsToFit();
  }

  private getGoodsReturnNoteMasterData(id: number) {
    this.isLoading = true;
    this.goodsReturnNoteService.getGoodsReturnNoteById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.goodsReturnNoteMaster = res.result;
      this.goodsReturnNoteLines = res.result.goodsReturnNoteLines;
      this.remarksList = this.goodsReturnNoteMaster.remarksList ?? [] 

      //Checking grn status to show GRN reference
      this.showReference = (["Draft" , "Rejected"].includes(this.goodsReturnNoteMaster.status)) ? false : true;
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

  workflow(action: number , remarks: string) {
    this.isLoading = true
    this.goodsReturnNoteService.workflow({action, docId: this.goodsReturnNoteMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getGoodsReturnNoteMasterData(this.goodsReturnNoteId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Goods Return Note');
      })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.goodsReturnNoteMaster,
        serviceClass: this.goodsReturnNoteService,
        functionName: 'uploadFile',
        name: 'Goods Return Note'
      },
    }).afterClosed().subscribe(() => {
      this.getGoodsReturnNoteMasterData(this.goodsReturnNoteId)
      this.cdRef.detectChanges()
    })
  }
}








