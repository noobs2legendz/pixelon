import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import Grid from './modules/grid';
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
     this.state = {
       color: PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)],
     }
   }

  render () {
    const {color} = this.state;
    return (
			<div className={`App App_Color_${color}`}>
				<div className="logo-container"><img className="logo"src="pixelon.svg" alt="pixelon" /></div>

				<div className="container">
          <Highscores />
					 <div className={`Game Game_Color_${color}`}>
						 <Grid color={color} />
					 </div>
				</div>
			</div>
    );
  }
}
ReactDOM.render(<App />,
  document.getElementById('app')
);
