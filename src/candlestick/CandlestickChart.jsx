'use strict';

var React = require('react');
var d3 = require('d3');
var immstruct = require('immstruct');
var utils = require('../utils');
var DataSeries = require('./DataSeries');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Voronoi = common.Voronoi;


module.exports = React.createClass({

  displayName: 'CandleStickChart',

  propTypes: {
    data:              React.PropTypes.oneOfType([
                         React.PropTypes.array,
                         React.PropTypes.object
                       ]),
    yAxisTickValues:   React.PropTypes.array,
    yAxisTickCount:    React.PropTypes.number,
    yAxisFormatter:    React.PropTypes.func,
    yAccessor:         React.PropTypes.func,
    xAxisTickValues:   React.PropTypes.array,
    xAxisTickInterval: React.PropTypes.object,
    xAxisFormatter:    React.PropTypes.func,
    xAccessor:         React.PropTypes.func,
    fillUp:            React.PropTypes.func,
    fillUpAccessor:    React.PropTypes.func,
    fillDown:          React.PropTypes.func,
    fillDownAccessor:  React.PropTypes.func,
    width:             React.PropTypes.number,
    height:            React.PropTypes.number,
    title:             React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      data:             [],
      fillUp:           (value) => 'white',
      fillUpAccessor:   (d, idx) => idx,
      fillDown:         d3.scale.category20c(),
      fillDownAccessor: (d, idx) => idx,
      margins:          {top: 10, right: 20, bottom: 30, left: 45},
      legendOffset:     120,
      width:            400,
      height:           200,
      title:            '',
      xAccessor:        (d) => d.x,
      yAccessor:        (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close })
    };
  },

  render() {

    var props = this.props;

    var structure = immstruct('candlestickChart', { voronoi: {} });

    // Calculate inner chart dimensions
    var innerWidth, innerHeight;
    innerWidth = props.width - props.margins.left - props.margins.right;
    innerHeight = props.height - props.margins.top - props.margins.bottom;

    if (props.legend) {
      innerWidth = innerWidth - props.legendOffset;
    }

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = utils.calculateScales(innerWidth, innerHeight, xValues, yValues);

    var trans = `translate(${ props.yAxisOffset < 0 ? props.margins.left + Math.abs(props.yAxisOffset) : props.margins.left},${ props.margins.top })`;

    var dataSeries = props.data.map( (series, idx) => {
      return (
          <DataSeries
            key={idx}
            structure={structure}
            seriesName={series.name}
            index={idx}
            xScale={scales.xScale}
            yScale={scales.yScale}
            data={series.values}
            fillUp={props.fillUp(props.fillUpAccessor(series, idx))}
            fillDown={props.fillDown(props.fillDownAccessor(series, idx))}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
          />
        );
      });

    return (
      <Chart
        viewBox={props.viewBox}
        width={props.width}
        height={props.height}
        margins={props.margins}
        title={props.title}
      >
        <g transform={trans} className='rd3-candlestick'>
          {dataSeries}
          <Voronoi
            structure={structure}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={innerWidth}
            height={innerHeight}
          />
          <XAxis
            xAxisClassName='rd3-candlestick-xaxis'
            xScale={scales.xScale}
            xAxisTickValues={props.xAxisTickValues}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisOffset={props.xAxisOffset}
            tickFormatting={props.xAxisFormatter}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            xOrient={props.xOrient}
            margins={props.margins}
            width={innerWidth}
            height={innerHeight}
          />
          <YAxis
            yAxisClassName='rd3-candlestick-yaxis'
            yScale={scales.yScale}
            yAxisTickValues={props.yAxisTickValues}
            yAxisOffset={props.yAxisOffset}
            yAxisTickCount={props.yAxisTickCount}
            tickFormatting={props.yAxisFormatter}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            yOrient={props.yOrient}
            margins={props.margins}
            width={innerWidth}
            height={props.height}
          />
        </g>
      </Chart>
    );
  }

});
