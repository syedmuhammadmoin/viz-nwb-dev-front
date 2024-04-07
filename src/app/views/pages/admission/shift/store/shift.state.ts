import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'shiftState',
  defaults: defaultEntityState()
})
@Injectable()
export class ShiftState extends ProfilingState<any> {
  constructor() {
    super(ShiftState, 'shiftState');
  }
}
