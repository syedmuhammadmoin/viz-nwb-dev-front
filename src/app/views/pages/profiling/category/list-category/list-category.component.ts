import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { MatDialog } from '@angular/material/Dialog'
import { ColDef, FirstDataRenderedEvent, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { ICategory } from '../model/ICategory';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Component({
  selector: 'kt-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListCategoryComponent implements OnInit {

  categoryList : ICategory[]
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"
  // constructor
  constructor( 
               private categoryService: CategoryService,
               public dialog: MatDialog,
               private cdRef: ChangeDetectorRef
             ) {
                this.gridOptions = <GridOptions>({ context : { componentParent : this } } );
               }
// defaults columns
  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Inventory Account', field: 'inventoryAccount', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Revenue Account', field: 'revenueAccount', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Cost Account', field: 'costAccount', sortable: true, filter: true, tooltipField: 'name' }
  ];
// implimentation of ng OnInit
  ngOnInit() { 

    this.getCategories()
   
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
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      width: '800px',
      data: id
    });
    // Recalling getCategories function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getCategories()
    });
  }

  getCategories () : void {
    this.categoryService.getCategories().subscribe((res: IPaginationResponse<ICategory[]>) => {
      this.categoryList = res.result;
      this.cdRef.detectChanges()
    })
  }
}



