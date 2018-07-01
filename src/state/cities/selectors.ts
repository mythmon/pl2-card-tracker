import { OrderedSet } from "immutable";

import { IState } from "../reducer";
import { City, ICitiesState } from "./reducer";

export function getCitiesState(state: IState): ICitiesState {
    return state.cities;
}

export function sorted(state: IState): OrderedSet<City> {
    return getCitiesState(state)
        .sort() as OrderedSet<City>;
}