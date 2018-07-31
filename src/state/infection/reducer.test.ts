import { List, Map } from "immutable";
import * as immutableMatchers from "jest-immutable-matchers";

import { initialAction, TAction } from "../actions";
import reducer, { IInfectionsState } from "./reducer";

function actionSeries(
  actions: TAction[],
  { debug = false }: { debug?: boolean } = {},
) {
  let state = reducer(undefined, initialAction);
  if (debug) {
    console.log(state);
  }
  for (const action of actions) {
    state = reducer(state, action);
    if (debug) {
      console.log(state);
    }
  }
  return state;
}

beforeEach(() => {
  jest.addMatchers(immutableMatchers);
});

describe("cities reducer", () => {
  test.skip("it should be immutable", () => {
    expect(reducer(undefined, initialAction)).toBeImmutable();
  });

  test("infection should take from the last non-zero before the current phase", () => {
    const state: IInfectionsState = actionSeries([
      { type: "CITY_ADD", name: "Portland" },
      { type: "INFECTION_ADD", cityName: "Portland" },
      { type: "INFECTION_ADD", cityName: "Portland" },
    ]);

    expect(state.counts).toEqualImmutable(Map({ Portland: List([1, 2]) }));
  });

  test("epidemic should take from the current round if that's the only thing left", () => {
    const state: IInfectionsState = actionSeries([
      { type: "CITY_ADD", name: "Portland" },
      { type: "INFECTION_ADD", cityName: "Portland" },
      { type: "INFECTION_ADD", cityName: "Portland" },
      { type: "INFECTION_ADD", cityName: "Portland" },
      { cityName: "Portland", type: "INFECTION_EPIDEMIC" },
    ]);

    expect(state.counts).toEqualImmutable(Map({ Portland: List([0, 3, 0]) }));
  });

  test("epidemic should go in the top stack", () => {
    let state: IInfectionsState = reducer(undefined, initialAction);
    state = reducer(state, { type: "CITY_ADD", name: "Portland" });
    expect(state.counts).toEqualImmutable(Map({ Portland: List([3, 0]) }));
    state = reducer(state, { type: "INFECTION_ADD", cityName: "Portland" });
    expect(state.counts).toEqualImmutable(Map({ Portland: List([2, 1]) }));
    state = reducer(state, {
      cityName: "Portland",
      type: "INFECTION_EPIDEMIC",
    });
    expect(state.counts).toEqualImmutable(Map({ Portland: List([1, 2, 0]) }));
  });

  test("manual movement should work", () => {
    const state = actionSeries([
      { type: "CITY_ADD", name: "Portland" },
      { type: "INFECTION_MANUAL", cityName: "Portland", from: 0, to: 2 },
    ]);
    expect(state.counts).toEqualImmutable(Map({ Portland: List([2, 0, 1]) }));
  });

  test("manual movement should make all cities the same length", () => {
    const state = actionSeries([
      { type: "CITY_ADD", name: "Portland, OR" },
      { type: "CITY_ADD", name: "Portland, ME" },
      { type: "INFECTION_MANUAL", cityName: "Portland, OR", from: 0, to: 2 },
    ]);
    expect(state.counts).toEqualImmutable(
      Map({ "Portland, OR": List([2, 0, 1]), "Portland, ME": List([3, 0, 0]) }),
    );
  });

  test("manual movement complicated", () => {
    const state = actionSeries([
      { type: "CITY_ADD", name: "Portland, OR" },
      { type: "CITY_ADD", name: "Portland, ME" },
      { type: "INFECTION_MANUAL", cityName: "Portland, OR", from: 0, to: 2 },
      { type: "INFECTION_MANUAL", cityName: "Portland, ME", from: 0, to: 2 },
      { type: "INFECTION_MANUAL", cityName: "Portland, OR", from: 0, to: 2 },
      { type: "INFECTION_MANUAL", cityName: "Portland, ME", from: 2, to: 1 },
      { type: "INFECTION_MANUAL", cityName: "Portland, OR", from: 2, to: 1 },
    ]);
    expect(state.counts).toEqualImmutable(
      Map({ "Portland, OR": List([1, 1, 1]), "Portland, ME": List([2, 1, 0]) }),
    );
  });
});
