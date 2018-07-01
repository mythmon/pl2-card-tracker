import { ComponentType } from 'react';
import { connect as originalConnect, MapDispatchToPropsParam, MapStateToPropsParam } from 'react-redux';

import { IState } from '../state/reducer';

export interface IConnectable<TStateProps, TDispatchProps, TOwnProps> {
    mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, IState>
    mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
}

export default function connect
    <
    TStateProps, TDispatchProps, TOwnProps
    >
    (
    component: ComponentType & IConnectable<TStateProps, TDispatchProps, TOwnProps>
    ) {
    return originalConnect(component.mapStateToProps, component.mapDispatchToProps)(component);
}