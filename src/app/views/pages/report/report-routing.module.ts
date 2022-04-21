import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet/balance-sheet.component';
import { GeneralLedgerComponent} from "./general-ledger/general-ledger/general-ledger.component";
import { ProfitNLossComponent } from './profit-N-loss/profit-N-loss/profit-N-loss.component';
import { TrialBalanceComponent } from "./trial-balance/trial-balance/trial-balance.component";
import { Permissions } from '../../shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { PrintBalanceSheetComponent } from './balance-sheet/print-balance-sheet/print-balance-sheet.component';
import { PrintProfitNLossComponent } from './profit-N-loss/print-profit-n-loss/print-profit-n-loss.component';
import { APP_ROUTES, REPORT } from '../../shared/AppRoutes';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: REPORT.GENERAL_LEDGER,
        component: GeneralLedgerComponent,
        data: {
          array: [
            { permission: Permissions.GENERALLEDGER_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: REPORT.TRIAL_BALANCE,
        component: TrialBalanceComponent,
        data: {
          array: [
            { permission: Permissions.TRIALBALANCE_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: REPORT.BALANCE_SHEET,
        children:[
          {
            path: '',
            component: BalanceSheetComponent,
            data: {
              array: [
                { permission: Permissions.BALANCESHEET_VIEW },
              ]
            },
            canActivate: [PermissionGuard]
          },
          {
            path: REPORT.PRINT,
            component: PrintBalanceSheetComponent,
            data: {
              array: [
                { permission: Permissions.BALANCESHEET_VIEW },
              ]
            },
            canActivate: [PermissionGuard]
          },
        ]
      },
      {
        path: REPORT.PROFIT_N_LOSS,
        children:[
          {
            path: '',
            component: ProfitNLossComponent,
            data: {
              array: [
                { permission: Permissions.PROFITLOSS_VIEW },
              ]
            },
            canActivate: [PermissionGuard]
          },
          {
            path: REPORT.PRINT,
            component: PrintProfitNLossComponent,
            data: {
              array: [
                { permission: Permissions.PROFITLOSS_VIEW },
              ]
            },
            canActivate: [PermissionGuard]
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
