import { Component, inject, Injector, OnInit } from '@angular/core';
import { GridApi, GridOptions, ICellRendererParams } from 'ag-grid-enterprise';
import { TaxService } from '../service/tax.service';
import { lastValueFrom } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BusinessPartnerType, ScopeList } from 'src/app/views/shared/AppEnum';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vl-select-tax-list',
  standalone: false,
  templateUrl: './select-tax-list.component.html',
  styleUrl: './select-tax-list.component.scss'
})
export class SelectTaxListComponent extends AppComponentBase implements OnInit {

  gridApi: GridApi;
  gridOptions : GridOptions;

  rowData: any[] = []
  selectedIds : number[] = []
  constructor(
    private taxService: TaxService,
    injector: Injector,
    public dialogRef: MatDialogRef<SelectTaxListComponent>
  ) {super(injector) }
  // columnDefs: [
  //   { width: 20, checkboxSelection: true, headerCheckboxSelection: true },
  //   { field: "make" },
  //   { field: "model" },
  //   { field: "price" },
  // ]
  columnDefs = [
    { width: 20, checkboxSelection: true , headerCheckboxSelection: true },
    { headerName: 'Name', field: 'name'},
    { headerName: 'Tax Scope', field: 'taxScope',
      cellRenderer: (params: ICellRendererParams) => {
        return ScopeList[params.value]
      }
     },
    { headerName: 'Description', field: 'desciption' , flex: 3 }
  ];

  // rowData = [
  //   { make: 'Toyota', model: 'Celica', price: 35000 },
  //   { make: 'Ford', model: 'Mondeo', price: 32000 },
  //   { make: 'Porsche', model: 'Boxster', price: 72000 }
  // ];
  ngOnInit(): void {
    this.gridOptions = {
      rowSelection: 'multiple',    
      //rowModelType: "infinite",           
      // rowHeight: 30,
      // headerHeight: 35,      
      context: "double click to view detail",
      defaultColDef: {
        editable: true,
        filter: true, // Enable filtering
      },
    }
    lastValueFrom(this.taxService.getTaxes()).then(res => {
      this.rowData = res.result
    })
    this.gridApi?.setGridOption('rowData', this.rowData)

   
  }
  onRowSelected(event: any) {
    this.selectedIds.push(event.data?.id)
    // console.log(event.data);
    // console.log(this.selectedIds,"Ids");
    // lastValueFrom(this.taxService.getTaxesByIds(this.selectedIds)).then(res => {
    //   console.log(res);      
    //   this.dialogRef.close(res.result);
    // })        
  }

  getList(){
   console.log(this.selectedIds,"IDS")
   this.dialogRef.close(this.selectedIds);
   
  }
}
