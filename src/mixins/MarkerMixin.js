'use strict';
// a mixin use to animate marker component

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;

module.exports =  {

  propTypes: {
    markerFill: React.PropTypes.string,
    hoverAnimation: React.PropTypes.bool,
    markerAnimationResize: React.PropTypes.number,
    markerAnimationShade: React.PropTypes.number,
    chartType: React.PropTypes.string,
    /** An object use to describe marker appearance. ie: width, innerRadius
     * This mixin will map props.markerAppearance into state to achieve animation
     * In rect marker component, we have markerAppearance {width: 3, height: 3}
     * This mixin map it into state so that this.state.width = 3 this.state.height = 3
     **/

     /** Reason of doing this: creating resuable method by mixin
      * Appearance of marker change, ie: circle use radius, star use innerRadius, outerRadius 
      * Instead of hard coding all properties, we map across this object
      * and apply animation (multiply another prop).
      */
    markerAppearance: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      markerFill: '#1f77b4',
      hoverAnimation: true,
      markerAnimationResize: 1.25,
      markerAnimationShade: 0.2,
      chartType: 'chart',
    };
  },

  getInitialState() {
    return Object.assign(
      {},
      this.props.markerAppearance,
      { markerFill: this.props.markerFill }
    )
  },

  _animateMarker() {
    var nextState = Object.assign(
      {},
      multiplyProp(this.props.markerAppearance, this.props.markerAnimationResize),
      { markerFill: shade(this.props.markerFill, this.props.markerAnimationShade) }
    );

    this.setState(nextState);
  },

  _restoreMarker() {
    this.setState(
      this.getInitialState()
    );
  },

  handleOnClick: () => {}
};

function multiplyProp(props, factor) {
  let result = {};
  for(let prop in props) {
    if(props.hasOwnProperty(prop)) {
      result[prop] = props[prop] * factor;      
    }
  }
  return result;
}
