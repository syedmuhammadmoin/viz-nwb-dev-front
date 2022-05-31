import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../../profiling/store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'increment',
  defaults: defaultEntityState()
})
export class IncrementState extends ProfilingState<any> {
  constructor() {
    super(IncrementState, 'increment');
  }
}
