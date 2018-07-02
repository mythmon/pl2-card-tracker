import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import immutableTransform from "redux-persist-transform-immutable";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { addCity } from "./state/cities/actions";
import { City } from "./state/cities/reducer";
import * as citiesSelectors from "./state/cities/selectors";
import reducer from "./state/reducer";

const persistConfig = {
  key: "root",
  storage,
  transforms: [immutableTransform({ records: [City] })],
};
const persistedReducer = persistReducer(persistConfig, reducer);
const middleware = [thunk];

const store = createStore(
  persistedReducer,
  reducer(undefined, { type: "initial" }),
  composeWithDevTools(applyMiddleware(...middleware)),
);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();

// If no cities were rehydrated, add the defaults cities
setTimeout(() => {
  const state = store.getState();
  if (citiesSelectors.sorted(state).size === 0) {
    store.dispatch(addCity("New York"));
    store.dispatch(addCity("Washington"));
    store.dispatch(addCity("Jacksonville"));
    store.dispatch(addCity("Sao Paulo"));
    store.dispatch(addCity("Lagos"));
    store.dispatch(addCity("Tripoli"));
    store.dispatch(addCity("Cairo"));
    store.dispatch(addCity("Instanbul"));
    store.dispatch(addCity("London"));
  }
}, 100);
