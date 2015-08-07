'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'VoronoiRect',

  getDefaultProps() {
    return { 
      symbolWidth: 6,
      symbolHeight: 6,
      symbolFill: '#1f77b4',
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
          x={this.props.cx - Math.round(this.props.symbolWidth/2)}
          y={this.props.cy - Math.round(this.props.symbolHeight/2)}
          width={this.props.symbolWidth}
          height={this.props.symbolHeight}
          fill={this.props.symbolFill}
          className="rd3-linechart-rect"
        />
      </g>
    );
  },
});
