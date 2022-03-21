import { CreateWarehouseComponent } from 'src/app/views/pages/profiling/warehouse/create-warehouse/create-warehouse.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListLocationComponent } from './list-location/list-location.component';
import { CreateLocationComponent } from './create-location/create-location.component';
import { LocationService } from './service/location.service';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { LocationRoutingModule } from './location-routing.module';
import { ProductService } from '../product/service/product.service';
import { CategoryService } from '../category/service/category.service';
import { BusinessPartnerService } from '../business-partner/service/businessPartner.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { DepartmentService } from '../department/service/department.service';

@NgModule({
  declarations: [
    ListLocationComponent,
    CreateLocationComponent
  ],
  imports: [
    CommonModule,
    PartialsModule,
    SharedModule,
    LocationRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  
  entryComponents : [
    CreateLocationComponent,

  ]
})

export class LocationModule { }
