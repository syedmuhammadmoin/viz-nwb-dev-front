import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'city',
  defaults: defaultEntityState()
})
export class CityState extends ProfilingState<any> {
  constructor() {
    super(CityState, 'city');
  }
}
