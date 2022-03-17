import React, { Component } from "react";
import { Tab, Tabs } from "@blueprintjs/core";
import BlockInfo from "./blockinfo";
import UTXOPoolTable from "./utxopooltable";
import TransactionTable from "./transactiontable";

class DetailBlock extends Component {
  render() {
    return (
      <div style={{ padding: "10px" }}>
        <Tabs>
          <Tab
            id="blockinfo"
            title="Block Info"
            panel={<BlockInfo block={this.props.block} />}
          />
          <Tab
            id="transactions"
            title="Transactions"
            panel={<TransactionTable transactions={this.props.block.transactions} />}
          />
          <Tab
            id="utxopool"
            title="UTXOPool"
            panel={<UTXOPoolTable block={this.props.block} />}
          />
        </Tabs>
      </div>
    );
  }
}

export default DetailBlock;