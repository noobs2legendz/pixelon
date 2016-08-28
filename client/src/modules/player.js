import React, {Component} from 'react';
export default class Player extends Component {
  constructor (props, context) {
    super(props, context);
    this.startGame = this.startGame.bind(this);
  }
  startGame (e) {
    const name = e.target.value;
    if (e.key === 'Enter') {
      window.connection.send(JSON.stringify({
        type: 'start',
        name: name
      }));
      this.props.setName(name)
    }
  }


  render () {
    const {cell, player, players} = this.props;


    return (
      <div className="Player">
        <h2>CHOOSE A NAME</h2>
        <input type="text" onKeyPress={this.startGame} placeholder="Choose your destiny" />
      </div>
    );
  }
}
