import React from 'react';
import ReactDOM from 'react-dom';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

  const {Component} = React; // import {Component} from 'react';
  const {map} = _; // import {map} from 'lodash'
console.log('horah')
// var c = document.getElementById("myCanvas");

class Cell extends Component {
  render () {
    const {cell} = this.props;
    let classes = "Grid_Cell";
    if (cell && !!cell.player) {
      classes = classes + ' Grid_Cell_Occupied'
    }
    return (
      <div className={classes}>

      </div>
    );
  }
}
class Row extends Component {
  render () {
    const {cells} = this.props;
    const cellComponents = [];
    _.each(cells, (cell) => {
      cellComponents.push(<Cell cell={cell} />);
    })
    return (
      <div className="Grid_Row">
        {cellComponents}
        <div style={{clear: 'both'}} />
      </div>
    );
  }
}
class Grid extends Component {
  constructor (props, context) {
    super(props, context);
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var connection = new WebSocket('wss://pixelon.herokuapp.com/');
    connection.onmessage = (message) => {
      var moves = JSON.parse(message.data).grid;
      // const cells = _.values(json);
      var newGrid = _.clone(this.state.grid);
      for (var key in moves) {
        const position = key.split('|');
        if (position[0] > 0 && position[1] > 0) {
          if (typeof newGrid[position[0]] !== 'undefined' && typeof newGrid[position[0]][position[1]] !== 'undefined') {
            newGrid[position[0]][position[1]] = {
              player: 1
            };
          }
        }
      }
      this.setState({
        grid: newGrid,
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
    const {grid} = this.state;
    const rows = [];
    _.each(grid, function (row, index) {
      rows.push(<Row cells={row} />);
    });
    return (<div>
      {rows}
    </div>);
  }
}
class App extends Component {
  render () {
    return (
			<div className="App">
				<div className="logo-container"><img className="logo"src="pixelon.svg" alt="pixelon" /></div>

				<div className="container">
					<div className="highscores">

						<div className="currentHS">
							<div className="currentName">J0el69</div>
							<div className="currentScore">15,240</div>
						</div>


						<div className="previousHS">
							<div className="previousName">Previ0us</div>
							<div className="previousScore">284,192</div>
						</div>



						<div className= "serverHS">
							<div className="serverName">Server Highsc0re</div>
							<div className="serverScore">12,284,192</div>
						</div>


					 </div>

					 <div className="Game">
						 <Grid />
						{/*<div className="player-blue">
							 <div className="blue-head"></div>
							 <div className="blue-tail"></div>
						</div>

						<div className="player-red">
							 <div className="red-head"></div>
							 <div className="red-tail"></div>
						</div>

						<div className="player-green">
							 <div className="green-head"></div>
							 <div className="green-tail"></div>
						</div>

						<div className="player-orange">
							 <div className="orange-head"></div>
							 <div className="orange-tail"></div>
						</div>*/}

					 </div>
				</div>
			</div>
    );
  }
}
ReactDOM.render(<App />,
     document.getElementById('app')
   );
