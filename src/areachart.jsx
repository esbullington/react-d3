'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;

var Area = React.createClass({

  propTypes: {
    path: React.PropTypes.string,
    fill: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fill: '#3182bd'
    };
  },

  render: function() {

    return (
      <path
        className="area-path"
        d={this.props.path}
        fill={this.props.fill}
      />
    );
  }

});


var DataSeries = exports.DataSeries = React.createClass({

  render() {

    var props = this.props;

    var area = d3.svg.area()
      .x(function(d) { return props.xScale(props.xAccessor(d)); })
      .y0(function(d) { return props.yScale(d.y0); })
      .y1(function(d) { return props.yScale(d.y0 + props.yAccessor(d)); });

    var path = area(props.data);

    return (
      <Area fill={props.colors(props.name)} path={path} />
    );
  }

});


var AreaChart = exports.AreaChart = React.createClass({

  propTypes: {
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    yAxisTickCount: React.PropTypes.number,
    xAxisTickInterval: React.PropTypes.object,
    colors: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      data: [],
      colors: d3.scale.category20c(),
      margins: {top: 10, right: 20, bottom: 30, left: 30},
      legendOffset: 120,
      titleOffset: 56,
      yAxisTickCount: 4,
      width: 400,
      height: 200,
      title: ''
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

    if (props.title) {
      chartHeight = chartHeight - props.titleOffset;
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
      })
    })

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

    // var colors = d3.scale.category20();

    props.colors.domain(seriesNames);

    var stack = d3.layout.stack()
      .x(props.xAccessor)
      .y(props.yAccessor)
      .offset('expand')
      .order('reverse')
      .values(function(d) { return d.values; });

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
        ref='chart'
        width={this.props.width}
        height={this.props.height}
        margins={this.props.margins}
        title={this.props.title}
      >
        <g transform={trans} >
          {dataSeries}
          <XAxis
            xAxisClassName="area x axis"
            xScale={xScale}
            xAxisTickInterval={this.props.xAxisTickInterval}
            xAxisTickCount={4}
            margins={props.margins}
            width={chartWidth}
            height={chartHeight}
          />
          <YAxis
            yAxisClassName="area y axis"
            yScale={yScale}
            margins={props.margins}
            yAxisTickCount={this.props.yAxisTickCount}
            width={chartWidth}
            height={props.height}
          />
        </g>
      </Chart>
    );
  }

});
