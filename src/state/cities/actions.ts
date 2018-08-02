import { IInitialAction } from "../actions";

export type TCitiesAction =
  | IAddCityAction
  | ISetCityRiskAction
  | IInitialAction;

export interface IAddCityAction {
  name: string;
  type: "CITY_ADD";
}

export interface ISetCityRiskAction {
  name: string;
  risk: boolean;
  type: "CITY_SET_RISK";
}

export function add(name: string): IAddCityAction {
  return {
    name,
    type: "CITY_ADD",
  };
}

export function setRisk(name: string, risk: boolean): ISetCityRiskAction {
  return {
    name,
    risk,
    type: "CITY_SET_RISK",
  };
}
