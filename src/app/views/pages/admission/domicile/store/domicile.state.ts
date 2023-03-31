import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'domicile',
  defaults: defaultEntityState()
})
export class DomicileState extends ProfilingState<any> {
  constructor() {
    super(DomicileState, 'domicile');
  }
}
