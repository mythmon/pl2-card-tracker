import { CityRowCell } from "./ICityRowCellProps";

import { autobind } from "core-decorators";
import { List, Map, OrderedSet } from "immutable";
import * as React from "react";
import { Dispatch } from "redux";

import { TAction } from "../../state/actions";
import * as citiesActions from "../../state/cities/actions";
import { City } from "../../state/cities/reducer";
import * as citiesSelectors from "../../state/cities/selectors";
import * as infectionActions from "../../state/infection/actions";
import * as infectionSelectors from "../../state/infection/selectors";
import { IAppState } from "../../state/reducer";
import { connect } from "../../utils";
import { CityRowControls } from "./CityRowControls";

import "./style.css";

// Props from state
interface IInfectionTableStateProps {
  cities: OrderedSet<City>;
  phase: number;
  infectionCounts: Map<string, List<number>>;
  citiesEpidemicEnabled: Map<string, boolean>;
  citiesInfectionEnabled: Map<string, boolean>;
}

// Props from mapDispatchToProps
interface IInfectionTableDispatchProps {
  cityAtRisk: (cityName: string, riskFactor: boolean) => void;
  infectCity: (cityName: string) => void;
  epidemicInCity: (cityName: string) => void;
  manualInfectionMovement: (
    { cityName, from, to }: { cityName: string; from: number; to: number },
  ) => void;
}

type IInfectionTableProps = IInfectionTableStateProps &
  IInfectionTableDispatchProps;

@autobind
class InfectionTable extends React.Component<IInfectionTableProps> {
  public static mapStateToProps(state: IAppState): IInfectionTableStateProps {
    return {
      cities: citiesSelectors.sorted(state),
      citiesEpidemicEnabled: infectionSelectors.cityEpidemicEnabled(state),
      citiesInfectionEnabled: infectionSelectors.cityInfectionEnabled(state),
      infectionCounts: infectionSelectors.getCounts(state),
      phase: infectionSelectors.getPhase(state),
    };
  }

  public static mapDispatchToProps(
    dispatch: Dispatch<TAction>,
  ): IInfectionTableDispatchProps {
    return {
      cityAtRisk: (name: string, risk: boolean) =>
        dispatch(citiesActions.setRisk(name, risk)),
      epidemicInCity: (name: string) =>
        dispatch(infectionActions.epidemicInCity(name)),
      infectCity: (name: string) => dispatch(infectionActions.infectCity(name)),
      manualInfectionMovement: opts =>
        dispatch(infectionActions.manualMovement(opts)),
    };
  }

  public render() {
    const {
      cities,
      infectionCounts,
      phase,
      citiesInfectionEnabled,
      citiesEpidemicEnabled,
      manualInfectionMovement,
      infectCity,
      epidemicInCity,
      cityAtRisk,
    } = this.props;

    const phases = ["Unseen"];
    for (let i = 1; i < phase; i++) {
      phases.push(`${i}`);
    }
    phases.push("Discard");

    return (
      <div className="InfectionTable">
        <table>
          <thead>
            <tr>
              <th className="city">City</th>
              {phases.map(p => (
                <th key={p} className="count">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map(({ name, atRisk }: City) => (
              <tr key={name}>
                <CityRowControls
                  name={name}
                  infectionEnabled={!!citiesInfectionEnabled.get(name)}
                  epidemicEnabled={!!citiesEpidemicEnabled.get(name)}
                  isAtRisk={atRisk}
                  onInfect={infectCity}
                  onEpidemic={epidemicInCity}
                  onRisk={cityAtRisk}
                />
                {infectionCounts
                  .get(name, List<number>())
                  .map((cardsLeft: number, i: number) => (
                    <CityRowCell
                      key={i}
                      index={i}
                      name={name}
                      cardsLeft={cardsLeft}
                      toManuallyInfect={manualInfectionMovement}
                    />
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(InfectionTable);
