'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiCircle');

module.exports = React.createClass({

  displayName: 'VoronoiContainer',

  getDefaultProps() {
    return {
      circleRadius: 3,
      circleFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState() {
    return { 
      circleRadius: this.props.circleRadius,
      circleFill: this.props.circleFill
    };
  },

  render() {

    var props = this.props;

    // animation controller
    var handleMouseOver, handleMouseLeave;
    if(props.hoverAnimation) {
      handleMouseOver = this._animateCircle;
      handleMouseLeave = this._restoreCircle;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    return (
      <g>
        <VoronoiCircle
            handleMouseOver={handleMouseOver}
            handleMouseLeave={handleMouseLeave}
            voronoiPath={this._drawPath(props.vnode)}
            cx={props.cx}
            cy={props.cy}
            circleRadius={this.state.circleRadius}
            circleFill={this.state.circleFill}
        />
      </g>
    );
  },

  _animateCircle() {
    this.setState({ 
      circleRadius: this.props.circleRadius * ( 5 / 4 ),
      circleFill: shade(this.props.circleFill, 0.2)
    });
  },

  _restoreCircle() {
    this.setState({ 
      circleRadius: this.props.circleRadius,
      circleFill: this.props.circleFill
    });
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  },
});
