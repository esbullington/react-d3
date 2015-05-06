'use strict';

var React = require('react');
var shade = require('../utils').shade;
var Arc = require('./Arc');

module.exports = React.createClass({

  displayName: 'ArcContainer',

  propTypes: {
    fill: React.PropTypes.string
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
      <Arc 
        {...this.props}
        fill={this.state.fill}
        handleMouseOver={this._animateArc}
        handleMouseLeave={this._restoreArc}
      />
    );
  },

  _animateArc() {
    this.setState({
      fill: shade(this.props.fill, 0.2)
    });
  },

  _restoreArc() {
    this.setState({
      fill: this.props.fill
    });
  }
});
