import { Injectable } from "@angular/core";
import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'Organization',
  defaults: defaultEntityState()
})
@Injectable()
export class OrganizationState extends ProfilingState<any> {
  constructor() {
    super(OrganizationState, 'Organization');
  }
}
