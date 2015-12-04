'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../../utils/index').shade;
var VoronoiArea = require('./VoronoiArea');
var MarkerBaseCircle = require('./MarkerBaseCircle');

module.exports = React.createClass({

  displayName: 'VoronoiV',

  handleOnClick: function(a) {},

  getDefaultProps() {
    return {
      markerWidth: 6,
      markerHeight: 6,
      markerFill: '#1f77b4',
      markerUSD: false,             /// marker is upside down
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
    var defScaleX = 1.0123096;  // horizontal; default Scale to get proper v of size 32px by 32 px
    var defScaleY = 0.9878401;  // vertical; default Scale to get proper v of size 32px by 32 px
    var angle, translateX, translateY, markerName;
    if (this.props.markerUSD) {
      angle = 180;
      translateX = this.props.cx + Math.round(this.state.markerWidth / 2);
      translateY = this.props.cy + this.state.markerHeight;
      markerName = 'vUSD';
    } else {
      angle = 0;
      translateX = this.props.cx - Math.round(this.state.markerWidth / 2);
      translateY = this.props.cy - Math.round(this.state.markerHeight);
      markerName = 'v';
    }

    var translation = 'translate(' + translateX + ' ' + translateY + ') ';
    var scalefactorX = defScaleX / 32 * this.state.markerWidth;
    var scalefactorY = defScaleY / 32 * this.state.markerHeight;
    var scaling = 'scale(' + scalefactorX + ' ' + scalefactorY + ') ';
    var rotation = 'rotate(' + angle + ') ';

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
        <g transform={translation + scaling + rotation}>
          {markerBase}
          <path
            fill={this.state.markerFill}
            // v form with size 32px by 32px
            d={'M 31.610884,-5.5879354e-7 18.502518,32.393906 l -5.481154,0 L -3.7252903e-8,-5.5879354e-7 ' +
             '5.9161655,-5.5879354e-7 15.950446,25.781721 25.897724,-5.5879354e-7 l 5.71316,0 z'}
            className={"rd3-" + this.props.chartType + markerName}
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
