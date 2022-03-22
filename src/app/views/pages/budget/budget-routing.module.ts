import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { CRUD_ROUTES } from '../../shared/AppRoutes';

const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateBudgetComponent,
        //canDeactivate: [FormConfirmationGuard],
        // data: {
        //   array: [
        //     { permission: Permissions.BANKSTATEMENT_CREATE },
        //   ]
        // },
        // canActivate: [PermissionGuard] 
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
