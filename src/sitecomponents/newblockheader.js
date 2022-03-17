import React, { Component } from "react";
import sha256 from "crypto-js/sha256";
import classnames from "classnames";
import { Button } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import Key from "./key";


export default class NewBlockHeader extends Component{
    changeNonce = evt => {
        this.props.block.setNonce(evt.target.value);
        this.props.rerender();
    };

    tryUntilFound = () => {
        if (!this.props.block.isValid()){
            this.props.block.setNonce(
                sha256(new Date().getTime().toString()).toString()
            );
            this.props.rerender();

            if(!this.props.block.isValid()){
                setTimeout(this.tryUntilFound, 2);
            }
        }
    };

    render(){
        return(
            <div>
                <table className="bp3-html-table .modifier">
                        <tbody>
                            <tr>
                            <td />
                            <td>SHA256(</td>
                            </tr>
                            <tr>
                                <td>Parent Hash</td>
                                <td>
                                    <textarea
                                    className="bp3-input"
                                    spellCheck={false}
                                    style={{ width: "150px", height: "75px" }}
                                    value={this.props.block.parentHash}
                                    readOnly
                                    />
                                </td>
                                <td>This value refers to the parent and is thus static.</td>
                            </tr>
                            <tr>
                            <td />
                            <td>+</td>
                            </tr>
                            <tr>
                                <td>Coinbase Beneficiary</td>
                                <td>
                                    <Key value={this.props.block.coinbaseBeneficiary} />
                                </td>
                                <td>This is the public key of your node</td>
                            </tr>
                            <tr>
                            <td />
                            <td>+</td>
                            </tr>
                            <tr>
                                <td>Combined Transactions Hash </td>
                                <td>
                                    <textarea
                                    className="bp3-input"
                                    spellCheck={false}
                                    style={{ width: "150px", height: "75px" }}
                                    value={this.props.block.combinedTransactionsHash()}
                                    readOnly
                                    />
                                </td>
                                <td>
                                    This is the combined hash for all transactions in the block that
                                    is computed via SHA256(txHash1 + txHash2 + ...)
                                </td>
                            </tr>
                            <tr>
                            <td />
                            <td>+</td>
                            </tr>
                            <tr>
                                <td>Nonce</td>
                                    <td>
                                        <Tooltip2
                                        content={
                                            <p style={{ maxWidth: "250px" }}>
                                            The hash of the block is based upon various parameters in this header, like the hash of the parent block, or the receiver of the mining reward (aka coinbase). Per rules of the protocol, the hash has to fullfill certain criteria, such as end in a minimum number of 0s. Changing the nonce allows you to change the hash of the block. Only valid blocks are considered by other nodes, thus if you actually want to receive coins, you better start mining for applicable nonces!
                                            </p>
                                        }
                                        next={this.tryUntilFound}
                                        nextLabel="Crunch some numbers!"
                                        >
                                        <textarea
                                            className="bp3-input"
                                            spellCheck={false}
                                            style={{ width: "150px", height: "75px" }}
                                            value={this.props.block.nonce}
                                            onChange={this.changeNonce}
                                        />
                                        </Tooltip2>
                                    </td>
                                    <td>
                                        This is the part that is miners have to guess random values for
                                        so that the hash becomes valid. Manually try to change the nonce
                                        or <Button onClick={this.tryUntilFound}>brute-force</Button>
                                    </td>
                            </tr>
                            <tr>
                            <td />
                            <td> ) = </td>
                            </tr>
                                        <tr>
                                            <td>Hash</td>
                                            <td>
                                                <textarea
                                                className={classnames("bp3-input", {
                                                    "bp3-intent-danger": !this.props.block.isValid(),
                                                    "bp3-intent-primary": this.props.block.isValid()
                                                })}
                                                spellCheck={false}
                                                style={{ width: "150px", height: "75px" }}
                                                value={this.props.block.hash}
                                                readOnly
                                                />
                                            </td>
                                            <td>
                                                {this.props.block.isValid() &&
                                                "The hash is valid as the last {BLOCK_DIFFICULTY = 2} characters are '0'. "}
                                                {!this.props.block.isValid() &&
                                                "The hash is invalid as the last {BLOCK_DIFFICULTY = 2} characters are not '0'. "}
                                                In real blockchains, this difficulty is dynamic based upon how
                                                many blocks were mined in the recent past
                                            </td>
                                        </tr>
                        </tbody>
                </table>
            </div>
        );
    }
}