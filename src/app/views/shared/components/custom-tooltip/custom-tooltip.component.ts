import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'kt-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.scss']
})

export class CustomTooltipComponent implements ITooltipAngularComp {

  private params: any;
  private data: any;
  public  title: any;

  // agInit(params : any): void {
  //   this.params = params;
  //   this.title = this.params.context.componentParent.tooltipData;
  //   this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
  //   this.data.color = this.params.color || 'white';
  // }

  
  agInit(params: any): void {
    this.params = params;
    this.title = (typeof(this.params.context) === 'string') ? this.params.context :  this.params.context.componentParent.tooltipData;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    this.data.color = this.params.color || 'white';
  }
}
