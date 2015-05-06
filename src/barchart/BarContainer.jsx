'use strict';

var React = require('react');
var Bar = require('./Rect');
var shade = require('../utils').shade;

module.exports = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    fill: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      offset: 0,
      fill: '#3182BD'
    };
  },

  getInitialState() {
    return {
      // fill is named as fill instead of initialFill to avoid
      // confusion when passing down props from top parent
      fill: this.props.fill
    };
  },

  render() {

    return (
      <Bar
        {...this.props}
        fill={this.state.fill}
        handleMouseOver={this._animateBar}
        handleMouseLeave={this._restoreBar}
      />
    );
  },

  _animateBar() {
    this.setState({ 
      fill: shade(this.props.fill, 0.2)
    });
  },

  _restoreBar() {
    this.setState({ 
      fill: this.props.fill
    });
  },
});
