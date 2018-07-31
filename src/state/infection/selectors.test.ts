import { initialAction } from "../actions";
import reducer from "../reducer";
import { getPhase } from "./selectors";

describe("phase selector", () => {
  test("handle an empty state", () => {
    const state = reducer(undefined, initialAction);
    expect(getPhase(state)).toEqual(0);
  });
});
