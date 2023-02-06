import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { CRUD_ROUTES, REPORT } from '../../../shared/AppRoutes';
import { Permissions } from '../../../shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { ListBudgetComponent } from './list-budget/list-budget.component';
import { DetailBudgetComponent } from './detail-budget/detail-budget.component';
import { PrintBudgetComponent } from './print-budget/print-budget.component';
import { BudgetReportComponent } from './budget-report/budget-report.component';

const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListBudgetComponent,
        data: {
          array: [
            { permission: Permissions.BUDGET_VIEW },
            { permission: Permissions.BUDGET_CREATE },
            { permission: Permissions.BUDGET_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateBudgetComponent,
        data: {
          array: [
            { permission: Permissions.BUDGET_CREATE },
            { permission: Permissions.BUDGET_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateBudgetComponent,
        data: {
          array: [
            { permission: Permissions.BUDGET_EDIT },
            { permission: Permissions.BUDGET_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DetailBudgetComponent,
        data: {
          array: [
            { permission: Permissions.BUDGET_VIEW },
            { permission: Permissions.BUDGET_CREATE },
            { permission: Permissions.BUDGET_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintBudgetComponent,
        data: {
          array: [
            { permission: Permissions.BUDGET_VIEW },
            { permission: Permissions.BUDGET_CREATE },
            { permission: Permissions.BUDGET_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: REPORT.BUDGET_REPORT,
        component: BudgetReportComponent,
        data: {
          array: [
            { permission: Permissions.BUDGET_REPORT_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
