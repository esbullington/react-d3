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

var Axes = React.createClass({

  propTypes: {
    xAxisClassName: React.PropTypes.string.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    xScale: React.PropTypes.func.isRequired,
    xHideOrigin: React.PropTypes.bool,
    yAxisClassName: React.PropTypes.string.isRequired,
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    yHideOrigin: React.PropTypes.bool,
    chartHeight: React.PropTypes.number.isRequired,
    chartWidth: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      axesColor: '#000'
    };
  },

  render: function() {

    var props = this.props;

    return (
        <g>
          <YAxis
            yAxisClassName={props.yAxisClassName}
            yScale={props.yScale}
            yAxisTickCount={props.yAxisTickCount}
            yHideOrigin={props.yHideOrigin}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
          />
          <XAxis
            xAxisClassName={props.xAxisClassName}
            xScale={props.xScale}
            xAxisTickCount={props.xAxisTickCount}
            strokeWidth={props.strokeWidth}
            xHideOrigin={props.xHideOrigin}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
          />
        </g>
    );
  }

});


module.exports = React.createClass({

  propTypes: {
    margins: React.PropTypes.object,
    legendOffset: React.PropTypes.number,
    pointRadius: React.PropTypes.number,
    yHideOrigin: React.PropTypes.bool,
    xHideOrigin: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    axesColor: React.PropTypes.string,
    title: React.PropTypes.string,
    colors: React.PropTypes.func,
    legend: React.PropTypes.bool,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      margins: {top: 10, right: 20, bottom: 40, left: 30},
      legendOffset: 120,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
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
        <g transform={trans} className='rd3-linechart'>
          {dataSeriesArray}
          <Voronoi
            structure={structure}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={chartWidth}
            height={chartHeight}
          />
          <Axes
            yAxisClassName='rd3-linechart-yaxis'
            yAxisTickCount={props.yAxisTickCount}
            yScale={scales.yScale}
            yHideOrigin={props.yHideOrigin}

            xAxisClassName='rd3-linechart-xaxis'
            xAxisTickCount={props.xAxisTickCount}
            xScale={scales.xScale}
            xHideOrigin={props.xHideOrigin}

            strokeWidth="1"
            margins={props.margins}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            stroke={props.axesColor}
          />
        </g>
      </Chart>
    );
  }

});
