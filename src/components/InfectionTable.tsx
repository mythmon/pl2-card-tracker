import { autobind } from 'core-decorators';
import { List, Map, OrderedSet } from 'immutable'
import * as React from 'react';
import { Dispatch } from 'redux';

import { TAction } from '../state/actions';
import { City } from '../state/cities/reducer'
import * as infectionActions from '../state/infection/actions';
import { IState } from '../state/reducer';
import { connect } from '../utils';

import './InfectionTable.css';

// Props from external user
interface IOwnProps { }

// Props from state
interface IStateProps {
    cities: OrderedSet<City>,
    phase: number,
    infectionCounts: Map<string, List<number>>,
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
            cities: state.cities.sort() as OrderedSet<City>,
            infectionCounts: state.infections.counts,
            phase: state.infections.phase,
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
            console.warn("handleInfect target has no dataset.city", target);
            return;
        }
        infectCity(target.dataset.city);
    }

    private handleEpidemic(ev: React.MouseEvent<HTMLButtonElement>) {
        const { epidemicInCity } = this.props;
        const target = ev.target as HTMLButtonElement;
        if (!target.dataset.city) {
            console.warn("handleEpidemic target has no dataset.city", target);
            return;
        }
        epidemicInCity(target.dataset.city);
    }

    public render() {
        const { cities, infectionCounts, phase } = this.props;

        const phases = [];
        for (let i = 0; i <= phase; i++) {
            phases.push(i);
        }

        return (
            <div className="InfectionTable">
                <table>
                    <thead>
                        <tr>
                            <th>City</th>
                            {phases.map(p => <th key={p}>{p}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map(({ name }: City) => (
                            <tr key={name}>
                                <th>
                                    {name}
                                    <button data-city={name} onClick={this.handleInfect}>Infect</button>
                                    <button data-city={name} onClick={this.handleEpidemic}>Epidemic</button>
                                </th>
                                {infectionCounts.get(name, List<number>())
                                    .map((cardsLeft, i) => <td key={i}>{cardsLeft}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(InfectionTable);
