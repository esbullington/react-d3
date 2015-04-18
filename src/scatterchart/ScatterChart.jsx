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
var CartesianChartPropsMixin = require('../mixins').CartesianChartPropsMixin;

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  displayName: 'ScatterChart',

  propTypes: {
    margins: React.PropTypes.object,
    pointRadius: React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool
 },

  getDefaultProps() {
    return {
      pointRadius: 3,
      margins: {top: 10, right: 20, bottom: 50, left: 45},
      hoverAnimation: true
    };
  },

  _calculateScales: utils.calculateScales,

  render() {

    var structure = immstruct('scatterChart', { voronoi: {}});

    var props = this.props;

    if (this.props.data && this.props.data.length < 1) {
      return <g></g>;
    }

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

    // // Set margins if label is set
    // if (props.xAxisLabel) {
    //   var orient = props.xOrient;
    //   props.margins[orient] = props.margins[orient] + 10;
    // }
    //
    // // Set margins if label is set
    // if (props.yAxisLabel) {
    //   var orient = props.yOrient;
    //   props.margins[orient] = props.margins[orient] + 10;
    // }


    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = this._calculateScales(innerWidth, innerHeight, xValues, yValues);

    var trans = "translate(" + (props.yAxisOffset < 0 ? props.margins.left + Math.abs(props.yAxisOffset) : props.margins.left) + "," + props.margins.top + ")";

    var dataSeriesArray = props.data.map( (series, idx) => {
      return (
          <DataSeries
            structure={structure}
            xScale={scales.xScale}
            yScale={scales.yScale}
            name={series.name}
            data={series.values}
            width={innerWidth}
            height={innerHeight}
            fill={props.colors(idx)}
            pointRadius={props.pointRadius}
            key={series.name + idx}
            hoverAnimation={props.hoverAnimation}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
          />
      );
    });

    return (
      <Chart
        viewBox={props.viewBox}
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        width={props.width}
        height={props.height}
        title={props.title}>
        <g transform={trans} className='rd3-scatterchart'>
          <Voronoi
            structure={structure}
            data={allValues}
            yScale={scales.yScale}
            xScale={scales.xScale}
            width={innerWidth}
            height={innerHeight}
          />
          {dataSeriesArray}
          <XAxis
            xAxisClassName="rd3-scatterchart-xaxis"
            strokeWidth="1"
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisOffset={props.xAxisOffset}
            xScale={scales.xScale}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            tickFormatting={props.xAxisFormatter}
            xOrient={props.xOrient}
            data={props.data}
            margins={props.margins}
            width={innerWidth}
            height={innerHeight}
            stroke={props.axesColor}
          />
          <YAxis
            yAxisClassName="rd3-scatterchart-yaxis"
            yScale={scales.yScale}
            yAxisTickCount={props.yAxisTickCount}
            yAxisOffset={props.yAxisOffset}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            tickFormatting={props.yAxisFormatter}
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
