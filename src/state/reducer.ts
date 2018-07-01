import { combineReducers } from 'redux';

import cities, { ICitiesState } from './cities/reducer';
import infections, { IInfectionsState } from './infection/reducer';

export interface IState {
    cities: ICitiesState;
    infections: IInfectionsState,
}

const reducer = combineReducers({
    cities,
    infections,
});

export default reducer;