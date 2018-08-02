import { autobind } from "core-decorators";
import { List, Map, OrderedSet } from "immutable";
import * as React from "react";
import { Dispatch } from "redux";

import { FaBug, FaLongArrowLeft, FaLongArrowRight } from "react-icons/lib/fa";
import { IoNuclear } from "react-icons/lib/io";

import { TAction } from "../state/actions";
import * as citiesActions from "../state/cities/actions";
import { City } from "../state/cities/reducer";
import * as citiesSelectors from "../state/cities/selectors";
import * as infectionActions from "../state/infection/actions";
import * as infectionSelectors from "../state/infection/selectors";
import { IAppState } from "../state/reducer";
import { connect } from "../utils";
import Tally from "./Tally";

import "./InfectionTable.css";

// Props from external user
interface IOwnProps {}

// Props from state
interface IStateProps {
  cities: OrderedSet<City>;
  phase: number;
  infectionCounts: Map<string, List<number>>;
  citiesEpidemicEnabled: Map<string, boolean>;
  citiesInfectionEnabled: Map<string, boolean>;
}

// Props from mapDispatchToProps
interface IDispatchProps {
  cityAtRisk: (cityName: string, riskFactor: boolean) => void;
  infectCity: (cityName: string) => void;
  epidemicInCity: (cityName: string) => void;
  manualInfectionMovement: (
    { cityName, from, to }: { cityName: string; from: number; to: number },
  ) => void;
}

interface IProps extends IStateProps, IDispatchProps, IOwnProps {}

@autobind
class InfectionTable extends React.Component<IProps> {
  public static mapStateToProps(state: IAppState): IStateProps {
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
    ownProps: IOwnProps,
  ): IDispatchProps {
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

  private handleInfect(city: string) {
    this.props.infectCity(city);
  }

  private handleEpidemic(city: string) {
    this.props.epidemicInCity(city);
  }

  private handleRisk(city: string, risk: boolean) {
    this.props.cityAtRisk(city, risk);
  }

  public render() {
    const {
      cities,
      infectionCounts,
      phase,
      citiesInfectionEnabled,
      citiesEpidemicEnabled,
      manualInfectionMovement,
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
                  onInfect={this.handleInfect}
                  onEpidemic={this.handleEpidemic}
                  onRisk={this.handleRisk}
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

interface ICityRowControlsProps {
  name: string;
  infectionEnabled: boolean;
  epidemicEnabled: boolean;
  isAtRisk: boolean;
  onInfect: (city: string) => void;
  onEpidemic: (city: string) => void;
  onRisk: (city: string, atRisk: boolean) => void;
}

@autobind
class CityRowControls extends React.Component<ICityRowControlsProps> {
  public handleInfect() {
    const { name, onInfect } = this.props;
    onInfect(name);
  }

  public handleEpidemic() {
    const { name, onEpidemic } = this.props;
    onEpidemic(name);
  }

  public handleRisk(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, onRisk } = this.props;
    if (event.target.checked) {
      onRisk(name, true);
    } else {
      onRisk(name, false);
    }
  }

  public render() {
    const { name, infectionEnabled, epidemicEnabled, isAtRisk } = this.props;
    return (
      <th className="city">
        <input type="checkbox" onChange={this.handleRisk} checked={isAtRisk} />
        <span className="name">{name}</span>
        <button
          className="action-btn infect"
          onClick={this.handleInfect}
          disabled={!infectionEnabled}
          title="Infect"
        >
          <FaBug />
        </button>
        <button
          className="action-btn epidemic"
          onClick={this.handleEpidemic}
          disabled={!epidemicEnabled}
          title="Epidemic"
        >
          <IoNuclear />
        </button>
      </th>
    );
  }
}

interface ICityRowCellProps {
  name: string;
  index: number;
  cardsLeft: number;
  toManuallyInfect: (
    { cityName, from, to }: { cityName: string; from: number; to: number },
  ) => void;
}

interface ICityRowCellState {
  hover: boolean;
}

@autobind
class CityRowCell extends React.Component<
  ICityRowCellProps,
  ICityRowCellState
> {
  public state = { hover: false };

  public handleMouseEnter() {
    this.setState({ hover: true });
  }

  public handleMouseLeave() {
    this.setState({ hover: false });
  }

  public manualInfectionMove(offset: number) {
    const { toManuallyInfect, name, index } = this.props;
    toManuallyInfect({ cityName: name, from: index, to: index + offset });
  }

  public handleMoveLeft() {
    this.manualInfectionMove(-1);
  }

  public handleMoveRight() {
    this.manualInfectionMove(+1);
  }

  public render() {
    const { cardsLeft, index } = this.props;
    const { hover } = this.state;

    const shouldShowLeft = hover && cardsLeft > 0 && index > 0;
    const shouldShowRight = hover && cardsLeft > 0;

    return (
      <td
        className="count"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div>
          <span className="sider">
            {shouldShowLeft && (
              <FaLongArrowLeft onClick={this.handleMoveLeft} />
            )}
          </span>
          <span className="tally">
            <Tally count={cardsLeft} />
          </span>
          <span className="sider">
            {shouldShowRight && (
              <FaLongArrowRight onClick={this.handleMoveRight} />
            )}
          </span>
        </div>
      </td>
    );
  }
}

export default connect(InfectionTable);
