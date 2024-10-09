import { Component, inject, Injector, OnInit } from '@angular/core';
import { GridApi, GridOptions, ICellRendererParams } from 'ag-grid-enterprise';
import { lastValueFrom } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BusinessPartnerType, ScopeList } from 'src/app/views/shared/AppEnum';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaxGroupService } from '../service/tax-group.service';
import { CreateTaxGroupComponent } from '../create-tax-group/create-tax-group.component';

@Component({
  selector: 'vl-list-tax-group',
  standalone: false,
  templateUrl: './list-tax-group.component.html',
  styleUrl: './list-tax-group.component.scss'
})
export class ListTaxGroupComponent extends AppComponentBase implements OnInit{

  gridApi: GridApi;
  gridOptions : GridOptions;

  rowData: any[] = []
  
  constructor(injector: Injector,
    private service : TaxGroupService,
    public dialog : MatDialog,
    public dialogRef: MatDialogRef<ListTaxGroupComponent>,
  ){super(injector)}


  columnDefs = [
    { headerName: 'Name', field: 'name'},
    { headerName: 'Company', field: 'company',},
    { headerName: 'Country', field: 'countryName'  },
    { headerName: 'Tax Payable Account', field: 'payableAccountName'  },
    { headerName: 'Tax Receivable Account', field: 'receivableAccountName'  },
    { headerName: 'Tax Advance Account', field: 'advanceAccountName'  }


  ];
  ngOnInit(): void {
    this.gridOptions = {     
      onRowClicked :  this.onRowClicked.bind(this),            
      context: "double click to view detail",
      //pagination:true,
      defaultColDef: {
        editable: false,
        filter: true, 
      },
    }
    lastValueFrom(this.service.getAll()).then(res => {
      this.rowData = res.result
    })
    this.gridApi?.setGridOption('rowData', this.rowData)
  }

  OpenNewModal(){
    this.dialog.open(CreateTaxGroupComponent, {
      width : '800px'
    })
  }
  closeDialog(){
this.dialogRef.close();
  }
  onRowClicked(event:any):any{
this.dialogRef.close(event.data.id)

  }
}
