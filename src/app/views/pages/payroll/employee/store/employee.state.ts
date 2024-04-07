import { Injectable } from '@angular/core';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from '../../../profiling/store/profiling.state';
import { State } from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'employee',
  defaults: defaultEntityState()
})
@Injectable()
export class EmployeeState extends ProfilingState<any> {
  constructor() {
    super(EmployeeState, 'employee');
  }
}

