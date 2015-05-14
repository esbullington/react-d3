'use strict';

var React = require('react');
var d3 = require('d3');
var { Chart, XAxis, YAxis } = require('../common');
var DataSeries = require('./DataSeries')
var utils = require('../utils');
var { CartesianChartPropsMixin, ViewBoxMixin } = require('../mixins');

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin, ViewBoxMixin ],

  displayName: 'ScatterChart',

  propTypes: {
    margins:        React.PropTypes.object,
    circleRadius:   React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool
 },

  getDefaultProps() {
    return {
      circleRadius:    3,
      margins:        {top: 10, right: 20, bottom: 50, left: 45},
      hoverAnimation: true
    };
  },

  _calculateScales: utils.calculateScales,

  render() {

    var props = this.props;

    if (this.props.data && this.props.data.length < 1) {
      return <g></g>;
    }

    // Calculate inner chart dimensions
    var innerWidth, innerHeight;

    innerWidth = this.getOuterDimensions().width - props.margins.left - props.margins.right;
    innerHeight = this.getOuterDimensions().height - props.margins.top - props.margins.bottom;

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;
    var scales = this._calculateScales(innerWidth, innerHeight, xValues, yValues);
    var trans = "translate(" + (props.yAxisOffset < 0 ? props.margins.left + Math.abs(props.yAxisOffset) : props.margins.left) + "," + props.margins.top + ")";

    return (
      <Chart
        viewBox={this.getViewBox()}
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        colorAccessor={props.colorAccessor}
        width={props.width}
        height={props.height}
        title={props.title}>
        <g transform={trans} className='rd3-scatterchart'>
          <DataSeries
            xScale={scales.xScale}
            yScale={scales.yScale}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            hoverAnimation={props.hoverAnimation}
            circleRadius={props.circleRadius}
            data={allValues}
            colors={props.colors}
            colorAccessor={(d, i) => d}
            width={innerWidth}
            height={innerHeight}
          />
          <XAxis
            xAxisClassName="rd3-scatterchart-xaxis"
            strokeWidth="1"
            xAxisTickValues={props.xAxisTickValues}
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
            yAxisTickValues={props.yAxisTickValues}
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
