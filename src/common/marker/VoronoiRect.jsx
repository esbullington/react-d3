'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var MarkerBaseCircle = require('./MarkerBaseCircle');

module.exports = React.createClass({

  displayName: 'VoronoiRect',

  handleOnClick: function(a) {},

  getDefaultProps() {
    return { 
      markerWidth: 6,
      markerHeight: 6,
      markerFill: '#1f77b4',
      hoverAnimation: true,
      markerAnimationResize: 1.25,
      markerAnimationShade: 0.2,
      chartType: 'chart'
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
        r={Math.max(this.state.markerWidth, this.state.markerHeight) / 2 * 1.7}
        fill={this.props.markerBaseColor}
      />
    }

    return (
      <g>
        {markerBase}
        <rect
          x={this.props.cx - Math.round(this.state.markerWidth/2)}
          y={this.props.cy - Math.round(this.state.markerHeight/2)}
          width={this.state.markerWidth}
          height={this.state.markerHeight}
          fill={this.state.markerFill}
          className={"rd3-" + this.props.chartType + "-rect"}
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
      markerWidth: this.props.markerWidth * this.props.markerAnimationResize,
      markerHeight: this.props.markerHeight * this.props.markerAnimationResize,
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
