import { autobind } from "core-decorators";
import * as React from "react";
import { FaLongArrowLeft, FaLongArrowRight } from "react-icons/lib/fa";
import Hoverable from "../Hoverable";
import Tally from "../Tally";

interface ICityRowCellProps {
  name: string;
  index: number;
  cardsLeft: number;
  toManuallyInfect: (
    {
      cityName,
      from,
      to,
    }: {
      cityName: string;
      from: number;
      to: number;
    },
  ) => void;
}

@autobind
export class CityRowCell extends React.Component<ICityRowCellProps> {
  public handleMoveLeft() {
    const { toManuallyInfect, name, index } = this.props;
    toManuallyInfect({ cityName: name, from: index, to: index - 1 });
  }

  public handleMoveRight() {
    const { toManuallyInfect, name, index } = this.props;
    toManuallyInfect({ cityName: name, from: index, to: index + 1 });
  }

  public render() {
    const { cardsLeft, index } = this.props;

    return (
      <Hoverable>
        {(isHovered, hoverProps) => {
          const shouldShowLeft = isHovered && cardsLeft > 0 && index > 0;
          const shouldShowRight = isHovered && cardsLeft > 0;

          return (
            <td className="count" {...hoverProps}>
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
        }}
      </Hoverable>
    );
  }
}
