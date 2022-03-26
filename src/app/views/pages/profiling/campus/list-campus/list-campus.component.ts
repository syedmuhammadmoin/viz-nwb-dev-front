import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/Dialog'
import { ColDef, FirstDataRenderedEvent, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { ICampus } from '../model/ICampus';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CampusService } from '../service/campus.service';
import { CreateCampusComponent } from '../create-campus/create-campus.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-list-campus',
  templateUrl: './list-campus.component.html',
  styleUrls: ['./list-campus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListCampusComponent extends AppComponentBase implements OnInit {

  campusList : ICampus[]
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"
  // constructor
  constructor(
    public dialog: MatDialog,
    public campusService: CampusService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) { super(injector);
      this.gridOptions = <GridOptions>(
        {
          context : { componentParent : this }
        }
      );
    }

// defaults columns
  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name' },
  ];
// implimentation of ng OnInit
  ngOnInit() { 

    this.getCampuses()
   
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  }
// data rendering on first
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
// called when double clicked on record
  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }
// open modal funtion
  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCampusComponent, {
      width: '800px',
      data: id
    });
    // Recalling getCampuses function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getCampuses()
    });
  }

  getCampuses () : void {
    this.campusService.getCampuses().subscribe((res: IPaginationResponse<ICampus[]>) => {
      this.campusList = res.result;
      this.cdRef.detectChanges()
    })
  }
}


