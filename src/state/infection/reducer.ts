import { List, Map } from "immutable";
import { TAction } from "../actions";

// TODO make this a record type
export interface IInfectionsState {
  counts: Map<string, List<number>>;
}

const defaultState: IInfectionsState = {
  counts: Map(),
};

export default function reducer(
  state: IInfectionsState = defaultState,
  action: TAction,
): IInfectionsState {
  switch (action.type) {
    case "INFECTION_RESET": {
      return {
        counts: state.counts.map(() => List([3, 0])) as Map<
          string,
          List<number>
        >,
      };
    }

    case "CITY_ADD": {
      const { name } = action;
      const newState = {
        ...state,
        counts: state.counts.set(name, List<number>([3])),
      };
      return ensureCityLengths(newState);
    }

    case "INFECTION_ADD": {
      const { cityName } = action;
      return {
        ...state,
        counts: state.counts.update(cityName, citiesInfections => {
          if (!citiesInfections) {
            throw new Error(`Missing city ${cityName}`);
          }
          const drawFrom = (citiesInfections.slice(0, -1) as List<
            number
          >).findLastIndex(v => (v as number) > 0);
          if (drawFrom === -1) {
            throw new Error(
              `Unexpected infection of city "${cityName}". No cards left.`,
            );
          }
          return citiesInfections
            .update(drawFrom, n => n - 1)
            .update(citiesInfections.size - 1, n => n + 1);
        }),
      };
    }

    case "INFECTION_EPIDEMIC": {
      const { cityName } = action;
      const newState = {
        ...state,
        counts: state.counts.update(cityName, (counts: List<number>) => {
          const drawPhase = counts.findIndex((n: number) => n > 0);
          return counts
            .update(drawPhase, n => n - 1) // draw from the bottom
            .update(counts.size - 1, n => n + 1) // and include in the shuffle
            .push(0); // and now begins the next phase
        }),
      };
      return ensureCityLengths(newState);
    }

    case "INFECTION_MANUAL": {
      const { cityName, from, to } = action;
      const newState = {
        ...state,
        counts: state.counts.map((counts: List<number>, cn) => {
          if (cn === cityName) {
            while (counts.size < to + 1) {
              counts = counts.push(0);
            }
            counts = counts.update(from, n => n - 1).update(to, n => n + 1);
          }
          return counts;
        }) as Map<string, List<number>>,
      };
      return ensureCityLengths(newState);
    }
  }

  return state;
}

/**
 * Ensure that all cities have the same length by extending all cities to match
 * the longest one.
 */
function ensureCityLengths(state: IInfectionsState): IInfectionsState {
  let maxCityLength = state.counts
    .map((counts: List<number>) => counts.size)
    .max();
  if (maxCityLength < 2) {
    maxCityLength = 2;
  }
  return {
    ...state,
    counts: state.counts.map(
      (counts: List<number>) =>
        counts.size < maxCityLength
          ? counts.setSize(maxCityLength).map(n => (n ? n : 0))
          : counts,
    ) as Map<string, List<number>>,
  };
}
