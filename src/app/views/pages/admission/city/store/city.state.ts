import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'city',
  defaults: defaultEntityState()
})
@Injectable()
export class CityState extends ProfilingState<any> {
  constructor() {
    super(CityState, 'city');
  }
}
