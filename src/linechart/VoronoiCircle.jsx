'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  getDefaultProps() {
    return { 
      circleRadius: 3,
      circleFill: '#1f77b4',
    };
  },

  render() {
    return (
      <g>
        <path
          onMouseOver={this.props.handleMouseOver}
          onMouseLeave={this.props.handleMouseLeave}
          fill='transparent'
          d={this.props.voronoiPath} 
        />
        <circle
          onMouseOver={this.props.handleMouseOver}
          onMouseLeave={this.props.handleMouseLeave}
          cx={this.props.cx}
          cy={this.props.cy}
          r={this.props.circleRadius}
          fill={this.props.circleFill}
          className="rd3-linechart-circle"
        />
      </g>
    );
  },
});
