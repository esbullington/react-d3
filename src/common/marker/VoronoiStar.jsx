

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var { MarkerMixin } = require('../../mixins');

module.exports = React.createClass({

  displayName: 'VoronoiStar',

  mixins: [ MarkerMixin ],

  getDefaultProps() {
    return { 
      markerAppearance: {
        outerRadius: 6,
        innerRadius: 3,
      },
      arms: 5,
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
        <path
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={this._callClickCallback}
          onTouchStart={this._callClickCallback}
          onTouchEnd={this.handleMouseLeave}
          fill={this.state.markerFill}
          d={this._calculateStarPoints(this.props.cx, this.props.cy, this.props.arms, this.state.outerRadius, this.state.innerRadius)}
          className={"rd3-" + this.props.chartType + "-star"}
        />
      </g>
    );
  },

  // Calculate path of star
  // from https://dillieodigital.wordpress.com/2013/01/16/quick-tip-how-to-draw-a-star-with-svg-and-javascript/
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

  _callClickCallback() {
    this.handleMouseOver;
    this.handleOnClick(this.props.point);
  }
});
