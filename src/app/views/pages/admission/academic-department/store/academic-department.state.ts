import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'academicDepartment',
  defaults: defaultEntityState()
})
@Injectable()
export class AcademicDepartmentState extends ProfilingState<any> {
  constructor() {
    super(AcademicDepartmentState, 'academicDepartment');
  }
}
