'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiCircle');

module.exports = React.createClass({

  displayName: 'VornoiCircleContainer',

  propTypes: {
    circleFill:             React.PropTypes.string,
    circleRadius:           React.PropTypes.number,
    circleRadiusMultiplier: React.PropTypes.number,
    className:              React.PropTypes.string,
    hoverAnimation:         React.PropTypes.bool,
    shadeMultiplier:        React.PropTypes.number,
    vnode:                  React.PropTypes.array.isRequired
  },

  getDefaultProps() {
    return {
      circleFill:             '#1f77b4',
      circleRadius:           3,
      circleRadiusMultiplier: 1.25,
      className:              'rd3-scatterchart-voronoi-circle-container',
      hoverAnimation:         true,
      shadeMultiplier:        0.2
    };
  },

  getInitialState() {
    return {
      circleFill:   this.props.circleFill,
      circleRadius: this.props.circleRadius
    };
  },

  render() {

    var props = this.props;
    var state = this.state;

    return (
      <g
        className={props.className}
      >
        <VoronoiCircle
          circleFill={state.circleFill}
          circleRadius={state.circleRadius}
          cx={props.cx}
          cy={props.cy}
          handleMouseLeave={this._restoreCircle}
          handleMouseOver={this._animateCircle}
          voronoiPath={this._drawPath(props.vnode)}
        />
      </g>
    );
  },

  _animateCircle() {
    var props = this.props;

    if(props.hoverAnimation) {
      var rect = this.getDOMNode().getElementsByTagName("circle")[0].getBoundingClientRect();
      this.props.onMouseOver.call(this, rect.right, rect.top, props.dataPoint )
      this.setState({
        circleFill:   shade(props.circleFill, props.shadeMultiplier),
        circleRadius: props.circleRadius * props.circleRadiusMultiplier
      });
    }
  },

  _restoreCircle() {
    var props = this.props;
    if(props.hoverAnimation) {
      this.setState({
        circleFill:   props.circleFill,
        circleRadius: props.circleRadius
      });
    }
  },

  _drawPath: function(d) {
    if(typeof d === 'undefined') {
      return 'M Z';
    }

    return 'M' + d.join(',') + 'Z';
  },
});
