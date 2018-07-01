import { autobind } from 'core-decorators';
import { List, Map, OrderedSet } from 'immutable'
import * as React from 'react';
import { Dispatch } from 'redux';

import { TAction } from '../state/actions';
import { City } from '../state/cities/reducer'
import * as citiesSelectors from '../state/cities/selectors';
import * as infectionActions from '../state/infection/actions';
import * as infectionSelectors from '../state/infection/selectors';
import { IState } from '../state/reducer';
import { connect } from '../utils';
import Tally from './Tally';

import './InfectionTable.css';

// Props from external user
interface IOwnProps { }

// Props from state
interface IStateProps {
    cities: OrderedSet<City>,
    phase: number,
    infectionCounts: Map<string, List<number>>,
    citiesEpidemicEnabled: Map<string, boolean>,
    citiesInfectionEnabled: Map<string, boolean>,
}

// Props from mapDispatchToProps
interface IDispatchProps {
    infectCity: (cityName: string) => void;
    epidemicInCity: (cityName: string) => void;
}

interface IProps extends IStateProps, IDispatchProps, IOwnProps { };

@autobind
class InfectionTable extends React.Component<IProps> {
    public static mapStateToProps(state: IState): IStateProps {
        return {
            cities: citiesSelectors.sorted(state),
            citiesEpidemicEnabled: infectionSelectors.cityEpidemicEnabled(state),
            citiesInfectionEnabled: infectionSelectors.cityInfectionEnabled(state),
            infectionCounts: infectionSelectors.counts(state),
            phase: infectionSelectors.phase(state),
        }
    }

    public static mapDispatchToProps(dispatch: Dispatch<TAction>, ownProps: IOwnProps): IDispatchProps {
        return {
            epidemicInCity: (name: string) => dispatch(infectionActions.epidemicInCity(name)),
            infectCity: (name: string) => dispatch(infectionActions.infectCity(name)),
        };
    }

    private handleInfect(ev: React.MouseEvent<HTMLButtonElement>) {
        const { infectCity } = this.props;
        const target = ev.target as HTMLButtonElement;
        if (!target.dataset.city) {
            throw new Error("handleInfect target has no dataset.city");
            return;
        }
        infectCity(target.dataset.city);
    }

    private handleEpidemic(ev: React.MouseEvent<HTMLButtonElement>) {
        const { epidemicInCity } = this.props;
        const target = ev.target as HTMLButtonElement;
        if (!target.dataset.city) {
            throw new Error("handleEpidemic target has no dataset.city");
            return;
        }
        epidemicInCity(target.dataset.city);
    }

    public render() {
        const { cities, infectionCounts, phase, citiesInfectionEnabled, citiesEpidemicEnabled } = this.props;

        const phases = [];
        for (let i = 0; i <= phase; i++) {
            phases.push(i);
        }

        return (
            <div className="InfectionTable">
                <table>
                    <thead>
                        <tr>
                            <th className="city">City</th>
                            {phases.map(p => <th key={p} className="count">
                                {p === 0
                                    ? "Unseen"
                                    : p === phase
                                        ? "Discard"
                                        : p
                                }
                            </th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map(({ name }: City) => (
                            <tr key={name}>
                                <th className="city">
                                    {name}
                                    <button
                                        data-city={name}
                                        onClick={this.handleInfect}
                                        disabled={!citiesInfectionEnabled.get(name)}
                                    >
                                        Infect
                                    </button>
                                    <button
                                        data-city={name}
                                        onClick={this.handleEpidemic}
                                        disabled={!citiesEpidemicEnabled.get(name)}
                                    >
                                        Epidemic
                                    </button>
                                </th>
                                {
                                infectionCounts.get(name, List<number>())
                                    .map((cardsLeft: number, i: number) => (
                                        <td key={i} className="count">
                                            <Tally count={cardsLeft} />
                                        </td>
                                    ))
                            }
                            </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(InfectionTable);
