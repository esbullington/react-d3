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

  displayName: 'LineChart',

  propTypes: {
    margins: React.PropTypes.object,
    pointRadius: React.PropTypes.number,
    colors: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      margins: {top: 10, right: 20, bottom: 40, left: 45},
      className: 'rd3-linechart',
      pointRadius: 3,
      interpolate: false,
      interpolationType: null,
      displayDataPoints: true,
      hoverAnimation: true
    };
  },

  render() {

    var structure = immstruct('lineChart', { voronoi: {}, voronoiSeries: {}});

    var props = this.props;

    var data = props.data;

    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

    // Calculate inner chart dimensions
    var innerWidth, innerHeight;

    innerWidth = props.width - props.margins.left - props.margins.right;
    innerHeight = props.height - props.margins.top - props.margins.bottom;

    if (props.legend) {
      innerWidth = innerWidth - props.legendOffset;
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    var flattenedData = utils.flattenData(data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = utils.calculateScales(innerWidth, innerHeight, xValues, yValues);

    var trans = `translate(${ props.margins.left },${ props.margins.top })`;

    var dataSeriesArray = data.map( (series, idx) => {
      return (
          <DataSeries
            structure={structure}
            xScale={scales.xScale}
            yScale={scales.yScale}
            seriesName={series.name}
            data={series.values}
            width={innerWidth}
            height={innerHeight}
            fill={props.colors(idx)}
            pointRadius={props.pointRadius}
            key={series.name + idx}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            interpolationType={interpolationType}
            displayDataPoints={props.displayDataPoints}
          />
      );
    });

    return (
      <Chart
        viewBox={props.viewBox}
        legend={props.legend}
        data={data}
        margins={props.margins}
        colors={props.colors}
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g transform={trans} className={props.className}>
          {dataSeriesArray}
          {props.hoverAnimation ? <Voronoi
            structure={structure}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={innerWidth}
            height={innerHeight}
          /> : <g/> }
          <XAxis
            xAxisClassName='rd3-linechart-xaxis'
            tickFormatting={props.xAxisFormatter}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            xAxisTickCount={props.xAxisTickCount}
            xOrient={props.xOrient}
            xScale={scales.xScale}
            margins={props.margins}
            width={innerWidth}
            height={innerHeight}
            stroke={props.axesColor}
            strokeWidth={props.strokeWidth}
          />
          <YAxis
            yAxisClassName='rd3-linechart-yaxis'
            tickFormatting={props.yAxisFormatter}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            yAxisTickCount={props.yAxisTickCount}
            yScale={scales.yScale}
            yOrient={props.yOrient}
            margins={props.margins}
            width={innerWidth}
            height={innerHeight}
            stroke={props.axesColor}
          />
        </g>
      </Chart>
    );
  }

});
