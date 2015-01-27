'use strict';

var React = require('react');
var d3 = require('d3');
var _ = require('lodash');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;


var Line = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    strokeWidth: React.PropTypes.number,
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      stroke: '#1f77b4',
      fill: 'none'
    };
  },

  render: function() {
    return (
      <path
        d={this.props.path}
        stroke={this.props.stroke}
        fill={this.props.fill}
        strokeWidth={this.props.strokeWidth}
      />
    );
  }

});

var Circle = React.createClass({

  propTypes: {
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fill: '#1f77b4'
    };
  },

  render: function() {
    return (
      <circle
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.props.r}
        fill={this.props.fill}
      />
    );
  }

});

var DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    interpolate: React.PropTypes.string,
    color: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      interpolate: 'linear',
      color: '#fff'
    };
  },

  render: function() {
    var self = this;
    var interpolatePath = d3.svg.line()
        .x(function(d) {
          return self.props.xScale(d.x);
        })
        .y(function(d) {
          return self.props.yScale(d.y);
        })
        .interpolate(this.props.interpolate);

    var circles = [];

    this.props.data.forEach(function(point, i) {
      circles.push(<Circle cx={this.props.xScale(point.x)} cy={this.props.yScale(point.y)} r={this.props.pointRadius} fill={this.props.color} key={this.props.seriesName + i} />);
    }.bind(this));

    return (
      <g>
        <Line path={interpolatePath(this.props.data)} stroke={this.props.color} />
        {circles}
      </g>
    );
  }

});

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
    }
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
            strokeWidth={props.strokeWidth}
            xHideOrigin={props.xHideOrigin}
            xScale={props.xScale}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
          />
        </g>
    );
  }

});


var LineChart = React.createClass({

  propTypes: {
    margins: React.PropTypes.object,
    legendOffset: React.PropTypes.number,
    titleOffset: React.PropTypes.number,
    pointRadius: React.PropTypes.number,
    yHideOrigin: React.PropTypes.bool,
    xHideOrigin: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    axesColor: React.PropTypes.string,
    title: React.PropTypes.string,
    colors: React.PropTypes.func,
    legend: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      margins: {top: 10, right: 20, bottom: 30, left: 30},
      legendOffset: 120,
      titleOffset: 56,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c()
    };
  },

  _calculateScales: function(props, chartWidth, chartHeight) {

    var allValues = _.flatten(_.values(this.props.data), true);
    var xValues = _.pluck(allValues, 'x');
    var yValues = _.pluck(allValues, 'y');

    var xScale = d3.scale.linear()
      .domain([d3.min([d3.min(xValues), 0]), d3.max(xValues)])
      .range([0, chartWidth]);

    var yScale = d3.scale.linear()
      .domain([d3.min([d3.min(yValues), 0]), d3.max(yValues)])
      .range([chartHeight, 0]);

    return {xScale: xScale, yScale: yScale};

  },

  render: function() {

    var props = this.props;

    // Calculate inner chart dimensions
    var chartWidth, chartHeight;

    chartWidth = this.props.width - this.props.margins.left - this.props.margins.right;
    chartHeight = this.props.height - this.props.margins.top - this.props.margins.bottom;

    if (this.props.legend) {
      chartWidth = chartWidth - this.props.legendOffset;
    }

    if (this.props.title) {
      chartHeight = chartHeight - this.props.titleOffset;
    }

    var scales = this._calculateScales(this.props, chartWidth, chartHeight);

    var trans = "translate(" + this.props.margins.left + "," + this.props.margins.top + ")";

    var index = 0;
    var dataSeriesArray = [];
    for(var seriesName in this.props.data) {
      if (this.props.data.hasOwnProperty(seriesName)) {
        dataSeriesArray.push(
            <DataSeries
              xScale={scales.xScale}
              yScale={scales.yScale}
              seriesName={seriesName}
              data={this.props.data[seriesName]}
              width={chartWidth}
              height={chartHeight}
              color={this.props.colors(index)}
              pointRadius={this.props.pointRadius}
              key={seriesName}
            />
        );
        index++;
      }
    }

    return (
      <Chart
        legend={this.props.legend}
        data={this.props.data}
        margins={this.props.margins}
        colors={this.props.colors}
        width={this.props.width}
        height={this.props.height}
        title={this.props.title}
      >
        <g transform={trans}>
          {dataSeriesArray}
          <Axes
            yAxisClassName="line y axis"
            yScale={scales.yScale}
            yAxisTickCount={this.props.yAxisTickCount}
            yHideOrigin={this.props.yHideOrigin}
            xAxisClassName="line x axis"
            xScale={scales.xScale}
            xHideOrigin={this.props.xHideOrigin}
            strokeWidth="1"
            margins={this.props.margins}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            stroke={this.props.axesColor}
          />
        </g>
      </Chart>
    );
  },


});

exports.LineChart = LineChart;
