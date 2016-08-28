import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import Grid from './modules/grid';
import Player from './modules/player';
import Highscores from './modules/highscores';

// This acts as a stack
const PLAYER_COLORS = [
  'red',
  'blue',
  'green',
  'orange'
]

const {Component} = React; // import {Component} from 'react';
const {map} = _; // import {map} from 'lodash'

class App extends Component {
  constructor (props, context) {
     // We use the constructor to make sure our eventHandlers know of `this`
     // Otherwise they will inherit the normal event arguments
     super(props, context);
     this.setName = this.setName.bind(this);
     window.WebSocket = window.WebSocket || window.MozWebSocket;
     var isDebug = function(){
       return window.location.href.search("[?&]debug") !== -1;
     };
     var {color} = props;
     var connection = new WebSocket(isDebug() ? 'ws://127.0.0.1:1337' : 'wss://pixelon.herokuapp.com/');
     window.connection = connection;
     connection.onmessage = (message) => {
       var parsedData = JSON.parse(message.data);
       var moves = parsedData.grid;
       var events = parsedData.events;
       var player = parsedData.player;
       // const cells = _.values(json);
       var newGrid = _.clone(this.state.grid);
       const {players} = this.state;

       if(events.length > 0) {
         console.log(events);
         each(events, (event) => {
           if (typeof event.death !== 'undefined') {
             each(event.pos, (pos) => {
               newGrid[pos.y][pos.x] = null;
             })
             if (event.death*1 === player) {
               this.setName(null);
             }
           }
         })
       }

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
       color: PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)],
       name: null,
       highscores: {
         server: 0,
         current: 0,
         previous: 0,
       }
     }
   }

   setName (name) {
    this.setState({
      name,
    })
   }


  render () {
    const {color, name, players, connection, grid, player, highscores} = this.state;
    return (
			<div className={`App App_Color_${color}`}>
				<div className="logo-container"><img className="logo"src="pixelon.svg" alt="pixelon" /></div>

				<div className="container">
          <Highscores highscores={highscores} />
					 <div className={`Game Game_Color_${color}`}>
           {!name
            ? <Player setName={this.setName} />
            : <Grid color={color} grid={grid} players={players} player={player} connection={connection} />}
					 </div>
				</div>
			</div>
    );
  }
}
ReactDOM.render(<App />,
  document.getElementById('app')
);
