import { Injectable } from "@angular/core";
import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'Category',
  defaults: defaultEntityState()
})
@Injectable()
export class CategoryState extends ProfilingState<any> {
  constructor() {
    super(CategoryState, 'Category');
  }
}
