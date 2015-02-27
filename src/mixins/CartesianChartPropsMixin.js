'use strict';

var React = require('react');

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
    xAxisTickInterval: React.PropTypes.object,
    margins: React.PropTypes.object,
    legend: React.PropTypes.bool,
    legendOffset: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    title: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      xOrient: 'bottom',
      yOrient: 'left',
      margins: {top: 10, right: 20, bottom: 40, left: 30},
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
  },

}
