import { NgModule} from '@angular/core';
import { CommonModule} from '@angular/common';
import { SharedModule} from 'src/app/views/shared/modules/shared.module';
import { PartialsModule} from 'src/app/views/partials/partials.module';
import { AgGridModule} from 'ag-grid-angular';
import { ListWarehouseComponent} from './list-warehouse/list-warehouse.component';
import { CreateWarehouseComponent} from './create-warehouse/create-warehouse.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';

@NgModule({
  declarations: [
    ListWarehouseComponent,
    CreateWarehouseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    WarehouseRoutingModule,
    AgGridModule
  ]
})
export class WarehouseModule { }
