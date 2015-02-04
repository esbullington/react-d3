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

  render: function() {

    var props = this.props;

    var area = d3.svg.area()
      .x(function(d) { return props.xScale(d.date); })
      .y0(this.props.height)
      .y1(function(d) { return props.yScale(d.value); });

    var path = area(this.props.data);

    return (
      <Area path={path} />
    );
  }

});


var AreaChart = exports.AreaChart = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    yAxisTickCount: React.PropTypes.number,
    xAxisTickInterval: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      yAxisTickCount: 4,
      xAxisTickInterval: {unit: 'years', interval: 1},
      width: 400,
      height: 200,
      title: ''
    };
  },

  render: function() {

    var props = this.props;

    var xScale = d3.time.scale()
      .range([0, props.width]);

    xScale.domain(d3.extent(props.data, function(d) { return d.date; }));

    var yScale = d3.scale.linear()
      .range([props.height, 0]);

    var values = props.data.map( (item) => item.value);
    yScale.domain([d3.min([d3.min(values), 0]), d3.max(values)]);

    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    var trans = "translate(" + margin.left + "," + margin.top + ")";

    return (
      <Chart
        ref='chart'
        width={this.props.width + margin.left + margin.right}
        height={this.props.height + margin.top + margin.bottom}
        title={this.props.title}
      >
        <g transform={trans} >
          <DataSeries
            xScale={xScale}
            yScale={yScale}
            data={this.props.data}
            width={this.props.width}
            height={this.props.height}
          />
          <XAxis
            xAxisClassName="area x axis"
            xScale={xScale}
            xAxisTickInterval={this.props.xAxisTickInterval}
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
