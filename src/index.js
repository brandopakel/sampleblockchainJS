import {action, state} from './store';
import { subscribe, publish } from './network';
action({})

subscribe('BLOCKCHAIN_BROADCAST', (names) => {
  action({type: 'BLOCKCHAIN_BROADCAST', names})
});

subscribe('BLOCKCHAIN_BROADCAST_REQUEST', () => {
  publish('BLOCKCHAIN_BROADCAST', state.blockchains.map((b) => b.name))
});

publish('BLOCKCHAIN_BROADCAST_REQUEST', {});