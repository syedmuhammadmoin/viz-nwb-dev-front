import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule} from 'ag-grid-angular';

import { ReportRoutingModule } from './report-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { PortletModule } from "../../../partials/content/general/portlet/portlet.module";
import { SharedModule } from "../../../shared/modules/shared.module";


@NgModule({
    declarations: [ReportListComponent],
    imports: [
        CommonModule,
        ReportRoutingModule,
        PortletModule,
        SharedModule,
        AgGridModule.withComponents([]),
    ]
})
export class ReportModule { }
