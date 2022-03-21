import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { GeneralLedgerComponent } from './general-ledger/general-ledger/general-ledger.component';
import {AgGridModule} from 'ag-grid-angular';
import {SharedModule} from '../../shared/modules/shared.module';
import {TrialBalanceComponent} from './trial-balance/trial-balance/trial-balance.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet/balance-sheet.component';
import { ProfitNLossComponent } from './profit-N-loss/profit-N-loss/profit-N-loss.component';
import { PartialsModule } from '../../partials/partials.module';
import { PrintBalanceSheetComponent } from './balance-sheet/print-balance-sheet/print-balance-sheet.component';
import { PrintProfitNLossComponent } from './profit-N-loss/print-profit-n-loss/print-profit-n-loss.component';
import 'ag-grid-enterprise'
import { BusinessPartnerService } from '../profiling/business-partner/service/businessPartner.service';
import { CategoryService } from '../profiling/category/service/category.service';
import { DepartmentService } from '../profiling/department/service/department.service';
import { LocationService } from '../profiling/location/service/location.service';
import { WarehouseService } from '../profiling/warehouse/services/warehouse.service';
import { AddModalButtonService } from '../../shared/services/add-modal-button/add-modal-button.service';
import { ProductService } from '../profiling/product/service/product.service';


@NgModule({
  declarations: [
    GeneralLedgerComponent,
    TrialBalanceComponent,
    BalanceSheetComponent,
    ProfitNLossComponent,
    PrintBalanceSheetComponent,
    PrintProfitNLossComponent

  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    AgGridModule.withComponents([]),
    SharedModule,
    PartialsModule
  ],
 
})
export class ReportModule { }
