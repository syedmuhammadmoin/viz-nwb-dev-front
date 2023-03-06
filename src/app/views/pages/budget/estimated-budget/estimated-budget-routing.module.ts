import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from '../../../shared/AppRoutes';
import { Permissions } from '../../../shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { ListEstimatedBudgetComponent } from './list-estimated-budget/list-estimated-budget.component';
import { CreateEstimatedBudgetComponent } from './create-estimated-budget/create-estimated-budget.component';
import { DetailEstimatedBudgetComponent } from './detail-estimated-budget/detail-estimated-budget.component';
import { PrintEstimatedBudgetComponent } from './print-estimated-budget/print-estimated-budget.component';

const routes : Routes = [
  {
    path: '', 
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListEstimatedBudgetComponent,
        data: {
          array: [
            { permission: Permissions.ESTIMATED_BUDGET_VIEW },
            { permission: Permissions.ESTIMATED_BUDGET_CREATE },
            { permission: Permissions.ESTIMATED_BUDGET_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateEstimatedBudgetComponent,
        data: {
          array: [
            { permission: Permissions.ESTIMATED_BUDGET_CREATE },
            { permission: Permissions.ESTIMATED_BUDGET_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateEstimatedBudgetComponent,
        data: {
          array: [
            { permission: Permissions.ESTIMATED_BUDGET_EDIT },
            { permission: Permissions.ESTIMATED_BUDGET_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DetailEstimatedBudgetComponent,
        data: {
          array: [
            { permission: Permissions.ESTIMATED_BUDGET_VIEW },
            { permission: Permissions.ESTIMATED_BUDGET_CREATE },
            { permission: Permissions.ESTIMATED_BUDGET_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintEstimatedBudgetComponent,
        data: {
          array: [
            { permission: Permissions.ESTIMATED_BUDGET_VIEW },
            { permission: Permissions.ESTIMATED_BUDGET_CREATE },
            { permission: Permissions.ESTIMATED_BUDGET_EDIT },
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

export class EstimatedBudgetRoutingModule { }
