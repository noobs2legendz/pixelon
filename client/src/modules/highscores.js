import React, {Component} from 'react';
export default class Highscores extends Component {
  render () {
    const {server, current, previous} = this.props.highscores;
    return (
      <div className="highscores">

        <div className="currentHS">
          <div className="currentName">J0el69</div>
          <div className="currentScore">{current}</div>
        </div>


        <div className="previousHS">
          <div className="previousName">Previ0us</div>
          <div className="previousScore">{previous}</div>
        </div>



        <div className= "serverHS">
          <div className="serverName">Server Highsc0re</div>
          <div className="serverScore">{server}</div>
        </div>


       </div>
    );
  }
}
