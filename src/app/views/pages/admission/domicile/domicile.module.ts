import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomicileRoutingModule } from './domicile-routing.module';
import { ListDomicileComponent } from './list-domicile/list-domicile.component';
import { CreateDomicileComponent } from './create-domicile/create-domicile.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [ListDomicileComponent, CreateDomicileComponent],
  imports: [
    CommonModule,
    DomicileRoutingModule,    
    SharedModule,
    PortletModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class DomicileModule { }
