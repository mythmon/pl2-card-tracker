import { autobind } from "core-decorators";
import * as React from "react";

interface IHoverableProps {
  children: (
    isHovered: boolean,
    hoverProps: { onMouseEnter: () => void; onMouseLeave: () => void },
  ) => React.ReactElement<any>;
}
interface IHoverableState {
  hover: boolean;
}

@autobind
export default class Hoverable extends React.Component<
  IHoverableProps,
  IHoverableState
> {
  public state = { hover: false };

  public handleMouseEnter() {
    this.setState({ hover: true });
  }

  public handleMouseLeave() {
    this.setState({ hover: false });
  }

  public render() {
    const { children } = this.props;
    const { hover } = this.state;

    return children(hover, {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
    });
  }
}
