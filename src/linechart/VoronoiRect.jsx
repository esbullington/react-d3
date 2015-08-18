'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiArea = require('./VoronoiArea');

module.exports = React.createClass({

  displayName: 'VoronoiRect',

  getDefaultProps() {
    return { 
      markerWidth: 6,
      markerHeight: 6,
      markerFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState() {
    return {
      markerWidth: this.props.markerWidth,
      markerHeight: this.props.markerHeight,
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
        <rect
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          x={this.props.cx - Math.round(this.props.markerWidth/2)}
          y={this.props.cy - Math.round(this.props.markerHeight/2)}
          width={this.state.markerWidth}
          height={this.state.markerHeight}
          fill={this.state.markerFill}
          className="rd3-linechart-rect"
        />
      </g>
    );
  },

  _animateMarker() {
    this.setState({
      markerWidth: this.props.markerWidth * ( 5 / 4 ),
      markerHeight: this.props.markerHeight * ( 5 / 4 ),
      markerFill: shade(this.props.markerFill, 0.2)
    });
  },

  _restoreMarker() {
    this.setState(
        this.getInitialState()
    );
  }
});
