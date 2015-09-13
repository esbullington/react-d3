'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var { MarkerMixin } = require('../../mixins');

module.exports = React.createClass({

  displayName: 'VoronoiRect',

  mixins: [ MarkerMixin ],

  getDefaultProps() {
    return { 
      markerAppearance: {
        width: 6,
        height: 6,
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
        <rect
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={this._callClickCallback}
          onTouchStart={this._callClickCallback}
          onTouchEnd={this.handleMouseLeave}
          x={this.props.cx - Math.round(this.props.markerAppearance.width/2)}
          y={this.props.cy - Math.round(this.props.markerAppearance.height/2)}
          width={this.state.width}
          height={this.state.height}
          fill={this.state.markerFill}
          className={"rd3-" + this.props.chartType + "-rect"}
        />
      </g>
    );
  },

  _callClickCallback() {
    this.handleMouseOver;
    this.handleOnClick(this.props.point);
  }
});
