import { DISPATCH_NOTE } from './../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GridOptions }            from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { DispatchNoteService }    from "../service/dispatch-note.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-list-dispatch-note',
  templateUrl: './list-dispatch-note.component.html',
  styleUrls: ['./list-dispatch-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListDispatchNoteComponent extends AppComponentBase implements OnInit {

  gdnList: any;
  defaultColDef: any;
  gridOptions : GridOptions;
  frameworkComponents: any;
  tooltipData : string = "double click to view detail"

  constructor( private dispatchNoteService : DispatchNoteService,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private activatedRoute: ActivatedRoute,
               injector : Injector
             ) {
                  super(injector);
                  this.gridOptions = <GridOptions>(
                    { 
                      context : { componentParent : this } 
                    }
                  );
               }

  columnDefs = [
    {headerName: 'Customer', field: 'customer', sortable: true, filter: true, tooltipField: 'status'},
    {
      headerName: 'GDN Date',
      field: 'gdnDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      cellRenderer: (params : any) => {
        const date = params.data.gdnDate != null ? params.data.gdnDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      },
    },
    {headerName: 'Contact', field: 'contact', sortable: true, filter: true, tooltipField: 'status'},
    {headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'status'},
  ];

  ngOnInit(): void {
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    
    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.loadDispatchNoteList()
  }

  onFirstDataRendered(params : any) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : any) {
    this.router.navigate(['/'+DISPATCH_NOTE.ID_BASED_ROUTE('details', event.data.id)], {relativeTo: this.activatedRoute})
  }

  loadDispatchNoteList() {
    this.dispatchNoteService.getAllDispatchNotes().subscribe(
      (res) => {
      this.gdnList = res.result;
      this.cdRef.markForCheck();
      },
      (err) => {
        console.log(err)
      })
  }
}



