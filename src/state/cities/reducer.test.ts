import { Set } from "immutable";
import * as immutableMatchers from "jest-immutable-matchers";

import { initialAction } from "../actions";
import reducer, { City } from "./reducer";

beforeEach(() => {
  jest.addMatchers(immutableMatchers);
});

describe("cities reducer", () => {
  test("it should be immutable", () => {
    expect(reducer(undefined, initialAction)).toBeImmutable();
  });

  test("it should add cities", () => {
    let state: Set<City> = Set();
    state = reducer(state, { name: "New York", type: "CITY_ADD" });
    expect(state).toEqualImmutable(Set([new City({ name: "New York" })]));
  });
});
