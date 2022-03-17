import React, { Component } from "react";
import { Position } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/labs";
import {Tooltip2} from '@blueprintjs/popover2';

const stringToColour = function(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substring(-2);
    }
    return colour;
};

export default class Key extends Component {
    static defaultProps = {
        readOnly: true,
        onChange: () => {},
        popover: null,
        tooltipText: 'The color will be instances of the key',
        popoverDidOpen: () => {}
    };

    onChange = evt => {
        this.props.onChange(evt.target.value);
    };

    render(){
        return (
            <Tooltip2
                content={this.props.tooltipText}
                inline={true}
                position={Position.TOP}
            >
                <Popover2 autoFocus={false} popoverDidOpen={this.props.popoverDidOpen}>
                        <textarea
                            className="bp3-input"
                            spellCheck={false}
                            style={{
                                width: "150px",
                                height: "75px",
                                borderWidth: "3px",
                                borderStyle: "solid",
                                borderColor: stringToColour(this.props.value)
                            }}
                            value={this.props.value}
                            readOnly={this.props.readOnly}
                            onChange={this.onChange}
                        />
                        {this.props.popover}
                </Popover2>
            </Tooltip2>
        );
    }
}