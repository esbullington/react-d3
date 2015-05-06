'use strict';

var React = require('react');
var Bar = require('./Bar');
var shade = require('../utils').shade;

module.exports = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
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
