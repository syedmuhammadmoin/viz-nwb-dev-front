import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'country',
  defaults: defaultEntityState()
})
export class CountryState extends ProfilingState<any> {
  constructor() {
    super(CountryState, 'country');
  }
}
