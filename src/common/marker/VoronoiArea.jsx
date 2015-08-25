'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({
  displayName: 'VoronoiArea',

  render() {
    return (
      <path
        onMouseOver={this.props.handleMouseOver}
        onMouseLeave={this.props.handleMouseLeave}
        fill='transparent'
        d={this.props.voronoiPath}
        />
      );
    },
});