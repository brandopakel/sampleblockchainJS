import React, { Component } from "react";
import BlockchainTree from "./blockchaintree";
import IdentityListItem from "./identitylistitem";
import { Tab, Tabs } from "@blueprintjs/core";
import WelcomeUTXOPoolTable from "./welcomeutxopooltable";
import "../App.css";
import AddIdentity from "./addidentity";
import { Tooltip2 } from "@blueprintjs/popover2";


class BlockchainWelcome extends Component {
  render() {
    return (
      <div>
        <div style={{ width: "65%", display: "inline-block" }}>
          <h3>Blockchain Visualization</h3>
          <BlockchainTree
            blockchain={this.props.blockchain}
            identities={this.props.identities}
            node={this.props.node}
          />
        </div>
        <div
          style={{
            width: "35%",
            display: "inline-block",
            verticalAlign: "top"
          }}
        >
          <Tabs>
            <Tab
              id="utxo"
              title="UTXOPool"
              panel={
                <div>
                  <p>
                    This is the{" "}
                    <Tooltip2
                      className="bp3-tooltip-indicator"
                      inline={true}
                      content={
                        "A UTXO pool is a list of UTXOs, which are 'owned' by the public key, and can be 'spent' with the corresponding private key."
                      }
                    >
                      UTXO pool
                    </Tooltip2>{" "}
                    for the longest chain. You can click on UTXOs to broadcast a
                    transaction.
                  </p>
                  {this.props.blockchain.maxHeightBlock().isRoot() ? (
                    <p>The root block has no unspent transaction outputs</p>
                  ) : (
                    <WelcomeUTXOPoolTable blockchain={this.props.blockchain} />
                  )}
                </div>
              }
            />
          </Tabs>
          <hr />
          <Tabs>
              <Tab id='nodes' title='Identities'>
                <div>
                    {Object.values(this.props.identities).map(identity => (
                      <IdentityListItem
                        key={identity.publicKey}
                        identity={identity}
                      />
                    ))}
                    <AddIdentity />
                </div>
              </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default BlockchainWelcome;