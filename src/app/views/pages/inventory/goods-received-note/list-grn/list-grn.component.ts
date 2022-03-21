import { GOODS_RECEIVED_NOTE } from './../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GridOptions }            from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { GrnService }   from "../service/grn.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-list-grn',
  templateUrl: './list-grn.component.html',
  styleUrls: ['./list-grn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListGrnComponent extends AppComponentBase implements OnInit {

  grnList: any;
  defaultColDef: any;
  gridOptions : GridOptions;
  frameworkComponents: any;
  tooltipData : string = "double click to view detail"

  constructor( private GrnService : GrnService,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private activatedRoute: ActivatedRoute,
               injector : Injector
             ) { 
                super(injector)
                this.gridOptions = <GridOptions>(
                    { 
                      context : { componentParent : this } 
                    }
                  );
               }

  columnDefs = [
    {headerName: 'Vendor', field: 'vendor', sortable: true, filter: true, tooltipField: 'status'},
    {
      headerName: 'GRN Date', 
      field: 'grnDate', 
      sortable: true, 
      filter: true, 
      tooltipField: 'status',
      cellRenderer: (params : any) => {
        const date = params.data.grnDate != null ? params.data.grnDate : null;
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

    this.loadGrnList()
  }

  onFirstDataRendered(params : any) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : any) {
    this.router.navigate(['/'+GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details',event.data.id) ], {relativeTo: this.activatedRoute})
  }

  addgoodReceiveNote() {
    this.router.navigate(['/'+GOODS_RECEIVED_NOTE.CREATE]);
  }

  loadGrnList() {
    this.GrnService.getAllGRNs().subscribe(
      (res) => {
      this.grnList = res.result;
      this.cdRef.markForCheck();
      },
      (err) => {
        console.log(err)
      })
  }
}
