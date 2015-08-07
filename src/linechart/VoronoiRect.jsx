'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'VoronoiRect',

  getDefaultProps() {
    return { 
      width: 3,
      height: 3,
      rectFill: '#1f77b4',
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
          x={this.props.x - round(this.props.width/2)}
          y={this.props.y - round(this.props.height/2)}
          width={this.props.width}
          height={this.props.height}
          fill={this.props.rectFill}
          className="rd3-linechart-circle"
        />
      </g>
    );
  },
});
