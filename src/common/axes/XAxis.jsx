'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({

  displayName: 'XAxis',
  
  propTypes: {
    xAxisClassName: React.PropTypes.string.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    xScale: React.PropTypes.func.isRequired,
    height: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    xAxisOffset: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      xAxisClassName: 'x axis',
      xAxisLabelOffset: 10,
      xOrient: 'bottom',
      fill: 'none',
      stroke: 'none',
      tickStroke: '#000',
      strokeWidth: 'none',
      xAxisOffset: 0,
      label: ''
    };
  },

  render() {
    var props = this.props;

    var t = `translate(0,${props.xAxisOffset + props.height})`;

    var tickArguments;
    if (typeof props.xAxisTickCount !== 'undefined') {
      tickArguments = [props.xAxisTickCount];
    }
    
    if (typeof props.xAxisTickInterval !== 'undefined') {
      tickArguments = [d3.time[props.xAxisTickInterval.unit], props.xAxisTickInterval.interval];
    }

    return (
      <g
        className={props.xAxisClassName}
        transform={t}
      >
        <Label
          label={props.xAxisLabel}
          offset={props.xAxisLabelOffset}
          orient={props.xOrient}
          margins={props.margins}
          width={props.width}
        />
        <AxisTicks
          tickFormatting={props.tickFormatting}
          tickArguments={tickArguments}
          tickStroke={props.tickStroke}
          tickTextStroke={props.tickTextStroke}
          innerTickSize={props.tickSize}
          scale={props.xScale}
          orient={props.xOrient}
        />
        <AxisLine
          scale={props.xScale}
          stroke={props.stroke}
          orient={props.xOrient}
          outerTickSize={props.tickSize}
          {...props}
        />
      </g>
    );
  }

});
