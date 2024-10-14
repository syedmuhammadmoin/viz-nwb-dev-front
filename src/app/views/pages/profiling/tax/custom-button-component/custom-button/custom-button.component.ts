import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'vl-custom-button',
  template: `
    <button (click)="onToggle()">{{ isActive ? 'Deactivate' : 'Activate' }}</button>

    
  `,
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent implements ICellRendererAngularComp {

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    console.log(params,"custom copo");
    return true
  }
  public params: any;
  public isActive: boolean = false;

  agInit(params: any): void {
    this.params = params;
    this.isActive = this.params.value;
  }

  onToggle() {
    this.isActive = !this.isActive;
    this.params.node.setDataValue(this.params.colDef.field, this.isActive);
    this.params.context.componentParent.onToggleActive(this.params);
  }
}
