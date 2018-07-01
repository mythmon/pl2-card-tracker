import { List, Map } from 'immutable';

import { City } from '../cities/reducer';
import { getCitiesState } from '../cities/selectors';
import { IState } from "../reducer";
import { IInfectionsState } from "./reducer";

export function getInfectionState(state: IState): IInfectionsState {
    return state.infections;
}

export function counts(state: IState): Map<string, List<number>> {
    return getInfectionState(state).counts;
}

export function phase(state: IState): number {
    return getInfectionState(state).phase;
}

export function cityInfectionEnabled(state: IState): Map<string, boolean> {
    const infectionState = getInfectionState(state);
    const citiesState = getCitiesState(state);

    let drawPhase: number;
    let found = false;
    for (drawPhase = infectionState.phase - 1; drawPhase >= 0; drawPhase--) {
        const hasCardsLeft = infectionState.counts.map((cs: List<number>): number => cs.get(drawPhase)).max() > 0;
        if (hasCardsLeft) {
            found = true;
            break;
        }
    }

    let rv = Map<string, boolean>();

    if (found) {
        citiesState.forEach(({name}: City) => rv = rv.set(name, infectionState.counts.getIn([name, drawPhase]) > 0));
    } else {
        citiesState.forEach(({name}: City) => rv = rv.set(name, false));
    }

    return rv;
}

export function cityEpidemicEnabled(state: IState): Map<string, boolean> {
    const infectionState = getInfectionState(state);
    const citiesState = getCitiesState(state);

    let drawPhase: number;
    let found = false;
    for (drawPhase = 0; drawPhase < infectionState.phase; drawPhase++) {
        const hasCardsLeft = infectionState.counts.map((cs: List<number>): number => cs.get(drawPhase)).max() > 0;
        if (hasCardsLeft) {
            found = true;
            break;
        }
    }

    let rv = Map<string, boolean>();

    if (found) {
        citiesState.forEach(({name}: City) => rv = rv.set(name, infectionState.counts.getIn([name, drawPhase]) > 0));
    } else {
        citiesState.forEach(({name}: City) => rv = rv.set(name, false));
    }

    return rv;
}