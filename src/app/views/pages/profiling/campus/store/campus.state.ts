import { Injectable } from '@angular/core';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../store/profiling.state';
import {State} from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'campus',
  defaults: defaultEntityState()
})
@Injectable()
export class CampusState extends ProfilingState<any> {
  constructor() {
    super(CampusState, 'campus');
  }
}

