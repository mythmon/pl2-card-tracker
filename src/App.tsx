import { autobind } from "core-decorators";
import * as React from "react";

import "./App.css";
import InfectionTable from "./components/InfectionTable";

@autobind
export default class App extends React.Component<{}> {
  public render() {
    return (
      <div className="App">
        <InfectionTable />
      </div>
    );
  }
}
