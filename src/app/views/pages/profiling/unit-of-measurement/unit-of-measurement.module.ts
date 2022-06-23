import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUnitOfMeasurementComponent } from './create-unit-of-measurement/create-unit-of-measurement.component';
import { ListUnitOfMeasurementComponent } from './list-unit-of-measurement/list-unit-of-measurement.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { UnitOfMeasurementRoutingModule } from './unit-of-measurement-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [
    CreateUnitOfMeasurementComponent, 
    ListUnitOfMeasurementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    UnitOfMeasurementRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
  ],
  entryComponents: [CreateUnitOfMeasurementComponent]
})
export class UnitOfMeasurementModule { }
