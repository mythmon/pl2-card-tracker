import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "../state/reducer";

const middleware = [thunk];

export function makeTestStore() {
  return createStore(
    reducer,
    reducer(undefined, { type: "initial" }),
    applyMiddleware(...middleware),
  );
}
