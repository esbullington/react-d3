'use strict';

var React = require('react');

module.exports =  {

  propTypes: {
    showTooltip:    React.PropTypes.bool,
    tooltipFormat:  React.PropTypes.func
  },

  getDefaultProps() {
    return {
      showTooltip:   true,
      tooltipFormat: (d) => d.yValue
    };
  },

  getInitialState() {
    return {
      tooltip: {
        cx: 0,
        cy: 0,
        text: '',
        show: false
      }
    };
  },

  onMouseOver(cx, cy, dataPoint) {
    if(!this.props.showTooltip)
      return;
    this.setState({
      tooltip: {
        cx: cx,
        cy: cy,
        text: this.props.tooltipFormat.call(this, dataPoint),
        show: true 
      } 
    });
  },

  onMouseLeave() {
    if(!this.props.showTooltip)
      return;
    this.setState({
      tooltip: {
        cx: 0,
        cy: 0,
        text: '',
        show: false
      } 
    });
  }
}