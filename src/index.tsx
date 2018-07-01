import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { addCity } from "./state/cities/actions";
import reducer from "./state/reducer";

const middleware = [thunk];

const store = createStore(
  reducer,
  reducer(undefined, { type: "initial" }),
  composeWithDevTools(applyMiddleware(...middleware)),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();

store.dispatch(addCity("New York"));
store.dispatch(addCity("Washington"));
store.dispatch(addCity("Jacksonville"));
store.dispatch(addCity("Sao Paulo"));
store.dispatch(addCity("Lagos"));
store.dispatch(addCity("Tripoli"));
store.dispatch(addCity("Cairo"));
store.dispatch(addCity("Instanbul"));
store.dispatch(addCity("London"));
