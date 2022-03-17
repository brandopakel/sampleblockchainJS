import React, {Component} from "react";
import { Tab2, Tabs2 } from "@blueprintjs/core";
import {Tooltip2} from '@blueprintjs/popover2';
import '../App.css';
import {BlockchainTree} from 

class BlockchainWelcome extends Component {
    render(){
        return(
            <div>
                <div style={{width: '65%', display: 'inline-block'}}>
                    <h3>Blockchain Visualization</h3>
                    <BlockchainTree
                        blockchain={this.props.blockchain}
                        identities={this.props.identities}
                        node={this.props.node}
                    />
                </div>
            </div>
        );
    };
};