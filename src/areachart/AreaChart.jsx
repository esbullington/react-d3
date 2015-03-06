'use strict';

var React = require('react');
var d3 = require('d3');
var DataSeries = require('./DataSeries');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var mixins = require('../mixins');
var CartesianChartPropsMixin = mixins.CartesianChartPropsMixin;


module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  propTypes: {
    margins: React.PropTypes.object
 },

  getDefaultProps() {
    return {
      margins: {top: 10, right: 20, bottom: 40, left: 30},
      yAxisTickCount: 4,
      className: 'rd3-areachart'
    };
  },

  render() {

    var props = this.props;

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

    var yScale = d3.scale.linear()
      .range([chartHeight, 0]);

    var xValues = [];
    var yValues = [];
    var seriesNames = [];
    props.data.forEach( (series) => {
      seriesNames.push(series.name);
      series.values.forEach((val, idx) => {
        xValues.push(props.xAccessor(val));
        yValues.push(props.yAccessor(val));
      });
    });

    var xScale;
    if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]' && props.xAxisTickInterval) {
      xScale = d3.time.scale()
        .range([0, chartWidth]);
    } else {
      xScale = d3.scale.linear()
        .range([0, chartWidth]);
    }

    xScale.domain(d3.extent(xValues));
    yScale.domain(d3.extent(yValues));

    props.colors.domain(seriesNames);

    var stack = d3.layout.stack()
      .x(props.xAccessor)
      .y(props.yAccessor)
      .offset('expand')
      .order('reverse')
      .values((d)=> { return d.values; });

    var layers = stack(props.data);

    var trans = "translate(" + props.margins.left + "," + props.margins.top + ")";

    var dataSeries = layers.map( (d, idx) => {
      return (
          <DataSeries
            key={idx}
            name={d.name}
            colors={props.colors}
            index={idx}
            xScale={xScale}
            yScale={yScale}
            data={d.values}
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
        title={props.title}
      >
        <g transform={trans} className={props.className}>
          {dataSeries}
          <XAxis
            xAxisClassName="rd3-areachart-xaxis"
            xScale={xScale}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisTickCount={props.xAxisTickCount}
            margins={props.margins}
            width={chartWidth}
            height={chartHeight}
          />
          <YAxis
            yAxisClassName="rd3-areachart-yaxis"
            yScale={yScale}
            margins={props.margins}
            yAxisTickInterval={props.yAxisTickInterval}
            yAxisTickCount={props.yAxisTickCount}
            width={chartWidth}
            height={props.height}
          />
        </g>
      </Chart>
    );
  }

});
