import { Injectable } from "@angular/core";
import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../../profiling/store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'deduction',
  defaults: defaultEntityState()
})
@Injectable()
export class DeductionState extends ProfilingState<any> {
  constructor() {
    super(DeductionState, 'deduction');
  }
}
