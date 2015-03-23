'use strict';

var React = require('react');
var d3 = require('d3');

module.exports =  {

  propTypes: {
    axesColor: React.PropTypes.string,
    colors: React.PropTypes.func,
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]).isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yAxisTickCount: React.PropTypes.number,
    yAxisLabel: React.PropTypes.string,
    yAxisLabelOffset: React.PropTypes.number,
    yAxisFormatter: React.PropTypes.func,
    xAxisTickInterval: React.PropTypes.object,
    xAxisLabel: React.PropTypes.string,
    xAxisLabelOffset: React.PropTypes.number,
    xAxisFormatter: React.PropTypes.func,
    legend: React.PropTypes.bool,
    legendOffset: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    title: React.PropTypes.string,
    viewBox: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      xOrient: 'bottom',
      xAxisLabel: '',
      xAxisLabelOffset: 38,
      yOrient: 'left',
      yAxisLabel: '',
      yAxisLabelOffset: 35,
      legend: false,
      legendOffset: 120,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y
    };
  }

};
