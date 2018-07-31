import { List, Map } from "immutable";

import { City } from "../cities/reducer";
import { getCitiesState } from "../cities/selectors";
import { IAppState } from "../reducer";
import { IInfectionsState } from "./reducer";

export function getInfectionState(state: IAppState): IInfectionsState {
  return state.infections;
}

export function getCounts(state: IAppState): Map<string, List<number>> {
  return getInfectionState(state).counts;
}

export function getPhase(state: IAppState): number {
  const firstCity = getInfectionState(state).counts.first();
  return firstCity ? firstCity.size - 1 : 0;
}

export function cityInfectionEnabled(state: IAppState): Map<string, boolean> {
  const infectionState = getInfectionState(state);
  const citiesState = getCitiesState(state);
  const phase = getPhase(state);

  let drawPhase: number;
  let found = false;
  for (drawPhase = phase - 1; drawPhase >= 0; drawPhase--) {
    const hasCardsLeft =
      infectionState.counts
        .map((cs: List<number>): number => cs.get(drawPhase))
        .max() > 0;
    if (hasCardsLeft) {
      found = true;
      break;
    }
  }

  let rv = Map<string, boolean>();

  if (found) {
    citiesState.forEach(
      ({ name }: City) =>
        (rv = rv.set(name, infectionState.counts.getIn([name, drawPhase]) > 0)),
    );
  } else {
    citiesState.forEach(({ name }: City) => (rv = rv.set(name, false)));
  }

  return rv;
}

export function cityEpidemicEnabled(state: IAppState): Map<string, boolean> {
  const infectionState = getInfectionState(state);
  const citiesState = getCitiesState(state);
  const phase: number = getPhase(state);

  let drawPhase: number;
  let found = false;
  for (drawPhase = 0; drawPhase < phase; drawPhase++) {
    const hasCardsLeft =
      infectionState.counts
        .map((cs: List<number>): number => cs.get(drawPhase))
        .max() > 0;
    if (hasCardsLeft) {
      found = true;
      break;
    }
  }

  let rv = Map<string, boolean>();

  if (found) {
    citiesState.forEach(
      ({ name }: City) =>
        (rv = rv.set(name, infectionState.counts.getIn([name, drawPhase]) > 0)),
    );
  } else {
    citiesState.forEach(({ name }: City) => (rv = rv.set(name, false)));
  }

  return rv;
}
