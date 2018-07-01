import { Record, Set } from "immutable";

import { TCitiesAction } from "./actions";

export type ICitiesState = Set<City>;

export interface ICity {
  name: string;
}

export class City extends Record({ name: "" }) implements ICity {
  public name: string;

  constructor(params: ICity) {
    super(params);
  }
}

export default function reducer(
  state: ICitiesState = Set(),
  action: TCitiesAction,
) {
  switch (action.type) {
    case "CITY_ADD": {
      const { name } = action;
      return state.add(new City({ name }));
    }
  }

  return state;
}
