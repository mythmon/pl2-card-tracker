import { IInitialAction } from "../actions";

export type TInfectionAction =
  | IInitialAction
  | IInfectCityAction
  | IEpidemicAction;

export interface IInfectCityAction {
  type: "INFECTION_ADD";
  cityName: string;
}

export interface IEpidemicAction {
  type: "INFECTION_EPIDEMIC";
  cityName: string;
}

export function infectCity(cityName: string): IInfectCityAction {
  return {
    cityName,
    type: "INFECTION_ADD",
  };
}

export function epidemicInCity(cityName: string): IEpidemicAction {
  return {
    cityName,
    type: "INFECTION_EPIDEMIC",
  };
}
