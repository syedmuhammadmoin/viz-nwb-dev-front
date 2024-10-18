import { Component, Injector, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GridApi, GridOptions, ICellRendererParams } from 'ag-grid-enterprise';
import { lastValueFrom } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ScopeList } from 'src/app/views/shared/AppEnum';
import { SelectTaxListComponent } from '../../tax/select-tax-list/select-tax-list.component';
import { TaxService } from '../../tax/service/tax.service';
import { FISCALYEAR, JOURNAL } from 'src/app/views/shared/AppRoutes';

@Component({
  selector: 'vl-list-fiscal-years',
  templateUrl: './list-fiscal-years.component.html',
  styleUrl: './list-fiscal-years.component.scss'
})
export class ListFiscalYearsComponent extends AppComponentBase implements OnInit {
  gridApi: GridApi;
  gridOptions : GridOptions;
  selectedRowCount : number;
  deleteBtn : boolean;
  public permissions = Permissions

  rowData: any[] = []
  selectedIds : number[] = [];
  constructor(   
    injector: Injector,
  ) {super(injector) }


  columnDefs = [
    { width: 20, checkboxSelection: true , headerCheckboxSelection: true },
    { headerName: 'Name', field: 'name'},
    { headerName: 'Tax Scope', field: 'taxScope',
      cellRenderer: (params: ICellRendererParams) => {
        return ScopeList[params.value]
      }
     },
    { headerName: 'Description', field: 'description' , flex: 3 }


  ];
  ngOnInit(): void {
    this.gridOptions = {
      rowSelection: 'multiple',             
      context: "double click to view detail",
      defaultColDef: {
        editable: false,
        filter: true, 
      },
    }
    // lastValueFrom(this.taxService.getTaxes()).then(res => {
    //   this.rowData = res.result
    // })
    this.gridApi?.setGridOption('rowData', this.rowData)

   
  }
  onRowSelected(event: any) {
    const selectedRowId = event.node.data.id;

    if (event.node.isSelected()) {  
      this.selectedIds.push(selectedRowId);
    } else {
      this.selectedIds = this.selectedIds.filter(id => id !== selectedRowId);
    }
  }

  // getList(){
  //  this.dialogRef.close(this.selectedIds);
  // }
  DeleteRows(){

  }
  DeselectRows(){

  }
  addFiscalYear(){
    this.router.navigate(['/' + FISCALYEAR.CREATE])
  }

  // closeDialog(): void {
  //   this.selectedIds = []
  //   this.dialogRef.close(this.selectedIds);
  // }
}
