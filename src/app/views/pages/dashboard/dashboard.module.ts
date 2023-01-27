// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import {SharedModule} from '../../shared/modules/shared.module';
import {NgApexchartsModule} from "ng-apexcharts";


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      },
    ]),
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgApexchartsModule,
  ],
  providers: [],
  declarations: [
    DashboardComponent,
  ]
})
export class DashboardModule { }
