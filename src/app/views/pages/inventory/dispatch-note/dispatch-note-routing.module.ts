import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { ListDispatchNoteComponent } from './list-dispatch-note/list-dispatch-note.component';
import { ProductResolverService } from 'src/app/views/shared/resolver/product/product-resolver.service';
import { LocationResolverService } from 'src/app/views/shared/resolver/location/location-resolver.service';
import { WarehouseResolverService } from 'src/app/views/shared/resolver/warehouse/warehouse-resolver.service';
import { BusinessPartnerResolverService } from 'src/app/views/shared/resolver/businessPartner/business-partner-resolver.service';
import { FormConfirmationGuard } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { DispatchNoteDetailComponent } from './dispatch-note-detail/dispatch-note-detail.component';
import { PrintDispatchNoteComponent } from './print-dispatch-note/print-dispatch-note.component';
import { CreateDispatchNoteComponent } from './create-dispatch-note/create-dispatch-note.component';


const routes : Routes = [
  {
    path:'',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListDispatchNoteComponent,
        data: {
          array: [
            { permission: Permissions.GDN_VIEW },
            { permission: Permissions.GDN_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateDispatchNoteComponent,
        canDeactivate: [FormConfirmationGuard],
        data: {
          array: [
            { permission: Permissions.GDN_CREATE },
          ]
        },
        canActivate: [PermissionGuard],
        resolve: {
          productList   : ProductResolverService,
          locationList  : LocationResolverService,
          warehouseList : WarehouseResolverService,
          customerList  : BusinessPartnerResolverService
        }
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateDispatchNoteComponent,
        data: {
          array: [
            { permission: Permissions.GDN_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DispatchNoteDetailComponent,
        data: {
          array: [
            { permission: Permissions.GDN_VIEW },
            { permission: Permissions.GDN_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintDispatchNoteComponent,
        data: {
          array: [
            { permission: Permissions.GDN_VIEW },
            { permission: Permissions.GDN_CREATE },
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
export class DispatchNoteRoutingModule { }
