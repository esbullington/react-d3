'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({
  displayName: 'VoronoiArea',

  getDefaultProps() {
    return {
      handleOnClick: function() {}
    };
  },

  render() {
    return (
      <path
        onMouseOver={this.props.handleMouseOver}
        onMouseLeave={this.props.handleMouseLeave}
        onClick={this.props.handleOnClick}
        onTouchStart={this.props.handleOnTouchStart}
        onTouchEnd={this.props.handleOnTouchEnd}
        fill='transparent'
        d={this.props.voronoiPath}
        />
      );
    },
});