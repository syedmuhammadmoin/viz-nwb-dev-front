import { defaultEntityState, ProfilingState, ProfilingStateModel } from '../../../profiling/store/profiling.state';
import { State } from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'employee',
  defaults: defaultEntityState()
})

export class EmployeeState extends ProfilingState<any> {
  constructor() {
    super(EmployeeState, 'employee');
  }
}

