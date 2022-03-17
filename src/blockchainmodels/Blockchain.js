import Block from './Block';
import {maxBy, prop, reduce, reverse, unfold, values} from 'ramda';
import { transactionFromJSON } from './Transaction';
import {blockFromJSON} from './Block';
import {subscribe, publish} from '../network';
import {rerender} from '../store';

class Blockchain{
    constructor(name){
        this.name = name;
        this.genesis = null;
        this.blocks = {};

        this.pendingTransactions = {};

        this.createGenesisBlock();

        subscribe("BLOCKS_BROADCAST", ({blocks, blockchainName}) => {
            if (blockchainName === this.name){
                blocks.forEach(block => this._addBlock(blockFromJSON(this, block)));
            }
        });

        subscribe("TRANSACTION_BROADCAST", ({transaction, blockchainName}) => {
            if (blockchainName === this.name){
                this.pendingTransactions[transaction.hash] = transactionFromJSON(transaction);
            }
        });

        publish("REQUEST_BLOCKS", {blockchainName: this.name});
        subscribe("REQUEST_BLOCKS", ({blockchainName}) => {
            if (blockchainName === this.name){
                publish("BLOCKS_BROADCAST", {
                    blockchainName,
                    blocks: Object.values(this.blocks).map(b => b.toJSON)
                });
            }
        });
    }

    maxHeightBlock(){
        const blocks = values(this.blocks);
        const maxByHeight = maxBy(prop("height"));
        const maxHeightBlock = reduce(maxByHeight, blocks[0],blocks);
        return maxHeightBlock;
    }

    longestChain(){
        const getParent = x => {
            if (x === undefined){
                return false;
            }

            return [x, this.blocks[x.parentHash]];
        };
        return reverse(unfold(getParent, this.maxHeightBlock()));
    }

    containsBlock(block){
        return this.blocks[block.hash] !== undefined;
    }

    createGenesisBlock(){
        const block = new Block({
            blockchain: this,
            parentHash: "root",
            height: 1,
            nonce: this.name
        });
        this.blocks[block.hash] = block;
        this.genesis = block;
    }

    addBlock(newBlock){
        this._addBlock(newBlock);
        publish("BLOCKS_BROADCAST", {
            blocks: [newBlock.toJSON()],
            blockchainName: this.name
        });
    }

    _addBlock(block){
        if(!block.isValid()) return;
        if(this.containsBlock(block)) return;
        
        const parent = this.blocks[block.parentHash];
        if(parent === undefined && parent.height + 1 !== block.height) return;
        
        const isParentMaxHeight = this.maxHeightBlock().hash === parent.hash;

        const newUtxoPool = parent.utxoPool.clone();
        block.utxoPool = newUtxoPool;

        block.utxoPool.addUTXO(block.coinbaseBeneficiary, 12.5);

        const transactions = block.transactions;
        block.transactions = {};
        let containsInvalidTransactions = false;

        Object.values(transactions).forEach(transaction => {
                if (block.isValidTransaction(transaction)) {
                    block.addTransaction(transaction);

                    if (isParentMaxHeight && this.pendingTransactions[transaction.hash])
                        delete this.pendingTransactions[transaction.hash];
                } else{
                    containsInvalidTransactions = true;
                }
            });
        
        if (containsInvalidTransactions){
            return
        }
        
        this.blocks[block.hash] = block;

        rerender();
    }
}

export default Blockchain;