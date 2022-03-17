import React, { Component } from "react";
import SortableTree from "react-sortable-tree";
import { getTreeFromFlatData } from "react-sortable-tree";
import { Button, Dialog } from "@blueprintjs/core";
import { includes, pluck, pipe } from "ramda";
import NewBlock from "./newblock";
import DetailBlock from "./detailblock";
import { last } from "ramda";
import { Tooltip2 } from "@blueprintjs/popover2";

function generateNodeProps(longestChain) {
  return function({ node, path }) {
    const addBlock = () => {
      this.addBlockFrom(node);
    };

    const normalButton = (
      <Button key="add" text="Add block from here" onClick={addBlock} />
    );

    const isMaxHeightBlock = last(longestChain).hash === node.hash;

    return {
      buttons: [
        <Button
          key="detail"
          iconName="database"
          onClick={this.showBlock(node)}
        />,
        isMaxHeightBlock ? (
          <Tooltip2
            content={
              <p style={{ maxWidth: "250px" }}>
                Mining blocks means adding blocks to another parent block by
                pointing to it in the block header. Unless someone else gives
                you coins, mining is the only way for you to get coins, so let's
                start here.
              </p>
            }
            next={addBlock}
            nextLabel="Start mining!"
          >
            {normalButton}
          </Tooltip2>
        ) : (
          normalButton
        )
      ],
      node: {
        title: `Block ${node.hash.substring(0, 10)}`,
        subtitle: `Height ${node.height}`,
        expanded: true
      },
      className: pipe(pluck("hash"), includes(node.hash))(longestChain)
        ? "partOfLongestChain"
        : ""
    };
  };
}

class BlockchainTree extends Component {
  state = {
    addBlock: null,
    showBlock: null
  };
  addBlockFrom = parent => {
    const parentBlock = parent.blockchain.blocks[parent.hash];
    this.setState({
      addBlock: parentBlock.createChild(this.props.node.publicKey)
    });
  };
  showBlock = block => {
    return evt => {
      const showBlock = block.blockchain.blocks[block.hash];
      this.setState({ showBlock });
    };
  };
  closeAddBlock = () => {
    this.setState({ addBlock: null });
  };
  closeShowBlock = () => {
    this.setState({ showBlock: null });
  };
  render() {
    const treeData = getTreeFromFlatData({
      flatData: Object.values(this.props.blockchain.blocks),
      getKey: block => block.hash,
      getParentKey: block => block.parentHash,
      rootKey: this.props.blockchain.genesis.parentHash
    });
    const longestChain = this.props.blockchain.longestChain();
    return (
      <div style={{ height: 800 }}>
        <SortableTree
          treeData={treeData}
          canDrag={false}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={generateNodeProps(longestChain).bind(this)}
        />
        <Dialog
          isOpen={this.state.addBlock !== null}
          onClose={this.closeAddBlock}
          transitionDuration={50}
          title="Add block"
          style={{ width: "95%" }}
        >
          <NewBlock
            block={this.state.addBlock}
            onCancel={this.closeAddBlock}
            node={this.props.node}
          />
        </Dialog>

        <Dialog
          isOpen={this.state.showBlock !== null}
          onClose={this.closeShowBlock}
          transitionDuration={50}
          title="Block Detail"
          style={{ width: "70%" }}
        >
          <DetailBlock
            block={this.state.showBlock}
            onCancel={this.closeShowBlock}
            identities={this.props.identities}
          />
        </Dialog>
      </div>
    );
  }
}

export default BlockchainTree;