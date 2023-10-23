import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { CreateBudgetReappropriationComponent } from './create-budget-reappropriation/create-budget-reappropriation.component';
import { PrintBudgetReappropriationComponent } from './print-budget-reappropriation/print-budget-reappropriation.component';
import { ListBudgetReappropriationComponent } from './list-budget-reappropriation/list-budget-reappropriation.component';
import { DetailBudgetReappropriationComponent } from './detail-budget-reappropriation/detail-budget-reappropriation.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListBudgetReappropriationComponent,
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
    component: CreateBudgetReappropriationComponent,
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
    component: CreateBudgetReappropriationComponent,
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
    component: DetailBudgetReappropriationComponent,
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
export class BudgetReappropriationRoutingModule { }
