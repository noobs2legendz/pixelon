import React, {Component} from 'react';

import Cell from './cell';

export default class Row extends Component {
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
