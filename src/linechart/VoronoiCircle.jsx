'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiArea = require('./VoronoiArea');

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  getDefaultProps() {
    return { 
      markerRadius: 3,
      markerFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState() {
    return {
      markerRadius: this.props.markerRadius,
      markerFill: this.props.markerFill
    }
  },

  render() {
    // animation controller
    var handleMouseOver, handleMouseLeave;
    if(this.props.hoverAnimation) {
      handleMouseOver = this._animateMarker;
      handleMouseLeave = this._restoreMarker;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    return (
      <g>
        <VoronoiArea
          handleMouseOver={handleMouseOver}
          handleMouseLeave={handleMouseLeave}
          voronoiPath={this.props.voronoiPath}
        />
        <circle
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          cx={this.props.cx}
          cy={this.props.cy}
          r={this.state.markerRadius}
          fill={this.state.markerFill}
          className="rd3-linechart-circle"
        />
      </g>
    );
  },

  _animateMarker() {
    this.setState({
      markerRadius: this.props.markerRadius * ( 5 / 4 ),
      markerFill: shade(this.props.markerFill, 0.2)
    });
  },

  _restoreMarker() {
    this.setState(
      this.getInitialState()
    );
  }
});
