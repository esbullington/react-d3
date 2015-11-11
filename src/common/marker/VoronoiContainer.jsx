'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiCircle = require('./VoronoiCircle');
var VoronoiRect = require('./VoronoiRect');
var VoronoiStar = require('./VoronoiStar');
var VoronoiV = require('./VoronoiV');

module.exports = React.createClass({

  displayName: 'VornoiContainer',

  getDefaultProps() {
    return {
      markerName: 'circle',
    };
  },

  render() {
    switch (this.props.markerName) {
      case 'circle':
        return (
          <g>
            <VoronoiCircle
              voronoiPath={this._drawPath(this.props.vnode)}
              point={this.props.point}
              cx={this.props.cx}
              cy={this.props.cy}
              hoverAnimation={this.props.hoverAnimation}
              markerRadius={this.props.markerRadius}
              markerFill={this.props.markerFill}
              markerAnimationResize={this.props.markerAnimationResize}
              markerAnimationShade={this.props.markerAnimationShade}
              //markerIsHighlighted={true}
              markerOnClick={this.props.markerOnClick}
              chartType={this.props.chartType}
              />
          </g>
        );
        break;
      case 'rect':
        return (
          <g>
            <VoronoiRect
              voronoiPath={this._drawPath(this.props.vnode)}
              point={this.props.point}
              cx={this.props.cx }
              cy={this.props.cy}
              hoverAnimation={this.props.hoverAnimation}
              markerWidth={this.props.markerWidth}
              markerHeight={this.props.markerHeight}
              markerFill={this.props.markerFill}
              markerAnimationResize={this.props.markerAnimationResize}
              markerAnimationShade={this.props.markerAnimationShade}
              markerOnClick={this.props.markerOnClick}
              chartType={this.props.chartType}
              />
          </g>
        );
        break;
      case 'star':
        return (
          <g>
            <VoronoiStar
              voronoiPath={this._drawPath(this.props.vnode)}
              point={this.props.point}
              cx={this.props.cx }
              cy={this.props.cy}
              hoverAnimation={this.props.hoverAnimation}
              markerOuterRadius={this.props.markerOuterRadius}
              markerInnerRadius={this.props.markerInnerRadius}
              markerFill={this.props.markerFill}
              markerAnimationResize={this.props.markerAnimationResize}
              markerAnimationShade={this.props.markerAnimationShade}
              markerOnClick={this.props.markerOnClick}
              chartType={this.props.chartType}
              />
          </g>
        );
        break;
      case 'v':
        return (
          <g>
            <VoronoiV
              voronoiPath={this._drawPath(this.props.vnode)}
              point={this.props.point}
              cx={this.props.cx }
              cy={this.props.cy}
              hoverAnimation={this.props.hoverAnimation}
              markerWidth={this.props.markerWidth}
              markerHeight={this.props.markerHeight}
              markerFill={this.props.markerFill}
              markerUSD={this.props.markerUSD}
              markerAnimationResize={this.props.markerAnimationResize}
              markerAnimationShade={this.props.markerAnimationShade}
              markerOnClick={this.props.markerOnClick}
              chartType={this.props.chartType}
              />
          </g>
        );
        break;
      default:
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
