import React, {Component} from 'react';
export default class Highscores extends Component {
  render () {
    return (
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
    );
  }
}
