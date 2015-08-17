'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiCircle');
var VoronoiRect = require('./VoronoiRect');

module.exports = React.createClass({

  displayName: 'VornoiContainer',

  getDefaultProps() {
    return {
      marker: 'circle',
      markerRadius: 3,
      markerWidth: 6,
      markerHeight: 6,
      markerFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState() {
    if (this.props.marker == 'circle') {
      return {
        markerRadius: this.props.markerRadius,
        markerFill: this.props.markerFill,
      }
    }
    else {
      return {
        markerWidth: this.props.markerWidth,
        markerHeight: this.props.markerHeight,
        markerFill: this.props.markerFill,
      }
    }
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

    switch (this.props.marker) {
      case 'circle':
        return (
            <g>
              <VoronoiCircle
                  handleMouseOver={handleMouseOver}
                  handleMouseLeave={handleMouseLeave}
                  voronoiPath={this._drawPath(this.props.vnode)}
                  cx={this.props.cx}
                  cy={this.props.cy}
                  markerRadius={this.state.markerRadius}
                  markerFill={this.state.markerFill}
                  />
            </g>
        );
        break;
      case 'rect':
        return (
          <g>
            <VoronoiRect
                handleMouseOver={handleMouseOver}
                handleMouseLeave={handleMouseLeave}
                voronoiPath={this._drawPath(this.props.vnode)}
                cx={this.props.cx }
                cy={this.props.cy}
                markerWidth={this.state.markerWidth}
                markerHeight={this.state.markerHeight}
                markerFill={this.state.markerFill}
                />
          </g>
        );
        break;
      default:
        console.log('Marker to display data point is not available.');
    }
  },

  _animateMarker() {
    if (this.props.marker == 'circle') {
      this.setState({
        markerRadius: this.props.markerRadius * ( 5 / 4 ),
        markerFill: shade(this.props.markerFill, 0.2)
      });
    }
    else {
      this.setState({
        markerWidth: this.props.markerWidth * ( 5 / 4 ),
        markerHeight: this.props.markerHeight * ( 5 / 4 ),
        markerFill: shade(this.props.markerFill, 0.2)
      });
    }
  },

  _restoreMarker() {
    this.setState(
      this.getInitialState()
    );
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  },
});
