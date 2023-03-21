
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramRoutingModule } from './program-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { ListProgramComponent } from './list-program/list-program.component';
import { CreateProgramComponent } from './create-program/create-program.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [ListProgramComponent, CreateProgramComponent],
  imports: [
    CommonModule,
    ProgramRoutingModule,
    SharedModule,
    PortletModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
    Ng2SearchPipeModule
  ],
  entryComponents: [CreateProgramComponent]
})
export class ProgramModule { }

