import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdmissionCriteriaRoutingModule} from './admission-criteria-routing.module';
import {SharedModule} from 'src/app/views/shared/modules/shared.module';
import {PartialsModule} from 'src/app/views/partials/partials.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListAdmissionCriteriaComponent} from './list-admission-criteria/list-admission-criteria.component';
import {CreateAdmissionCriteriaComponent} from './create-admission-criteria/create-admission-criteria.component';
import {DetailAdmissionCriteriaComponent} from './detail-admission-criteria/detail-admission-criteria.component';
import {AgGridModule} from 'ag-grid-angular';
import {CustomTooltipComponent} from '../../../shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [
    ListAdmissionCriteriaComponent,
    CreateAdmissionCriteriaComponent,
    DetailAdmissionCriteriaComponent
  ],
  imports: [
    CommonModule,
    AdmissionCriteriaRoutingModule,
    SharedModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class AdmissionCriteriaModule {
}
