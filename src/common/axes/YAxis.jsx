'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');

module.exports = React.createClass({

  propTypes: {
    yAxisClassName: React.PropTypes.string,
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    yAxisOffset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      yAxisClassName: 'y axis',
      yOrient: 'left',
      fill: "none",
      stroke: "#000",
      tickStroke: "#000",
      strokeWidth: "1",
      yAxisOffset: 0
    };
  },

  render: function() {

    var props = this.props;

    var t = `translate(${props.yAxisOffset},0)`;

    var tickArguments;
    if (props.yAxisTickCount) {
      tickArguments = [props.yAxisTickCount];
    }
    
    if (props.yAxisTickInterval) {
      tickArguments = [d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval];
    }

    return (
      <g
        className={props.yAxisClassName}
        transform={t}
      >
        <AxisTicks
          tickFormatting={props.tickFormatting}
          tickArguments={tickArguments}
          yScale={props.yScale}
        />
        <AxisLine
          scale={props.yScale}
          orient={props.yOrient}
          {...props}
        />
      </g>
    );
  }

});
