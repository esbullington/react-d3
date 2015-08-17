'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiArea = require('./VoronoiArea');

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  getDefaultProps() {
    return { 
      markerRadius: 3,
      markerFill: '#1f77b4',
    };
  },

  render() {
    return (
      <g>
        <VoronoiArea
          handleMouseOver={this.props.handleMouseOver}
          handleMouseLeave={this.props.handleMouseLeave}
          voronoiPath={this.props.voronoiPath}
        />
        <circle
          onMouseOver={this.props.handleMouseOver}
          onMouseLeave={this.props.handleMouseLeave}
          cx={this.props.cx}
          cy={this.props.cy}
          r={this.props.markerRadius}
          fill={this.props.markerFill}
          className="rd3-linechart-circle"
        />
      </g>
    );
  },
});
