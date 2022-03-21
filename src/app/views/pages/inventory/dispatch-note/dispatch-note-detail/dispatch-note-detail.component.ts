import { DISPATCH_NOTE } from './../../../../shared/AppRoutes';
import { Component, Injector, OnInit }                          from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog }                                  from '@angular/material/dialog';
import { ActivatedRoute, Router }                     from '@angular/router';
import { GridOptions }                                from 'ag-grid-community';
import { LayoutUtilsService } from 'src/app/core/_base/crud';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DispatchNoteService } from '../service/dispatch-note.service';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-dispatch-note-detail',
  templateUrl: './dispatch-note-detail.component.html',
  styleUrls: ['./dispatch-note-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DispatchNoteDetailComponent extends AppComponentBase implements OnInit {
// routing variables
public DISPATCH_NOTE=DISPATCH_NOTE
  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  gdnId: number;


   //For ag grid
   gridOptions = ({} as GridOptions);
   defaultColDef: any;
   frameworkComponents : any;

   // Variables for dispatch Note data
   dispatchNoteMaster: any;
   dispatchNoteLines: any;

   //Injecting Dependencies
   constructor( private dispatchNoteService : DispatchNoteService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                public  dialog: MatDialog,
                private layoutUtilService : LayoutUtilsService,
                private cdRef: ChangeDetectorRef,
                injector: Injector
                ) {
                  super(injector)
                  this.gridOptions = ({} as GridOptions);
                }

  //Defining columns for ag grid
  columnDefs = [
    {headerName: 'Item', field: 'item', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Price', field: 'price', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
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
        this.getDispatchNoteMasterData(id);
        this.gdnId = id;
        this.cdRef.markForCheck();
      } else {
        this.layoutUtilService.showActionNotification('Cannot find record with out id parameter', null, 5000, true, false)
        this.router.navigate(['/'+DISPATCH_NOTE.LIST])
      }
    });
  }

  onFirstDataRendered(params : any) {
    params.api.sizeColumnsToFit();
  }

  //Getting Dispatch Note master data
  private getDispatchNoteMasterData(id: number) {
    this.dispatchNoteService.getDispatchNoteMasterById(id).subscribe((res) => {
      this.dispatchNoteMaster = res.result;
      this.dispatchNoteLines = res.result.gdnLines;
      this.cdRef.markForCheck();
    }, (error => {
      console.log(error);
    }))
  }

  workflow(action: any) {
    this.isLoading = true
    this.dispatchNoteService.workflow({action, docId: this.dispatchNoteMaster.id})
      .subscribe((res) => {
        this.getDispatchNoteMasterData(this.gdnId);
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'GDN');
      }, (err) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        this.toastService.error('' + err.error.message, 'GDN')
      })
  }
}
