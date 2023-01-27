import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListUnitOfMeasurementComponent } from './list-unit-of-measurement/list-unit-of-measurement.component';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';


const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListUnitOfMeasurementComponent,
        data: {
          array: [
            { permission: Permissions.UNIT_OF_MEASUREMENT_VIEW },
            { permission: Permissions.UNIT_OF_MEASUREMENT_CREATE },
            { permission: Permissions.UNIT_OF_MEASUREMENT_EDIT },
            { permission: Permissions.UNIT_OF_MEASUREMENT_DELETE },
          ]
        },
        canActivate: [PermissionGuard]
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UnitOfMeasurementRoutingModule { }
