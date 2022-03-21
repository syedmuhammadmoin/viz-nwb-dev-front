import { CreateBusinessPartnerComponent } from 'src/app/views/pages/profiling/business-partner/create-business-partner/create-business-partner.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { PaymentService } from './service/payment.service';
import { PaymentInvoiceComponent } from './print-payment/payment-invoice.component';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { AgGridModule } from 'ag-grid-angular';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';
import { CashAccountService } from '../cash-account/service/cashAccount.service';
import { BankAccountService } from '../bank-account/service/bankAccount.service';
import { BusinessPartnerService } from '../../profiling/business-partner/service/businessPartner.service';
import { CategoryService } from '../../profiling/category/service/category.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { DepartmentService } from '../../profiling/department/service/department.service';
import { LocationService } from '../../profiling/location/service/location.service';
import { WarehouseService } from '../../profiling/warehouse/services/warehouse.service';
import { ProductService } from '../../profiling/product/service/product.service';


@NgModule({
  declarations: [
    CreatePaymentComponent,
    PaymentInvoiceComponent, 
    ListPaymentComponent, 
    DetailPaymentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    PaymentRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  entryComponents: [CreatePaymentComponent, CreateBusinessPartnerComponent],
  providers: [  
    AddModalButtonService,
    CashAccountService, 
    BankAccountService,
    DepartmentService,
    LocationService,
    WarehouseService,
    ProductService,   
    CategoryService
  ],
})
export class PaymentModule { }
