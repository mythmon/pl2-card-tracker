import * as React from 'react';

interface IProps {
    count: number;
}

export default class Tally extends React.Component<IProps> {
    public render(): React.ReactNode {
        const {count} = this.props;
        const ticks = [];
        for (let i = 0; i < count; i++) {
            ticks.push(null);
        }
        return (
            <span style={{fontFamily: "monospace"}}>
                {ticks.map(() => "|")}
            </span>
        );
    }
}