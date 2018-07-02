import { autobind } from "core-decorators";
import * as React from "react";

import "./App.css";
import InfectionTable from "./components/InfectionTable";
import MetaControls from "./components/MetaControls";

@autobind
export default class App extends React.Component<{}> {
  public render() {
    return (
      <div className="App">
        <InfectionTable />
        <MetaControls />
      </div>
    );
  }
}
