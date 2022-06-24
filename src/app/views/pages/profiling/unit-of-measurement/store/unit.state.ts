import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'UnitOfMeasurement',
  defaults: defaultEntityState()
})
export class UnitOfMeasurementState extends ProfilingState<any> {
  constructor() {
    super(UnitOfMeasurementState, 'UnitOfMeasurement');
  }
}
