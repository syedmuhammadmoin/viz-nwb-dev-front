import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'countryState',
  defaults: defaultEntityState()
})
export class CountryStateState extends ProfilingState<any> {
  constructor() {
    super(CountryStateState, 'countryState');
  }
}
