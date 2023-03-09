import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultyRoutingModule } from './faculty-routing.module';
import { ListFacultyComponent } from './list-faculty/list-faculty.component';
import { PartialsModule } from "../../../partials/partials.module";
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PortletModule } from 'src/app/views/partials/content/general/portlet/portlet.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateFacultyComponent } from './create-faculty/create-faculty.component';


@NgModule({
    declarations: [ListFacultyComponent, CreateFacultyComponent],
    imports: [
        CommonModule,
        FacultyRoutingModule,
        SharedModule,
        PortletModule,
        AgGridModule.withComponents([CustomTooltipComponent])
    ]
})
export class FacultyModule { }
