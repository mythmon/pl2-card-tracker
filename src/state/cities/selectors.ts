import { OrderedSet } from "immutable";

import { IAppState } from "../reducer";
import { City, ICitiesState } from "./reducer";

export function getCitiesState(state: IAppState): ICitiesState {
  return state.cities;
}

export function sorted(state: IAppState): OrderedSet<City> {
  return getCitiesState(state).sort() as OrderedSet<City>;
}
