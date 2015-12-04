'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var MarkerBaseCircle = require('./MarkerBaseCircle');

module.exports = React.createClass({

  displayName: 'VoronoiX',

  handleOnClick: function(a) {},

  getDefaultProps() {
    return {
      markerWidth: 12,
      markerHeight: 12,
      markerFill: '#1f77b4',
      hoverAnimation: true,
      markerAnimationResize: 3,
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
    var defScaleX = 1.0113821;  // horizontal; default Scale to get proper v of size 32px by 32 px
    var defScaleY = 0.98874598;  // vertical; default Scale to get proper v of size 32px by 32 px
    var translateX, translateY;
    translateX = this.props.cx - Math.round(this.state.markerWidth / 2);
    translateY = this.props.cy - Math.round(this.state.markerHeight / 2);

    var translation = 'translate(' + translateX + ' ' + translateY + ') ';
    var scalefactorX = defScaleX / 32 * this.state.markerWidth;
    var scalefactorY = defScaleY / 32 * this.state.markerHeight;
    var scaling = 'scale(' + scalefactorX + ' ' + scalefactorY + ') ';

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
        cx={this.state.markerWidth / scalefactorX / 2}
        cy={this.state.markerHeight / scalefactorY / 2}
        r={Math.max(this.state.markerWidth / scalefactorX, this.state.markerHeight / scalefactorY) / 2 * 1.5}
        fill={this.props.markerBaseColor}
      />
    }

    return (
      <g>
        <g transform={translation + scaling}>
          {markerBase}
          <path
            fill={this.state.markerFill}
            // x form with size 32px by 32px
            d={'m 31.639871,32.364227 -6.866895,0 -9.184835,-12.429949 -9.2427823,12.429949 -6.345358722351742,0 L ' +
             '12.632769,16.225575 0.11589694,4.9360096e-7 l 6.86689506,0 L 16.109678,12.22713 25.265538,4.9360096e-7 ' +
              'l 6.374333,0 L 18.920179,15.935833 31.639871,32.364227 Z'}
            className={"rd3-" + this.props.chartType + '-x'}
          />
        </g>
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
