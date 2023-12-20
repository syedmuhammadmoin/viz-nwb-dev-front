import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule} from 'ag-grid-angular';

import { ReportRoutingModule } from './report-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { PortletModule } from "../../../partials/content/general/portlet/portlet.module";
import { SharedModule } from "../../../shared/modules/shared.module";
import { PrintAssetReportComponent } from './print-asset-report/print-asset-report.component';
import { AssetMonthlyReportComponent } from './asset-monthly-report/asset-monthly-report/asset-monthly-report.component';
import { PrintAssetMonthlyReportComponent } from './asset-monthly-report/print-asset-monthly-report/print-asset-monthly-report.component';
import { RegisterAssetComponent } from './register-asset/register-asset.component';


@NgModule({
    declarations: [ReportListComponent, PrintAssetReportComponent, AssetMonthlyReportComponent, PrintAssetMonthlyReportComponent, RegisterAssetComponent],
    imports: [
        CommonModule,
        ReportRoutingModule,
        PortletModule,
        SharedModule,
        AgGridModule.withComponents([]),
    ]
})
export class ReportModule { }
