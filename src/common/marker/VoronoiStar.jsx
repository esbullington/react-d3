'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var MarkerBaseCircle = require('./MarkerBaseCircle');

module.exports = React.createClass({

  displayName: 'VoronoiStar',

  handleOnClick: function(a) {},

  getDefaultProps() {
    return { 
      markerOuterRadius: 6,
      markerInnerRadius: 3,
      arms: 5,
      markerFill: '#1f77b4',
      hoverAnimation: true,
      markerAnimationResize: 1.25,
      markerAnimationShade: 0.2,
      chartType: 'chart'
    };
  },

  getInitialState() {
    return {
      markerOuterRadius: this.props.markerOuterRadius,
      markerInnerRadius: this.props.markerInnerRadius,
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
        r={this.state.markerOuterRadius * 1.4}
        fill={this.props.markerBaseColor}
        chartType={this.props.chartType}
      />
    }

    return (
      <g>
        {markerBase}
        <path
          fill={this.state.markerFill}
          d={this._calculateStarPoints(this.props.cx, this.props.cy, this.props.arms, this.state.markerOuterRadius, this.state.markerInnerRadius)}
          className={"rd3-" + this.props.chartType + "-star"}
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

  /**
   * Calculate the path of a star. Copied from react-d3
   * https://dillieodigital.wordpress.com/2013/01/16/quick-tip-how-to-draw-a-star-with-svg-and-javascript/
   * @param centerX Horizontal coordinate of center
   * @param centerY Vertical coordinate of center
   * @param arms Numbers of arms of the star
   * @param markerOuterRadius Distance of the outer corners of the arms to the center
   * @param markerInnerRadius Distance of the inner corners of the arms to the center
   * @returns {string} string for the `d` attribute of a SVG `<path>` object
   * @private
   */
  _calculateStarPoints(centerX, centerY, arms, markerOuterRadius, markerInnerRadius) {
    var results = "";
    var angle = Math.PI / arms;

    for (var i = 0; i < 2 * arms; i++) {
      // Use outer or inner radius depending on what iteration we are in.
      var r = (i & 1) == 0 ? markerOuterRadius : markerInnerRadius;

      var currX = centerX + Math.cos(i * angle) * r;
      var currY = centerY + Math.sin(i * angle) * r;

      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0) {
        results = "M" + currX + " " + currY;
      }
      else {
        results += " L" + currX + " " + currY;
      }
    }
    results += " Z";
    return results;
  },

  _animateMarker() {
    this.setState({
      markerOuterRadius: this.props.markerOuterRadius * this.props.markerAnimationResize,
      markerInnerRadius: this.props.markerInnerRadius * this.props.markerAnimationResize,
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
