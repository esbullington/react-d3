'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiCircle = require('./VoronoiCircle');
var VoronoiRect = require('./VoronoiRect');
var VoronoiStar = require('./VoronoiStar');

module.exports = React.createClass({

  displayName: 'VornoiContainer',

  getDefaultProps() {
    return {
      markerName: 'circle',
      hoverAnimation: true
    };
  },

  render() {
    // animation controller
    var handleMouseOver, handleMouseLeave;
    if(this.props.hoverAnimation) {
      handleMouseOver = this._animateMarker;
      handleMouseLeave = this._restoreMarker;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    switch (this.props.markerName) {
      case 'circle':
        return (
          <g>
            <VoronoiCircle
              voronoiPath={this._drawPath(this.props.vnode)}
              cx={this.props.cx}
              cy={this.props.cy}
              markerRadius={this.props.markerRadius}
              markerFill={this.props.markerFill}
              />
          </g>
        );
        break;
      case 'rect':
        return (
          <g>
            <VoronoiRect
              voronoiPath={this._drawPath(this.props.vnode)}
              cx={this.props.cx }
              cy={this.props.cy}
              markerWidth={this.props.markerWidth}
              markerHeight={this.props.markerHeight}
              markerFill={this.props.markerFill}
              />
          </g>
        );
        break;
      case 'star':
        return (
          <g>
            <VoronoiStar
              voronoiPath={this._drawPath(this.props.vnode)}
              cx={this.props.cx }
              cy={this.props.cy}
              markerOuterRadius={this.props.markerOuterRadius}
              markerInnerRadius={this.props.markerInnerRadius}
              markerFill={this.props.markerFill}
              />
          </g>
        );
        break;
      default:
        console.log('Marker to display data point is not available.');
        return(<g></g>)
    }
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  },
});
