import { Record, Set } from "immutable";

import { TCitiesAction } from "./actions";

export type ICitiesState = Set<City>;

export interface ICity {
  name: string;
  atRisk?: boolean;
}

export class City extends Record({ name: "", atRisk: false }, "City")
  implements ICity {
  public name: string;
  public atRisk: boolean;

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
      return state.add(new City({ name, atRisk: false }));
    }
    case "CITY_SET_RISK": {
      const { name, risk } = action;
      return state.map((city: City) => {
        if (city.name === name) {
          return city.set("atRisk", risk);
        }
        return city;
      }) as Set<City>;
    }
  }

  return state;
}
