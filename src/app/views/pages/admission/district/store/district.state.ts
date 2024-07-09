import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'district',
  defaults: defaultEntityState()
})
@Injectable()
export class DistrictState extends ProfilingState<any> {
  constructor() {
    super(DistrictState, 'district');
  }
}
