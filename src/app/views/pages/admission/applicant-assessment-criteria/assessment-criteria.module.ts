import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssessmentCriteriaRoutingModule } from './assessment-criteria-routing.module';
import { CreateAssessmentCriteriaComponent } from './create-assessment-criteria/create-assessment-criteria.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreateAssessmentCriteriaComponent],
  imports: [
    CommonModule,
    AssessmentCriteriaRoutingModule,
    SharedModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule 
  ]
})
export class AssessmentCriteriaModule { }
