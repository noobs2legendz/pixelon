import React, {Component} from 'react';
import Mousetrap from 'mousetrap';

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
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var isDebug = function(){
      return window.location.href.search("[?&]debug") !== -1;
    };
    var {color} = props;
    var connection = new WebSocket(isDebug() ? 'ws://127.0.0.1:1337' : 'wss://pixelon.herokuapp.com/');
    connection.onmessage = (message) => {
      var parsedData = JSON.parse(message.data);
      var moves = parsedData.grid;
      var player = parsedData.player;
      // const cells = _.values(json);
      var newGrid = _.clone(this.state.grid);
      const {players} = this.state;
      for (var key in moves) {
        const position = key.split('|');
        const move = moves[key];

        // add player to game
        if (typeof players[move.p] === 'undefined') {
          if (player !== move.p) {
            players[move.p] = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
          } else {
            players[player] = color;
          }

        }

        if (position[0] >= 0 && position[1] >= 0) {
          if (typeof newGrid[position[1]] !== 'undefined' && typeof newGrid[position[1]][position[0]] !== 'undefined') {
            newGrid[position[1]][position[0]] = move;
          }
        }
      }

      console.log('players', players);

      this.setState({
        grid: newGrid,
        player,
        players,
      })
      // _.each(cells[0], (cell) => {
      // })
    };
    var grid = [];
    var GRID_HEIGHT = 20;
    var GRID_WIDTH = 78;
    for(var i = 0; i < GRID_HEIGHT; i++) {
      var row = [];
      for(var a = 0; a < GRID_WIDTH; a++) {
        row.push(null)
      }
      grid.push(row);
    }
    this.state = {
      grid,
      connection,
      players: {},
    }
  }
  componentWillMount () {
    const {connection} = this.state;
    Mousetrap.bind('left', () => {
      connection.send('left');
    });
    Mousetrap.bind('right', () => {
      connection.send('right');
    });
    Mousetrap.bind('up', () => {
      connection.send('up');
    });
    Mousetrap.bind('down', () => {
      connection.send('down');
    });
  }
  render () {
    const {items, addItem} = this.props;
    const {grid, player, players} = this.state;
    const rows = [];
    _.each(grid, function (row, index) {
      console.log(row.length)
      rows.push(<Row player={player} cells={row} players={players} />);
    });
    return (<div>
      {rows}
    </div>);
  }
}
