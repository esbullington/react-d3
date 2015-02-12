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
    fill: React.PropTypes.string,
    height: React.PropTypes.number,
    width: React.PropTypes.number
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
      .x(function(d) { return props.xScale(d.date); })
      .y0(function(d) { return props.yScale(d.y0); })
      .y1(function(d) { return props.yScale(d.y0 + d.y); });

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
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    xAccessor: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      data: [],
      yAxisTickCount: 4,
      width: 400,
      height: 200,
      title: ''
    };
  },

  render() {

    var props = this.props;
    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    var yScale = d3.scale.linear()
      .range([props.height, 0]);

    var xValues = [];
    var seriesNames = [];
    props.data.forEach( (series) => {
      seriesNames.push(series.name);
      series.values.forEach((val, idx) => {
        xValues.push(val.date);
      })
    })

    var xScale;
    if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]' && props.xAxisTickInterval) {
      xScale = d3.time.scale()
        .range([0, props.width]);
    } else {
      xScale = d3.scale.linear()
        .range([0, props.width]);
    }

    xScale.domain(d3.extent(xValues));

    var colors = d3.scale.category20();

    colors.domain(seriesNames);

    var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

    var filteredData = props.data.filter( (series) => series.name !== 'date');

    var layers = stack(filteredData);

    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    var trans = "translate(" + margin.left + "," + margin.top + ")";

    var dataSeries = layers.map( (d, idx) => {
      return (
          <DataSeries
            key={idx}
            name={d.name}
            colors={colors}
            index={idx}
            xScale={xScale}
            yScale={yScale}
            data={d.values}
            width={props.width}
            height={props.height}
          />
        );
      });

    return (
      <Chart
        ref='chart'
        width={this.props.width + margin.left + margin.right}
        height={this.props.height + margin.top + margin.bottom}
        title={this.props.title}
      >
        <g transform={trans} >
          {dataSeries}
          <XAxis
            xAxisClassName="area x axis"
            xScale={xScale}
            xAxisTickInterval={this.props.xAxisTickInterval}
            xAxisTickCount={4}
            margin={margin}
            width={this.props.width}
            height={this.props.height}
          />
          <YAxis
            yAxisClassName="area y axis"
            yScale={yScale}
            margin={margin}
            yAxisTickCount={this.props.yAxisTickCount}
            width={this.props.width}
            height={this.props.height}
          />
        </g>
      </Chart>
    );
  }

});
