'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var MarkerBaseCircle = require('./MarkerBaseCircle');

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  handleOnClick: function(a) {},

  getDefaultProps() {
    return { 
      markerRadius: 3,
      markerFill: '#1f77b4',
      hoverAnimation: true,
      markerAnimationResize: 1.25,
      markerAnimationShade: 0.2,
      chartType: 'chart',
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
    if (this.props.hoverAnimation || this.props.markerOnClick) {
      handleMouseOver = this._animateMarker;
      handleMouseLeave = this._restoreMarker;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    // Callback when marker is clicked/touched
    if (this.props.markerOnClick) {
      this.handleOnClick = this.props.markerOnClick;
    }

    var markerBase = null;
    if (this.props.markerBaseColor) {
      markerBase = <MarkerBaseCircle
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.state.markerRadius * 1.3}
        fill={this.props.markerBaseColor}
        chartType={this.props.chartType}
      />
    }

    return (
      <g>
        {markerBase}
        <circle
          cx={this.props.cx}
          cy={this.props.cy}
          r={this.state.markerRadius}
          fill={this.state.markerFill}
          className={"rd3-" + this.props.chartType + "-circle"}
        />
        <VoronoiArea
          handleMouseOver={handleMouseOver}
          handleMouseLeave={handleMouseLeave}
          handleOnClick={this._callClickCallback}
          handleOnTouchStart={this._callClickCallback}
          handleOnTouchEnd={this.handleMouseLeave}
          voronoiPath={this.props.voronoiPath}
          point={this.props.point}
        />
      </g>
    );
  },

  _animateMarker() {
    this.setState({
      markerRadius: this.props.markerRadius * this.props.markerAnimationResize,
      markerFill: shade(this.props.markerFill, this.props.markerAnimationShade)
    });
  },

  _restoreMarker() {
    this.setState(
      this.getInitialState()
    );
  },

  _callClickCallback() {
    this.handleMouseOver;
    this.handleOnClick(this.props.point);
  }
});
