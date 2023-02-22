import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'kt-ag-grid-button-cell-rendrer',
  templateUrl: './ag-grid-button-cell-rendrer.component.html',
  styleUrls: ['./ag-grid-button-cell-rendrer.component.scss']
})
export class AgGridButtonCellRendrerComponent implements ICellRendererAngularComp {

  public params: any

  agInit(params: ICellRendererParams) {
    this.params = params;
    console.log(params.data)
  }

  refresh(params: any): boolean {
    return false;
  }

  handleButtonClick(event) {
    this.params.clicked(this.params.data);
  }


}
