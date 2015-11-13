'use strict';

var React = require('react');
var d3 = require('d3');

module.exports =  {

  propTypes: {
    axesColor:         React.PropTypes.string,
    colors:            React.PropTypes.func,
    colorAccessor:     React.PropTypes.func,
    data:              React.PropTypes.array.isRequired,
    height:            React.PropTypes.number,
    horizontal:        React.PropTypes.bool,
    legend:            React.PropTypes.bool,
    legendOffset:      React.PropTypes.number,
    title:             React.PropTypes.string,
    width:             React.PropTypes.number,
    xAccessor:         React.PropTypes.func,
    xAxisFormatter:    React.PropTypes.func,
    xAxisLabel:        React.PropTypes.string,
    xAxisLabelOffset:  React.PropTypes.number,
    xAxisTickCount:    React.PropTypes.number,
    xAxisTickInterval: React.PropTypes.object,
    xAxisTickValues:   React.PropTypes.array,
    xAxisOffset:       React.PropTypes.number,
    xOrient:           React.PropTypes.oneOf(['top', 'bottom']),
    yAccessor:         React.PropTypes.func,
    yAxisFormatter:    React.PropTypes.func,
    yAxisLabel:        React.PropTypes.string,
    yAxisLabelOffset:  React.PropTypes.number,
    yAxisTickCount:    React.PropTypes.number,
    yAxisTickInterval: React.PropTypes.object,
    yAxisTickValues:   React.PropTypes.array,
    yAxisOffset:       React.PropTypes.number,
    yOrient:           React.PropTypes.oneOf(['default', 'left', 'right'])
  },

  getDefaultProps: function() {
    return {
      axesColor:        '#000',
      colors:           d3.scale.category20c(),
      colorAccessor:    (d, idx) => idx,
      height:           200,
      horizontal:       false,
      legend:           false,
      legendOffset:     120,
      title:            '',
      width:            400,
      // xAxisFormatter: no predefined value right now
      xAxisLabel:       '',
      xAxisLabelOffset: 38,
      xAxisOffset:      0,
      // xAxisTickCount: no predefined value right now
      // xAxisTickInterval: no predefined value right now
      // xAxisTickValues: no predefined value right now
      xOrient:          'bottom',
      // yAxisFormatter: no predefined value right now
      yAxisLabel:       '',
      yAxisLabelOffset: 35,
      yAxisOffset:      0,
      // yAxisTickCount: no predefined value right now
      // yAxisTickInterval: no predefined value right now
      // yAxisTickValues: no predefined value right now
      yOrient:          'default'
    };
  },

  getYOrient() {
    var yOrient = this.props.yOrient;

    if (yOrient === 'default') {
      return this.props.horizontal ? 'right' : 'left'; 
    }

    return yOrient;
  }
};
