import { List, Map } from 'immutable';
import * as immutableMatchers from 'jest-immutable-matchers';

import { initialAction } from '../actions';
import reducer, { IInfectionsState } from './reducer';

beforeEach(() => {
    jest.addMatchers(immutableMatchers);
});

describe('cities reducer', () => {
    test.skip('it should be immutable', () => {
        expect(reducer(undefined, initialAction)).toBeImmutable();
    });

    test('it should take from the last non-zero before the current phase', () => {
        let state: IInfectionsState = reducer(undefined, initialAction);
        state = reducer(state, { type: 'CITY_ADD', name: 'Portland' });
        state = reducer(state, { type: 'INFECTION_ADD', cityName: 'Portland' });
        state = reducer(state, { type: 'INFECTION_ADD', cityName: 'Portland' });

        expect(state.counts).toEqualImmutable(Map({ Portland: List([1, 2]) }));
    });
});
