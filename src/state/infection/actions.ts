import { IInitialAction } from "../actions";

export type TInfectionAction =
  | IInitialAction
  | IInfectCityAction
  | IEpidemicAction
  | IResetAction
  | IManualAction;

export interface IInfectCityAction {
  type: "INFECTION_ADD";
  cityName: string;
}

export interface IEpidemicAction {
  type: "INFECTION_EPIDEMIC";
  cityName: string;
}

export interface IResetAction {
  type: "INFECTION_RESET";
}

export interface IManualAction {
  type: "INFECTION_MANUAL";
  cityName: string;
  from: number;
  to: number;
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

export function reset(): IResetAction {
  return { type: "INFECTION_RESET" };
}

export function manualMovement({
  cityName,
  from,
  to,
}: {
  cityName: string;
  from: number;
  to: number;
}): IManualAction {
  return {
    cityName,
    from,
    to,
    type: "INFECTION_MANUAL",
  };
}
