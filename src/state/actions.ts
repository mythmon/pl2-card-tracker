import { TCitiesAction } from "./cities/actions";
import { TInfectionAction } from "./infection/actions";

export type TAction = 
    IInitialAction
    | TCitiesAction
    | TInfectionAction
    ;

export interface IInitialAction {
    type: "@@INITIAL",
}

export const initialAction: IInitialAction = {
    type: "@@INITIAL",
}