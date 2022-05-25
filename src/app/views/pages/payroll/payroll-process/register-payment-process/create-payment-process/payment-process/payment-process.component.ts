import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.scss']
})
export class PaymentProcessComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;
  constructor( injector: Injector ) {
    super(injector)
  }

  ngOnInit(): void { }

  loading(value: boolean) {
    this.isLoading = value;
  }
}



