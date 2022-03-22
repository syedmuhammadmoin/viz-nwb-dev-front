import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { CRUD_ROUTES } from '../../shared/AppRoutes';
import { Permissions } from '../../shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';

const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateBudgetComponent,
        //canDeactivate: [FormConfirmationGuard],
        data: {
          array: [
            { permission: Permissions.BUDGET_CREATE },
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
