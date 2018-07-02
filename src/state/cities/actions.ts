import { IInitialAction } from "../actions";

export type TCitiesAction = IAddCityAction | IInitialAction;

export interface IAddCityAction {
  type: "CITY_ADD";
  name: string;
}

export function add(name: string): IAddCityAction {
  return {
    name,
    type: "CITY_ADD",
  };
}
