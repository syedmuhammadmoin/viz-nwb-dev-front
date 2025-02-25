import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ISSUANCE, ISSUANCE_RETURN } from 'src/app/views/shared/AppRoutes';
import { finalize, take } from 'rxjs/operators';
import { IssuanceReturnService } from '../service/issuance-return.service';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'kt-issuance-return-detail',
  templateUrl: './issuance-return-detail.component.html',
  styleUrls: ['./issuance-return-detail.component.scss']
})

export class IssuanceReturnDetailComponent extends AppComponentBase implements OnInit {

 // routing variables
  public ISSUANCE = ISSUANCE;
  public ISSUANCE_RETURN = ISSUANCE_RETURN;

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  showReference: boolean = false;

  //kt busy loading
  isLoading: boolean;

  gridApi: any

  //need for routing
  issuanceReturnId: number;

   //For ag grid
   gridOptions = ({} as GridOptions);
   defaultColDef: any;

   // Variables for Issuance Return data
   issuanceReturnLines: any;
   issuanceReturnMaster: any;

   //Showing Remarks
  remarksList: string[] = [];

 constructor( private activatedRoute: ActivatedRoute,
              private issuanceReturnService: IssuanceReturnService,
              private cdRef: ChangeDetectorRef,
              private dialog: MatDialog,
              injector: Injector
              ) {
                super(injector)
                this.gridOptions = ({} as GridOptions);
              }

  //Defining Issuance Return Columns
  columnDefs = [
    {headerName: 'Item', field: 'item', sortable: false, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Description', field: 'description', sortable: false, filter: true, cellStyle: {'font-size': '12px'}},
    {
      headerName: 'Quantity', 
      field: 'quantity', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Store', 
      field: 'warehouse', 
      sortable: false, 
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
        this.getIssuanceReturnMasterData(id);
        this.issuanceReturnId = id;
        this.cdRef.markForCheck();
      }
    });
  }

  onFirstDataRendered(params : any) {
    this.gridApi = params.api
    params.api.sizeColumnsToFit();
  }

  private getIssuanceReturnMasterData(id: number) {
    this.isLoading = true;
    this.issuanceReturnService.getIssuanceReturnById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.issuanceReturnMaster = res.result;
      this.issuanceReturnLines = res.result.issuanceReturnLines;
      this.remarksList = this.issuanceReturnMaster.remarksList ?? [] 


      //Checking grn status to Issuance reference
      this.showReference = (["Draft" , "Rejected"].includes(this.issuanceReturnMaster.status)) ? false : true;

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
    this.issuanceReturnService.workflow({action, docId: this.issuanceReturnMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.getIssuanceReturnMasterData(this.issuanceReturnId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Issuance Return');
      })
  }
}








