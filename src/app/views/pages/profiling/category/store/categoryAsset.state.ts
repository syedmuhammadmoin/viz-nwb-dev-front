import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'CategoryAsset',
  defaults: defaultEntityState()
})
export class CategoryAssetState extends ProfilingState<any> {
  constructor() {
    super(CategoryAssetState, 'CategoryAsset');
  }
}
