import { List, Map } from "immutable";
import { TAction } from "../actions";

// TODO make this a record type
export interface IInfectionsState {
  counts: Map<string, List<number>>;
  phase: number;
}

const defaultState: IInfectionsState = {
  counts: Map(),
  phase: 1,
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
        phase: 1,
      };
    }

    case "CITY_ADD": {
      const { name } = action;
      return {
        ...state,
        counts: state.counts.update(
          name,
          List<number>(),
          (list: List<number>) => {
            while (list.size <= state.phase) {
              list = list.size === 0 ? list.push(3) : list.push(0);
            }
            return list;
          },
        ),
      };
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
            // TODO the UI shouldn't allow this state
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
      return {
        ...state,
        counts: state.counts.map((counts: List<number>, cn) => {
          if (cn === cityName) {
            const drawPhase = counts.findIndex((n: number) => n > 0);
            counts = counts
              .update(drawPhase, n => n - 1) // draw from the bottom
              .update(counts.size - 1, n => n + 1); // and include in the shuffle
          }
          return counts.push(0);
        }) as Map<string, List<number>>,
        phase: state.phase + 1,
      };
    }
  }

  return state;
}
