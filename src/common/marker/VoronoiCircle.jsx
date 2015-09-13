'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var { MarkerMixin } = require('../../mixins');

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  mixins: [ MarkerMixin ],

  getDefaultProps() {
    return { 
      markerAppearance: {
        radius: 3,
      }
    };
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
        <circle
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={this._callClickCallback}
          onTouchStart={this._callClickCallback}
          onTouchEnd={this.handleMouseLeave}
          cx={this.props.cx}
          cy={this.props.cy}
          r={this.state.radius}
          fill={this.state.markerFill}
          className={"rd3-" + this.props.chartType + "-circle"}
        />
      </g>
    );
  },

  _callClickCallback() {
    this.handleMouseOver;
    this.handleOnClick(this.props.point);
  }
});
