import { List, Map } from "immutable";
import * as immutableMatchers from "jest-immutable-matchers";

import { initialAction } from "../actions";
import reducer, { IInfectionsState } from "./reducer";

beforeEach(() => {
  jest.addMatchers(immutableMatchers);
});

describe("cities reducer", () => {
  test.skip("it should be immutable", () => {
    expect(reducer(undefined, initialAction)).toBeImmutable();
  });

  test("infection should take from the last non-zero before the current phase", () => {
    let state: IInfectionsState = reducer(undefined, initialAction);
    state = reducer(state, { type: "CITY_ADD", name: "Portland" });
    state = reducer(state, { type: "INFECTION_ADD", cityName: "Portland" });
    state = reducer(state, { type: "INFECTION_ADD", cityName: "Portland" });

    expect(state.counts).toEqualImmutable(Map({ Portland: List([1, 2]) }));
  });

  test("epidemic should take from the current round if that's the only thing left", () => {
    let state: IInfectionsState = reducer(undefined, initialAction);
    state = reducer(state, { type: "CITY_ADD", name: "Portland" });
    state = reducer(state, { type: "INFECTION_ADD", cityName: "Portland" });
    state = reducer(state, { type: "INFECTION_ADD", cityName: "Portland" });
    state = reducer(state, { type: "INFECTION_ADD", cityName: "Portland" });
    state = reducer(state, {
      cityName: "Portland",
      type: "INFECTION_EPIDEMIC",
    });

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
});
