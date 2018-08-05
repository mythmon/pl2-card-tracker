import { ComponentType } from "react";
import {
  connect as originalConnect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";

import { IAppState } from "../state/reducer";

export interface IConnectable<TStateProps, TDispatchProps, TOwnProps> {
  mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, IAppState>;
  mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>;
}

export default function connect<TStateProps, TDispatchProps, TOwnProps>(
  component: ComponentType &
    IConnectable<TStateProps | void, TDispatchProps | void, TOwnProps | void>,
) {
  return originalConnect(
    component.mapStateToProps || (() => undefined),
    component.mapDispatchToProps || (() => undefined),
  )(component);
}
