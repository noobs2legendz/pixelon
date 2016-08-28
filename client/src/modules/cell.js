import React, {Component} from 'react';
export default class Cell extends Component {
  render () {
    const {cell, player, players} = this.props;
    let classes = "Grid_Cell";
    if (cell && !!cell.p*1) {
      classes = classes + ' Grid_Cell_Occupied'
      if (cell.p*1 === player*1) {
        classes = classes + ' Grid_Cell_Owner'
        classes = classes + ' Grid_Cell_Occupied_Color_' + players[cell.p];
      } else {
        if (cell && players[cell.p]) {
          classes = classes + ' Grid_Cell_Occupied_Color_' + players[cell.p];
        }
      }
      if (typeof cell.old === 'undefined') {
        classes = classes + ' Grid_Cell_Occupied_Head';
        classes = classes + ' Grid_Cell_Occupied_Head_Color_' + players[cell.p];
      }
    }

    return (
      <div className={classes}>

      </div>
    );
  }
}
