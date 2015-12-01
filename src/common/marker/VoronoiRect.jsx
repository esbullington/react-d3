'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');

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

    return (
      <g>
        <VoronoiArea
          handleMouseOver={handleMouseOver}
          handleMouseLeave={handleMouseLeave}
          handleOnClick={this._callClickCallback}
          handleOnTouchStart={this._callClickCallback}
          handleOnTouchEnd={this.handleMouseLeave}
          voronoiPath={this.props.voronoiPath}
          point={this.props.point}
        />
        <rect
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={this._callClickCallback}
          onTouchStart={this._callClickCallback}
          onTouchEnd={this.handleMouseLeave}
          x={this.props.cx - Math.round(this.state.markerWidth/2)}
          y={this.props.cy - Math.round(this.state.markerHeight/2)}
          width={this.state.markerWidth}
          height={this.state.markerHeight}
          fill={this.state.markerFill}
          className={"rd3-" + this.props.chartType + "-rect"}
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
