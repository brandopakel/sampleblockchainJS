import React, { Component } from "react";
import classnames from "classnames";
import { Tab, Tabs, Button } from "@blueprintjs/core";
import NewBlockHeader from "./newblockheader";
import NewBlockTransactionList from "./newblocktransactionlist";
import UTXOPoolTable from "./utxopooltable";
import { Tooltip2 } from "@blueprintjs/popover2";

class NewBlock extends Component {
  addBlock = evt => {
    if (this.props.block.isValid()) {
      this.props.block.blockchain.addBlock(this.props.block);
      this.props.onCancel();
    }
  };

  rerender = () => {
    this.forceUpdate();
  };

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <Tabs id='Block Tab'>
          <Tab
            id="blockheader"
            title="Block Header"
            panel={
              <NewBlockHeader
                block={this.props.block}
                rerender={this.rerender}
              />
            }
          />
          <Tab
            id="txs"
            title={
              <Tooltip2
                content={
                  <p style={{ maxWidth: "250px" }}>
                    Here you can see broadcasted transactions or add your own
                  </p>
                }
                step={14}
                nextButtonVisible={false}
              >
                Transactions
              </Tooltip2>
            }
            panel={
              <NewBlockTransactionList
                block={this.props.block}
                rerender={this.rerender}
              />
            }
          />
          <Tab
            id="utxopool"
            title="UTXO Pool"
            panel={
              <div>
                <p>
                  This represents the UTXO pool after the mining reward and all
                  transactions that would be applied, i.e. the successful mining
                  and validation of a block.
                </p>
                <UTXOPoolTable block={this.props.block} />
              </div>
            }
          />
        </Tabs>

        <div style={{ float: "right" }}>
          <Tooltip2
            content={
              <p style={{ maxWidth: "250px" }}>
                Assuming you did everything right, you have indeed found a
                nonce, that will yield you a valid hash for your block. You can
                now "add" your block to the parent block and brodcast it to
                other nodes. If your block is part of the longest chain of
                blocks and other nodes continue to work of this chain, then
                you'll be indeed the owner of the mining reward.
              </p>
            }
            next={this.addBlock}
            nextLabel="Broadcast my block!"
          >
            <Button
              iconName="add"
              className={classnames("bp3-intent-primary", {
                "bp3-disabled": !this.props.block.isValid()
              })}
              onClick={this.addBlock}
            >
              Add Block
            </Button>
          </Tooltip2>

          <Button
            style={{ marginLeft: "10px", marginRight: "24px" }}
            onClick={this.props.onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default NewBlock;