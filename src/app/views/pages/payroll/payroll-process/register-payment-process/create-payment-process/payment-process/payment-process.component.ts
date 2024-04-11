import { Component, Injector } from '@angular/core';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.scss']
})
export class PaymentProcessComponent extends AppComponentBase {

  isLoading: boolean;
  constructor( injector: Injector ) {
    super(injector)
  }

  loading(value: boolean) {
    this.isLoading = value;
  }
}



