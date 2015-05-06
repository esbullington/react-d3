'use strict';

var React = require('react');
var shade = require('../utils').shade;
var Cell = require('./Cell');


module.exports = React.createClass({

  displayName: 'CellContainer',

  propTypes: {
    fill: React.PropTypes.string,
  },

  getInitialState() {
    return {
      // fill is named as fill instead of initialFill to avoid
      // confusion when passing down props from top parent
      fill: this.props.fill
    }
  },


  render() {

    return (
      <Cell 
        {...this.props}
        fill={this.state.fill}
        handleMouseOver={this._animateCell}
        handleMouseLeave={this._restoreCell}
      />
    );
  },

  _animateCell() {
    this.setState({
      fill: shade(this.props.fill, 0.05)
    });
  },

  _restoreCell() {
    this.setState({
      fill: this.props.fill
    });
  }
});
