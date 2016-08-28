import React, {Component} from 'react';
export default class Cell extends Component {
  render () {
    const {cell, player, players} = this.props;
    let classes = "Grid_Cell";
    if (cell && !!cell.p) {
      classes = classes + ' Grid_Cell_Occupied'
    }
    if (cell && !!cell.p && cell.p === player) {
      classes = classes + ' Grid_Cell_Owner'
      classes = classes + ' Grid_Cell_Occupied_Color_' + players[cell.p];
    } else {
      if (cell && players[cell.p]) {
        classes = classes + ' Grid_Cell_Occupied_Color_' + players[cell.p];
      }
    }
    return (
      <div className={classes}>
        
      </div>
    );
  }
}
