import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { TaxService } from '../../service/tax.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'vl-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent implements ICellRendererAngularComp {
  public isActive: boolean = true;
  public params: any;

  constructor(
    private service : TaxService,
  ){

  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.isActive = params.value
   lastValueFrom(this.service.ChangeTaxStatus(params.data.id,params.value)).then(res => {   
   })
    return true
  }


  agInit(params: any): void {
    this.params = params;
    this.isActive = this.params.value;
  }

  onToggle() {
    this.isActive = !this.isActive;
    this.params.node.setDataValue(this.params.colDef.field, this.isActive);
  }
}
