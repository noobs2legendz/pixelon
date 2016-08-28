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
  componentDidMount () {
    this.refs.name.focus();
  }

  render () {
    const {cell, player, players, name} = this.props;

    return (
      <div className="Player">
        <h2>CHOOSE A NAME</h2>
        <input ref="name" type="text" onKeyPress={this.startGame} defaultValue={name} placeholder="Choose your destiny" />
      </div>
    );
  }
}
