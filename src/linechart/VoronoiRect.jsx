'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'VoronoiRect',

  getDefaultProps() {
    return { 
      markerWidth: 6,
      markerHeight: 6,
      markerFill: '#1f77b4',
    };
  },

  render() {
    return (
      <g>
        <path
          onMouseOver={this.props.handleMouseOver}
          onMouseLeave={this.props.handleMouseLeave}
          fill='white'
          d={this.props.voronoiPath} 
        />
        <rect
          onMouseOver={this.props.handleMouseOver}
          onMouseLeave={this.props.handleMouseLeave}
          x={this.props.cx - Math.round(this.props.markerWidth/2)}
          y={this.props.cy - Math.round(this.props.markerHeight/2)}
          width={this.props.markerWidth}
          height={this.props.markerHeight}
          fill={this.props.markerFill}
          className="rd3-linechart-rect"
        />
      </g>
    );
  },
});
