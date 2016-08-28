import React, {Component} from 'react';
import Mousetrap from 'mousetrap';
import each from 'lodash/each';

import Row from './row';
const PLAYER_COLORS = [
  'red',
  'blue',
  'green',
  'orange'
]
export default class Grid extends Component {
  constructor (props, context) {
    super(props, context);
  }
  componentWillMount () {
    const {connection} = this.props;
    Mousetrap.bind('left', () => {
      connection.send(JSON.stringify({type: 'direction', direction: 'left'}));
    });
    Mousetrap.bind('right', () => {
      connection.send(JSON.stringify({type: 'direction', direction: 'right'}));
    });
    Mousetrap.bind('up', () => {
      connection.send(JSON.stringify({type: 'direction', direction: 'up'}));
    });
    Mousetrap.bind('down', () => {
      connection.send(JSON.stringify({type: 'direction', direction: 'down'}));
    });
  }
  render () {
    const {items, addItem, grid, players, player} = this.props;
    const rows = [];
    _.each(grid, function (row, index) {
      rows.push(<Row player={player} cells={row} players={players} />);
    });
    return (<div>
      {rows}
    </div>);
  }
}
