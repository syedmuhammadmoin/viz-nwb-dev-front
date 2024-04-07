import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'countryState',
  defaults: defaultEntityState()
})
@Injectable()
export class CountryStateState extends ProfilingState<any> {
  constructor() {
    super(CountryStateState, 'countryState');
  }
}
