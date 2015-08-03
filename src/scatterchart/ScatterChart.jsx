'use strict';

var React = require('react');
var d3 = require('d3');
var { Chart, XAxis, YAxis } = require('../common');
var DataSeries = require('./DataSeries');
var utils = require('../utils');
var { CartesianChartPropsMixin, ViewBoxMixin } = require('../mixins');

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin, ViewBoxMixin ],

  displayName: 'ScatterChart',

  propTypes: {
    circleRadius:     React.PropTypes.number,
    className:        React.PropTypes.string,
    hoverAnimation:   React.PropTypes.bool,
    margins:          React.PropTypes.object,
    xAxisClassName:   React.PropTypes.string,
    xAxisStrokeWidth: React.PropTypes.number,
    yAxisClassName:   React.PropTypes.string,
    yAxisStrokeWidth: React.PropTypes.number
 },

  getDefaultProps() {
    return {
      circleRadius:     3,
      className:        'rd3-scatterchart',
      hoverAnimation:   true,
			labelsAccessor: d => d.name,
      margins:          {top: 10, right: 20, bottom: 50, left: 45},
			valuesAccessor: d => d.values,
      xAxisClassName:   'rd3-scatterchart-xaxis',
      xAxisStrokeWidth: 1,
      yAxisClassName:   'rd3-scatterchart-yaxis',
      yAxisStrokeWidth: 1
    };
  },

  _calculateScales: utils.calculateScales,

  render() {

    var props = this.props;
    var data  = props.data;
    var margins = props.margins;

		var labelsAccessor = props.labelsAccessor;
		var valuesAccessor = props.valuesAccessor;



    if (!data || data.length < 1) {
      return null;
    }

    // Calculate inner chart dimensions
    var innerWidth  = this.getOuterDimensions().width - margins.left - margins.right;
    var innerHeight = this.getOuterDimensions().height - margins.top - margins.bottom;

    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(
			data, 
			labelsAccessor,
			valuesAccessor,
			props.xAccessor, 
			props.yAccessor
		);

    var allValues = flattenedData.allValues,
        xValues   = flattenedData.xValues,
        yValues   = flattenedData.yValues;

    var scales  = this._calculateScales(innerWidth, innerHeight, xValues, yValues);
    var xScale  = scales.xScale;
    var yScale  = scales.yScale;

    var x = props.yAxisOffset < 0 ? (margins.left + Math.abs(props.yAxisOffset)) : margins.left;
    var transform = `translate(${x}, ${margins.top})`;

    return (
      <Chart
        colors={props.colors}
        colorAccessor={props.colorAccessor}
        data={data}
        height={props.height}
        legend={props.legend}
        margins={margins}
        title={props.title}
        viewBox={this.getViewBox()}
        width={props.width}
      >
        <g
          className={props.className}
          transform={transform}
        >
          <DataSeries
            circleRadius={props.circleRadius}
            colors={props.colors}
            colorAccessor={props.colorAccessor}
            data={allValues}
            height={innerHeight}
            hoverAnimation={props.hoverAnimation}
            width={innerWidth}
            xAccessor={props.xAccessor}
            xScale={xScale}
            yAccessor={props.yAccessor}
            yScale={yScale}
          />
          <XAxis
            data={data}
            height={innerHeight}
            margins={margins}
            stroke={props.axesColor}
            strokeWidth={props.xAxisStrokeWidth.toString()}
            tickFormatting={props.xAxisFormatter}
            width={innerWidth}
            xAxisClassName={props.xAxisClassName}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            xAxisOffset={props.xAxisOffset}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisTickValues={props.xAxisTickValues}
            xOrient={props.xOrient}
            xScale={xScale}
          />
          <YAxis
            data={data}
            width={innerWidth}
            height={innerHeight}
            margins={margins}
            stroke={props.axesColor}
            strokeWidth={props.yAxisStrokeWidth.toString()}
            tickFormatting={props.yAxisFormatter}
            yAxisClassName={props.yAxisClassName}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            yAxisOffset={props.yAxisOffset}
            yAxisTickValues={props.yAxisTickValues}
            yAxisTickCount={props.yAxisTickCount}
            yScale={yScale}
            yOrient={props.yOrient}
          />
        </g>
      </Chart>
    );
  }

});
