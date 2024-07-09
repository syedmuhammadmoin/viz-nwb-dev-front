import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'programState',
  defaults: defaultEntityState()
})
@Injectable()
export class ProgramState extends ProfilingState<any> {
  constructor() {
    super(ProgramState, 'programState');
  }
}
