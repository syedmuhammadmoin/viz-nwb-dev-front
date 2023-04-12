import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'academicDepartment',
  defaults: defaultEntityState()
})
export class AcademicDepartmentState extends ProfilingState<any> {
  constructor() {
    super(AcademicDepartmentState, 'academicDepartment');
  }
}
