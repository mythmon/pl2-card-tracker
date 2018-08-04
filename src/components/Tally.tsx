import * as React from "react";
import { FaBug } from "react-icons/lib/fa";

interface IProps {
  count: number;
}

export default class Tally extends React.Component<IProps> {
  public render(): React.ReactNode {
    const { count } = this.props;
    const ticks = [];
    for (let i = 0; i < count; i++) {
      ticks.push(null);
    }
    return (
      <span style={{ fontFamily: "monospace" }}>
        {ticks.map(() => <FaBug key={"bug"} />)}
      </span>
    );
  }
}
