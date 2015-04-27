'use strict';
// a pure component, know nothing about state, calculating
// main job is to render
var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({
  displayName: 'CircleAndPolygon',

  getDefaultProps() {
    return {
      fill: '#1f77b4',
      className: 'rd3-scatterchart-circle',
      r: '5',
      strokeWidth: '1'
    };
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  },

  render() {
    return (
      <g>
        <path
          onMouseOver={this.props.handleOnMouseOver}
          onMouseLeave={this.props.handleOnMouseLeave}
          fill="white"
          d={this._drawPath(this.props.vnode)} >
        </path>
        <circle
          onMouseOver={this.props.handleOnMouseOver}
          onMouseLeave={this.props.handleOnMouseLeave}
          fill={this.props.fill}
          cx={this.props.cx}
          cy={this.props.cy}
          r={this.props.r}
          className="rd3-scatterchart-circle"
        />
      </g>
    );
  }
});
