import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'country',
  defaults: defaultEntityState()
})
@Injectable()
export class CountryState extends ProfilingState<any> {
  constructor() {
    super(CountryState, 'country');
  }
}
