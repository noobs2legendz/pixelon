import React, {Component} from 'react';
export default class Cell extends Component {
  render () {
    const {cell} = this.props;
    let classes = "Grid_Cell";
    if (cell && !!cell.p) {
      classes = classes + ' Grid_Cell_Occupied'
    }
    return (
      <div className={classes}>
        {cell && cell.p}
      </div>
    );
  }
}
