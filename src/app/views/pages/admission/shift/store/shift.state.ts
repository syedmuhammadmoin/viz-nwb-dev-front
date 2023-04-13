import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'shiftState',
  defaults: defaultEntityState()
})
export class ShiftState extends ProfilingState<any> {
  constructor() {
    super(ShiftState, 'shiftState');
  }
}
