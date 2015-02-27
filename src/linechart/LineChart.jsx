'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Voronoi = common.Voronoi;
var utils = require('../utils');
var immstruct = require('immstruct');
var DataSeries = require('./DataSeries');
var mixins = require('../mixins');
var CartesianChartPropsMixin = mixins.CartesianChartPropsMixin;


module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  propTypes: {
    pointRadius: React.PropTypes.number,
    colors: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      className: 'rd3-linechart',
      pointRadius: 3,
      interpolate: false,
      interpolationType: null,
      displayDataPoints: true
    };
  },

  render: function() {

    var structure = immstruct('lineChart', { voronoi: {}, voronoiSeries: {}});

    var props = this.props;

    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

    // Calculate inner chart dimensions
    var chartWidth, chartHeight;

    chartWidth = props.width - props.margins.left - props.margins.right;
    chartHeight = props.height - props.margins.top - props.margins.bottom;

    if (props.legend) {
      chartWidth = chartWidth - props.legendOffset;
    }

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    // Set margins if label is set
    // var xAxisLabel = 'test label';
    var xAxisLabel = 'test';
    if (xAxisLabel) {
      var orient = props.xOrient;
      props.margins[orient] = props.margins[orient] + 10;
    }

    // Set margins if label is set
    // var xAxisLabel = 'test label';
    var yAxisLabel = 'test two';
    if (yAxisLabel) {
      var orient = props.yOrient;
      props.margins[orient] = props.margins[orient] + 10;
    }


    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = utils.calculateScales(chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + props.margins.left + "," + props.margins.top + ")";

    var dataSeriesArray = props.data.map( (series, idx) => {
      return (
          <DataSeries
            structure={structure}
            xScale={scales.xScale}
            yScale={scales.yScale}
            seriesName={series.name}
            data={series.values}
            width={chartWidth}
            height={chartHeight}
            fill={props.colors(idx)}
            pointRadius={props.pointRadius}
            key={series.name}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            interpolationType={interpolationType}
            displayDataPoints={props.displayDataPoints}
          />
      );
    });

    return (
      <Chart
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g transform={trans} className={props.className}>
          {dataSeriesArray}
          <Voronoi
            structure={structure}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={chartWidth}
            height={chartHeight}
          />
          <YAxis
            yAxisClassName="rd3-linechart-yaxis"
            yScale={scales.yScale}
            yAxisTickCount={props.yAxisTickCount}
            yHideOrigin={props.yHideOrigin}
            margins={props.margins}
            width={chartWidth}
            height={chartHeight}
            stroke={props.axesColor}
            yAxisLabel={yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
          />
          <XAxis
            xAxisClassName="rd3-linechart-xaxis"
            xScale={scales.xScale}
            xAxisTickCount={props.xAxisTickCount}
            strokeWidth={props.strokeWidth}
            xHideOrigin={props.xHideOrigin}
            margins={props.margins}
            width={chartWidth}
            height={chartHeight}
            stroke={props.axesColor}
            xAxisLabel={xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
          />
        </g>
      </Chart>
    );
  }

});
