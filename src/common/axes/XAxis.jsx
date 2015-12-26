'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({

  displayName: 'XAxis',

  propTypes: {
    fill:            React.PropTypes.string,
    height:          React.PropTypes.number.isRequired,
    width:           React.PropTypes.number.isRequired,
    horizontalChart: React.PropTypes.bool,
    stroke:          React.PropTypes.string,
    strokeWidth:     React.PropTypes.string,
    tickStroke:      React.PropTypes.string,
    xAxisClassName:  React.PropTypes.string,
    xAxisLabel:      React.PropTypes.string,
    xAxisTickValues: React.PropTypes.array,
    xAxisOffset:     React.PropTypes.number,
    xScale:          React.PropTypes.func.isRequired,
    xOrient:         React.PropTypes.oneOf(['top', 'bottom']),
    yOrient:         React.PropTypes.oneOf(['left', 'right']),
    gridVertical:  React.PropTypes.bool,
    gridVerticalStroke: React.PropTypes.string,
    gridVerticalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeDash: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      fill:            'none',
      stroke:          'none',
      strokeWidth:     '1',
      tickStroke:      '#000',
      xAxisClassName:  'rd3-x-axis',
      xAxisLabel:      '',
      xAxisLabelOffset: 10,
      xAxisOffset:      0,
      xOrient:         'bottom',
      yOrient:         'left'
    };
  },

  render() {
    var props = this.props;

    var t = `translate(0 ,${props.xAxisOffset + props.height})`;

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
        <AxisTicks
          tickValues={props.xAxisTickValues}
          tickFormatting={props.tickFormatting}
          tickArguments={tickArguments}
          tickStroke={props.tickStroke}
          tickTextStroke={props.tickTextStroke}
          innerTickSize={props.tickSize}
          scale={props.xScale}
          orient={props.xOrient}
          orient2nd={props.yOrient}
          height={props.height}
          width={props.width}
          horizontalChart={props.horizontalChart}
          gridVertical={props.gridVertical}
          gridVerticalStroke={props.gridVerticalStroke}
          gridVerticalStrokeWidth={props.gridVerticalStrokeWidth}
          gridVerticalStrokeDash={props.gridVerticalStrokeDash}
        />
        <AxisLine
          scale={props.xScale}
          stroke={props.stroke}
          orient={props.xOrient}
          outerTickSize={props.tickSize}
          {...props}
        />
        <Label
          horizontalChart={props.horizontalChart}
          label={props.xAxisLabel}
          offset={props.xAxisLabelOffset}
          orient={props.xOrient}
          margins={props.margins}
          width={props.width}
          />
      </g>
    );
  }

});
