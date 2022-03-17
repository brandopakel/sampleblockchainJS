import React, { Component } from "react";
import { Icon } from "@blueprintjs/core";
import Key from "./key";
import { state } from "../store";
import UTXOPoolTable from "./utxopooltable";
import AddIdentity from "./addidentity";
import Signature from "./signature";
import { Tooltip2 } from "@blueprintjs/popover2";

export default class NewTransaction extends Component {
    static defaultProps = {
      transaction: null,
      block: null,
      onChangeInputPublicKey: () => {},
      onChangeOutputPublicKey: () => {},
      onChangeTransactionAmount: () => {},
      onChangeFee: () => {},
      onChangeSignature: () => {}
    };

    onChangeSignature = signature => {
      this.props.onChangeSignature(signature);
    };

    onChangeOutputPublicKey = outputPublicKey => {
      this.props.onChangeOutputPublicKey(outputPublicKey);
    };

    onChangeFee = fee => {
      this.props.onChangeFee(fee);
    };

    onChangeTransactionAmount = amount => {
      this.props.onChangeTransactionAmount(amount);
    };
  
    render() {
      return (
        <table>
          <thead>
            <tr>
              <th>Transaction Hash</th>
              <th>Sender Public Key</th>
              <th />
              <th>Receiver Public Key</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <textarea
                  className="bp3-input"
                  spellCheck={false}
                  style={{ width: "150px", height: "75px" }}
                  value={this.props.transaction.hash}
                  readOnly
                />
              </td>
              <td>
                <Tooltip2
                  content={
                    <p style={{ maxWidth: "250px" }}>
                      Click into the text area and specify who the money goes to.
                      Remember whoever has control over this public key will be
                      able to spend the coins. You can always create "another"
                      identity.
                    </p>
                  }
                  nextButtonVisible={false}
                >
                  <Key
                    value={this.props.transaction.inputPublicKey}
                    onChange={this.props.onChangeInputPublicKey}
                    readOnly={false}
                    tooltipText="Specify the public key of the sender"
                    popover={
                      <div style={{ padding: "10px" }}>
                        <h6>Available UTXOs to spend</h6>
                        <UTXOPoolTable
                          block={this.props.block}
                          onSelectRow={utxo =>
                            this.props.onChangeInputPublicKey(utxo.publicKey)
                          }
                        />
                      </div>
                    }
                  />
                </Tooltip2>
              </td>
              <td>
                <Icon iconName="arrow-right" />
              </td>
              <td>
                <Key
                  value={this.props.transaction.outputPublicKey}
                  onChange={this.onChangeOutputPublicKey}
                  readOnly={false}
                  tooltipText="Specify who should receive the coins with their public key"
                  popover={
                    <div style={{ padding: "10px" }}>
                      <h6>Identities you control</h6>
                      {Object.values(state.identities).map(identity => {
                        return (
                          <a
                            key={identity.publicKey}
                            onClick={() =>
                            this.onChangeOutputPublicKey(identity.publicKey)
                            }
                          >
                            <li>{identity.name}</li>
                          </a>
                        );
                      })}
                      <AddIdentity />
                    </div>
                  }
                />
              </td>
              <td>
                <Tooltip2
                  content={<p style={{ maxWidth: "250px" }}>Be generous!</p>}
                  nextButtonVisible={false}
                >
                  <input
                    style={{
                      height: "75px",
                      width: "75px",
                      fontSize: "34px",
                      textAlign: "center"
                    }}
                    type="number"
                    onChange={this.onChangeTransactionAmount}
                    value={this.props.transaction.amount}
                  />
                </Tooltip2>
              </td>
              <td>
                <Tooltip2
                  content={
                    <p style={{ maxWidth: "250px" }}>
                      When you broadcast this transaction, the receiver won't
                      really just take your word for it. To achieve consensus on
                      the blockchain, you need the transaction to be part of a
                      block that hopefully lands in the longest chain of blocks.
                      To incentivize miners to do so, you can add a transaction
                      fee.
                    </p>
                  }
                  nextButtonVisible={false}
                >
                  <input
                    style={{
                      height: "75px",
                      width: "75px",
                      fontSize: "34px",
                      textAlign: "center"
                    }}
                    type="number"
                    onChange={this.onChangeFee}
                    value={this.props.transaction.fee}
                  />
                </Tooltip2>
              </td>
              <td>
                <Tooltip2
                  content={
                    <p style={{ maxWidth: "250px" }}>
                      In order to proof to the network that you indeed can spend
                      these coins, you sign the transaction hash (which encodes
                      all the transaction data) with your corresponding private
                      key
                    </p>
                  }
                  nextButtonVisible={false}
                >
                  <Signature
                    signature={this.props.transaction.signature}
                    messageToSign={this.props.transaction.hash}
                    publicKey={this.props.transaction.inputPublicKey}
                    onChangeSignature={this.onChangeSignature}
                  />
                </Tooltip2>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  }