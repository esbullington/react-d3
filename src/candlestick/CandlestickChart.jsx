'use strict';

var React = require('react');
var d3 = require('d3');
var utils = require('../utils');
var DataSeries = require('./DataSeries');
var { Chart, XAxis, YAxis } = require('../common');
var { ViewBoxMixin, CartesianChartPropsMixin } = require('../mixins');

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin, ViewBoxMixin ],

  displayName: 'CandleStickChart',

  propTypes: {
    data:              React.PropTypes.oneOfType([
                         React.PropTypes.array,
                         React.PropTypes.object
                       ]),
    fillUp:            React.PropTypes.func,
    fillUpAccessor:    React.PropTypes.func,
    fillDown:          React.PropTypes.func,
    fillDownAccessor:  React.PropTypes.func,
    hoverAnimation:    React.PropTypes.bool,
    xAxisFormatter:    React.PropTypes.func,
    xAxisTickInterval: React.PropTypes.object,
    xAxisTickValues:   React.PropTypes.array,
    yAxisFormatter:    React.PropTypes.func,
    yAxisTickCount:    React.PropTypes.number,
    yAxisTickValues:   React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      className:        'rd3-candlestick',
      xAxisClassName:   'rd3-candlestick-xaxis',
      yAxisClassName:   'rd3-candlestick-yaxis',
      data:             [],
      fillUp:           (value) => '#ffffff',
      fillUpAccessor:   (d, idx) => idx,
      fillDown:         d3.scale.category20c(),
      fillDownAccessor: (d, idx) => idx,
      hoverAnimation:   true,
      margins:          {top: 10, right: 20, bottom: 30, left: 45},
      xAccessor:        (d) => d.x,
      yAccessor:        (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close }),
    };
  },

  render() {

    var props = this.props;

    var {innerWidth, innerHeight, trans, svgMargins} = this.getDimensions();
    var yOrient = this.getYOrient();
    var domain = props.domain || {};

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;
    var scales = utils.calculateScales(innerWidth, innerHeight, xValues, yValues, domain.x, domain.y);

    var dataSeries = props.data.map( (series, idx) => {
      return (
          <DataSeries
            key={idx}
            seriesName={series.name}
            index={idx}
            xScale={scales.xScale}
            yScale={scales.yScale}
            data={series.values}
            fillUp={props.fillUp(props.fillUpAccessor(series, idx))}
            fillDown={props.fillDown(props.fillDownAccessor(series, idx))}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            hoverAnimation={props.hoverAnimation}
          />
        );
      });

    return (
      <Chart
        viewBox={this.getViewBox()}
        width={props.width}
        height={props.height}
        margins={props.margins}
        title={props.title}
      >
        <g transform={trans} className={props.className}>
          <XAxis
            xAxisClassName={props.xAxisClassName}
            xScale={scales.xScale}
            xAxisTickValues={props.xAxisTickValues}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisOffset={props.xAxisOffset}
            tickFormatting={props.xAxisFormatter}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            xOrient={props.xOrient}
            yOrient={yOrient}
            margins={svgMargins}
            width={innerWidth}
            height={innerHeight}
            horizontalChart={props.horizontal}
            gridVertical={props.gridVertical}
            gridVerticalStroke={props.gridVerticalStroke}
            gridVerticalStrokeWidth={props.gridVerticalStrokeWidth}
            gridVerticalStrokeDash={props.gridVerticalStrokeDash}
          />
          <YAxis
            yAxisClassName={props.yAxisClassName}
            yScale={scales.yScale}
            yAxisTickValues={props.yAxisTickValues}
            yAxisOffset={props.yAxisOffset}
            yAxisTickCount={props.yAxisTickCount}
            tickFormatting={props.yAxisFormatter}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            xOrient={props.xOrient}
            yOrient={yOrient}
            margins={svgMargins}
            width={innerWidth}
            height={props.height}
            horizontalChart={props.horizontal}
            gridHorizontal={props.gridHorizontal}
            gridHorizontalStroke={props.gridHorizontalStroke}
            gridHorizontalStrokeWidth={props.gridHorizontalStrokeWidth}
            gridHorizontalStrokeDash={props.gridHorizontalStrokeDash}
          />
          {dataSeries}
        </g>
      </Chart>
    );
  }

});
