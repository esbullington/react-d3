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
      tooltipFormat: (d) => String(d.yValue)
    };
  },

  getInitialState() {
    return {
      tooltip: {
        x: 0,
        y: 0,
        child: '',
        show: false
      }
    };
  },

  onMouseOver(x, y, dataPoint) {
    if(!this.props.showTooltip)
      return;
    this.setState({
      tooltip: {
        x: x,
        y: y,
        child: this.props.tooltipFormat.call(this, dataPoint),
        show: true 
      } 
    });
  },

  onMouseLeave() {
    if(!this.props.showTooltip)
      return;
    this.setState({
      tooltip: {
        x: 0,
        y: 0,
        child: '',
        show: false
      } 
    });
  }
}