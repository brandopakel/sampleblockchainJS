import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { action } from "../store";

export default class AddIdentity extends Component {
    render() {
        return (
            <Button
            text="Add another identity"
            iconName="add"
            className="bp3-intent-primary bp3-input-action"
            style={{ paddingLeft: '15px'}}
            onClick={() => action({type: 'ADD_IDENTITY'})}
          />
        );
    }
}