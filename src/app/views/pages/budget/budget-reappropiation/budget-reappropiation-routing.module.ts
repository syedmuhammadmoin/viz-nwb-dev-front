import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateBudgetReappropiationComponent } from './create-budget-reappropiation/create-budget-reappropiation.component';
import { DetailBudgetReapprpriationComponent } from './detail-budget-reapprpriation/detail-budget-reapprpriation.component';
import { ListBudgetReappropiationComponent } from './list-budget-reappropiation/list-budget-reappropiation.component';
import { PrintBudgetReappropriationComponent } from './print-budget-reappropriation/print-budget-reappropriation.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListBudgetReappropiationComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.BUDGET_REAPPROPIATION_VIEW },
        //     { permission: Permissions.BUDGET_REAPPROPIATION_CREATE },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
    ]
  },
  {
    path: CRUD_ROUTES.CREATE,
    component: CreateBudgetReappropiationComponent,
    // data: {
    //   array: [
    //     { permission: Permissions.BUDGET_CREATE },
    //     { permission: Permissions.BUDGET_VIEW },
    //   ]
    // },
    // canActivate: [PermissionGuard] 
  },
  {
    path: CRUD_ROUTES.EDIT,
    component: CreateBudgetReappropiationComponent,
    // data: {
    //   array: [
    //     { permission: Permissions.BUDGET_REAPPROPIATION_CREATE },
    //     { permission: Permissions.BUDGET_REAPPROPIATION_VIEW },
    //   ]
    // },
    // canActivate: [PermissionGuard] 
  },
  {
    path: CRUD_ROUTES.DETAILS,
    component: DetailBudgetReapprpriationComponent,
    // data: {
    //   array: [
    //     { permission: Permissions.BUDGET_REAPPROPIATION_VIEW },
    //     { permission: Permissions.BUDGET_REAPPROPIATION_CREATE },
    //     { permission: Permissions.BUDGET_REAPPROPIATION_EDIT },
    //   ]
    // },
    // canActivate: [PermissionGuard] 
  },
  {
    path: CRUD_ROUTES.PRINT,
    component: PrintBudgetReappropriationComponent,
    // data: {
    //   array: [
    //     { permission: Permissions.BUDGET_REAPPROPIATION_VIEW },
    //     { permission: Permissions.BUDGET_REAPPROPIATION_CREATE },
    //     { permission: Permissions.BUDGET_REAPPROPIATION_EDIT },
    //   ]
    // },
    // canActivate: [PermissionGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetReappropiationRoutingModule { }
