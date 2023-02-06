import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { NgModule} from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import { PermissionGuard} from "src/app/core/auth/_guards/permission.guard";
import { Permissions } from "../../../shared/AppEnum";
import { CreateWorkflowComponent} from "./create-workflow/create-workflow.component";
import { ListWorkflowComponent} from "./list-workflow/list-workflow.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListWorkflowComponent,
        data: {
          array: [
            {permission: Permissions.WORKFLOW_VIEW},
            {permission: Permissions.WORKFLOW_CREATE},
            {permission: Permissions.WORKFLOW_EDIT},
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateWorkflowComponent,
        data: {
          array: [
            {permission: Permissions.WORKFLOW_CREATE},
            {permission: Permissions.WORKFLOW_VIEW},
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateWorkflowComponent,
        data: {
          array: [
            {permission: Permissions.WORKFLOW_EDIT},
            {permission: Permissions.WORKFLOW_CREATE},
            {permission: Permissions.WORKFLOW_VIEW},
          ]
        },
        canActivate: [PermissionGuard]
      }
    ]
  },
  {path: '**', redirectTo: '/error/404', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkFlowRoutingModule { }
