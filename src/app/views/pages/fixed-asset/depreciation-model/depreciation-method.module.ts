import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDepreciationComponent } from './create-depreciation/create-depreciation.component';
import { ListDepreciationComponent } from './list-depreciation/list-depreciation.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { DepreciationRoutingModule } from './depreciation-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [
    CreateDepreciationComponent, 
    ListDepreciationComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    DepreciationRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class DepreciationMethodModule { }
