'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var MarkerBaseCircle = require('./MarkerBaseCircle');

module.exports = React.createClass({

  displayName: 'VoronoiPolygon',

  handleOnClick: function(a) {},

  getDefaultProps() {
    return { 
      markerRadius: 6,
      markerCorners: 3,
      markerRotationCCW: 90,
      markerFill: '#1f77b4',
      hoverAnimation: true,
      markerAnimationResize: 1.25,
      markerAnimationShade: 0.2,
      chartType: 'chart'
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
    if(this.props.hoverAnimation || this.props.markerOnClick) {
      handleMouseOver = this._animateMarker;
      handleMouseLeave = this._restoreMarker;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    // Callback when marker is clicked/touched
    if(this.props.markerOnClick) {
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
        <path
          fill={this.state.markerFill}
          d={this._calculatePolygonPath(
            this.props.cx,
            this.props.cy,
            this.props.markerCorners,
            this.state.markerRadius,
            this.props.markerRotationCCW)}
          className={'rd3-' + this.props.chartType + '-polygon' + '-' + this.props.markerCorners}
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

  // Calculate path of polygon
  _calculatePolygonPath(centerX, centerY, corners, radius, rotationCCW) {
    var path = '';
    corners = corners >= 3 ? corners : 3;
    var angle = 2 * Math.PI / corners;
    rotationCCW = - rotationCCW / 180 * Math.PI;

    for (var i = 0; i < corners; i++) {
      var posX = centerX + Math.cos(i * angle + rotationCCW) * radius;
      var posY = centerY + Math.sin(i * angle + rotationCCW) * radius;

      // The first time we simply append the coordinates, subsequet times
      // we append a ', ' to distinguish each coordinate pair.
      if (i == 0) {
        path = 'M' + posX + ' ' + posY;
      }
      else {
        path += ' L' + posX + ' ' + posY;
      }
    }
    path += ' Z';
    return path;
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
