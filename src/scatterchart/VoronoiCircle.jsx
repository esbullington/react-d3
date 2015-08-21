'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  propTypes: {
    circleFill:       React.PropTypes.string.isRequired,
    circleRadius:     React.PropTypes.number.isRequired,
    className:        React.PropTypes.string,
    cx:               React.PropTypes.number.isRequired,
    cy:               React.PropTypes.number.isRequired,
    handleMouseLeave: React.PropTypes.func.isRequired,
    handleMouseOver:  React.PropTypes.func.isRequired,
    pathFill:         React.PropTypes.string,
    voronoiPath:      React.PropTypes.string.isRequired
  },

  getDefaultProps() {
    return {
      className:    'rd3-scatterchart-voronoi-circle',
      pathFill:     'transparent'
    };
  },

  render() {
    var props = this.props;

    return (
      <g>
        <path
          d={props.voronoiPath}
          fill={props.pathFill}
          onMouseLeave={props.handleMouseLeave}
          onMouseOver={props.handleMouseOver}
        />
        <circle
          cx={props.cx}
          cy={props.cy}
          className={props.className}
          fill={props.circleFill}
          onMouseLeave={props.handleMouseLeave}
          onMouseOver={props.handleMouseOver}
          r={props.circleRadius}
        />
      </g>
    );
  },
});
