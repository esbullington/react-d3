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
          handleOnTouchStart={handleMouseOver}
          handleOnTouchEnd={this._callClickCallback}
          voronoiPath={this.props.voronoiPath}
          point={this.props.point}
        />
        <rect
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={this._callClickCallback}
          onTouchStart={handleMouseOver}
          onTouchEnd={this._callClickCallback}
          x={this.props.cx - Math.round(this.props.markerWidth/2)}
          y={this.props.cy - Math.round(this.props.markerHeight/2)}
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
      markerWidth: this.props.markerWidth * ( 5 / 4 ),
      markerHeight: this.props.markerHeight * ( 5 / 4 ),
      markerFill: shade(this.props.markerFill, 0.2)
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
