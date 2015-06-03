'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({

  displayName: 'YAxis',

  propTypes: {
    fill:            React.PropTypes.string,
    stroke:          React.PropTypes.string,
    strokeWidth:     React.PropTypes.string,
    tickStroke:      React.PropTypes.string,
    width:           React.PropTypes.number.isRequired,
    yAxisClassName:  React.PropTypes.string,
    yAxisLabel:      React.PropTypes.string,
    yAxisOffset:     React.PropTypes.number,
    yAxisTickValues: React.PropTypes.array,
    yOrient:         React.PropTypes.oneOf(['left', 'right']),
    yScale:          React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      fill:           'none',
      stroke:         '#000',
      strokeWidth:    '1',
      tickStroke:     '#000',
      yAxisClassName: 'rd3-y-axis',
      yAxisLabel:     '',
      yAxisOffset:    0,
      yOrient:        'left'
    };
  },

  render() {

    var props = this.props;

    var t;
    if (props.yOrient === 'right') {
       t = `translate(${props.yAxisOffset + props.width}, 0)`;
    } else {
       t = `translate(${props.yAxisOffset}, 0)`;
    }

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
          innerTickSize={props.tickSize}
          orient={props.yOrient}
          tickArguments={tickArguments}
          tickFormatting={props.tickFormatting}
          tickStroke={props.tickStroke}
          tickTextStroke={props.tickTextStroke}
          tickValues={props.yAxisTickValues}
          scale={props.yScale}
        />
        <AxisLine
          orient={props.yOrient}
          outerTickSize={props.tickSize}
          scale={props.yScale}
          stroke={props.stroke}
          {...props}
        />
        <Label
          height={props.height}
          label={props.yAxisLabel}
          margins={props.margins}
          offset={props.yAxisLabelOffset}
          orient={props.yOrient}
        />
      </g>
    );
  }

});
