import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { BidEvaluationDetailComponent } from './bid-evaluation-detail/bid-evaluation-detail.component';
import { CreateBidEvaluationComponent } from './create-bid-evaluation/create-bid-evaluation.component';
import { ListBidEvaluationComponent } from './list-bid-evaluation/list-bid-evaluation.component';
import { PrintBidEvaluationComponent } from './print-bid-evaluation/print-bid-evaluation.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListBidEvaluationComponent,
        data: {
          array: [
            { permission: Permissions.BIDEVALUATION_VIEW },
            { permission: Permissions.BIDEVALUATION_CREATE },
            { permission: Permissions.BIDEVALUATION_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateBidEvaluationComponent,
        data: {
          array: [
            { permission: Permissions.BIDEVALUATION_CREATE },
            { permission: Permissions.BIDEVALUATION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateBidEvaluationComponent,
        data: {
          array: [
            { permission: Permissions.BIDEVALUATION_EDIT },
            { permission: Permissions.BIDEVALUATION_VIEW },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: BidEvaluationDetailComponent,
        data: {
          array: [
            { permission: Permissions.BIDEVALUATION_VIEW },
            { permission: Permissions.BIDEVALUATION_EDIT },
            { permission: Permissions.BIDEVALUATION_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintBidEvaluationComponent,
        data: {
          array: [
            { permission: Permissions.BIDEVALUATION_VIEW },
            { permission: Permissions.BIDEVALUATION_EDIT },
            { permission: Permissions.BIDEVALUATION_CREATE },
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
export class BidEvaluationRoutingModule { }
