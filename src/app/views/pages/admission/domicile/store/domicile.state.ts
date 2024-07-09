import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'domicile',
  defaults: defaultEntityState()
})
@Injectable()
export class DomicileState extends ProfilingState<any> {
  constructor() {
    super(DomicileState, 'domicile');
  }
}
