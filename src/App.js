import React, {Component} from 'react';
import {Button} from '@blueprintjs/core';
import {action} from './store';
import './App.css';

class App extends Component {
  state = {
    ownBlockchainName: ""
  };

  pickBlockchain = (name) => {
    action({type: 'PICK_BLOCKCHAIN', name});
  };

  render(){
    return(
      <div className=''>
        <nav className='bt-navbar'>
          <div className='bt-navbar-group align-left'>
            <div className='bt-navbar-heading'>Sample Blockchain</div>
              <a href='/'> @BP</a>
          </div>
          <div className='bt-navbar-group align-right'>
            <select onChange={evt => {
              this.pickBlockchain(evt.target.value);
            }}
            value={
              this.props.appState.selectedBlockchain
                ? this.props.appState.selectedBlockchain.name
                : ""
            }
            >
              {[
                <option key='default' value="">
                  Pick Blockchain
                </option>
              ].concat(this.props.appState.blockchains.map(b => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))
              )}
            </select>
            <div className='bt-control-group'>
              <div className='bt-input-group'>
                <input
                  className='bt-input'
                  placeholder='Create Your Own'
                  value={this.state.ownBlockchainName}
                  style={{paddingRight: "150px"}}
                  onChange={evt => this.setState({ownBlockchainName: evt.target.value})}
                  onKeyPress={evt => {
                    if(evt.key === 'Enter'){
                      this.pickBlockchain(this.state.ownBlockchainName);
                    }
                  }}
                />
                <div className='bt-input-action'>
                  <Button text='Create' onClick={() => this.blockchain(this.state.ownBlockchainName)}/>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className='container' style={{padding: 24}}>
          {this.props.appState.selectedBlockchain === undefined && (
            <p>
              Learn more about blockchains. Start by picking or creating a new one blockchain in the top-right corner.
            </p>
          )}
          {this.props.appState.selectedBlockchain !== undefined && (
            <BlockchainWelcome
              blockchain={this.props.appState.selectedBlockchain}
              node={this.props.appState.node}
              identities={this.props.appState.identities}
            />
          )}
        </div>
      </div>
    );
  }
};

export default App;