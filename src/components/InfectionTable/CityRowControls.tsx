import { autobind } from "core-decorators";
import * as React from "react";
import { FaBug } from "react-icons/lib/fa";
import { IoNuclear } from "react-icons/lib/io";

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
export class CityRowControls extends React.Component<ICityRowControlsProps> {
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
    onRisk(name, event.target.checked);
  }

  public render() {
    const { name, infectionEnabled, epidemicEnabled, isAtRisk } = this.props;
    const risk = isAtRisk ? "risky " : "safe ";

    return (
      <th className={risk + "city"}>
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
