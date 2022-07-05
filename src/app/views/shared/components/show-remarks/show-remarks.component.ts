import { Component, Input } from '@angular/core';

@Component({
  selector: 'kt-show-remarks',
  templateUrl: './show-remarks.component.html',
  styleUrls: ['./show-remarks.component.scss']
})
export class ShowRemarksComponent {

  @Input() remarksList: any = [];

  constructor() { }
}
