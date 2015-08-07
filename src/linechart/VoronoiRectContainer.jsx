'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiRect');

module.exports = React.createClass({

  displayName: 'VornoiRectContainer',

  getDefaultProps() {
    return { 
      rectWidth: 3,
      rectHeight: 3,
      rectFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState() {
    return {
      rectWidth: this.props.rectWidth,
      rectHeight: this.props.rectHeight,
      rectFill: this.props.rectFill,
    };
  },

  render() {

    var props = this.props;

    // animation controller
    var handleMouseOver, handleMouseLeave;
    if(props.hoverAnimation) {
      handleMouseOver = this._animateRect;
      handleMouseLeave = this._restoreRect;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    return (
      <g>
        <VoronoiRect
            handleMouseOver={handleMouseOver}
            handleMouseLeave={handleMouseLeave}
            voronoiPath={this._drawPath(props.vnode)}
            x={props.x}
            y={props.y}
            rectWidth={this.state.rectWidth}
            rectHeight={this.state.rectHeight}
        />
      </g>
    );
  },

  _animateRect() {
    this.setState({ 
      rectWidth: this.props.rectWidth * ( 5 / 4 ),
      rectHeight: this.props.rectHeight * ( 5 / 4 ),
      rectFill: shade(this.props.rectFill, 0.2)
    });
  },

  _restoreRect() {
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
