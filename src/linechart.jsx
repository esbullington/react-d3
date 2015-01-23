'use strict';

var React = require('react');
var d3 = require('d3');
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

var LineChart = React.createClass({

  propTypes: {
    margins: React.PropTypes.object,
    pointRadius: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    axesColor: React.PropTypes.string,
    title: React.PropTypes.string,
    colors: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c()
    };
  },

  _calculateScales: function(props, chartWidth, chartHeight) {

    var maxY = 0,
        maxX = 0;

    for(var series in props.data) {
      var seriesMaxY = d3.max(props.data[series], function(d) {
        return d.y;
      });

      var seriesMaxX = d3.max(props.data[series], function(d) {
        return d.x;
      });

      maxX = (seriesMaxX > maxX) ? seriesMaxX : maxX;
      maxY = (seriesMaxY > maxY) ? seriesMaxY : maxY;
    }

    var xScale = d3.scale.linear()
      .domain([0, maxX])
      .range([0, chartWidth]);

    var yScale = d3.scale.linear()
      .domain([0, maxY])
      .range([chartHeight, 0]);

    return {xScale: xScale, yScale: yScale};

  },

  render: function() {

    // Calculate inner chart dimensions
    var chartWidth = this.props.width - this.props.margins.left - this.props.margins.right;
    var chartHeight = this.props.height - this.props.margins.top - this.props.margins.bottom;

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
      <Chart width={this.props.width} height={this.props.height} title={this.props.title}>
        <g transform={trans}>
          {dataSeriesArray}
          <YAxis
            yAxisClassName="line y axis"
            yScale={scales.yScale}
            margins={this.props.margins}
            yAxisTickCount={this.props.yAxisTickCount}
            width={chartWidth}
            height={chartHeight}
            stroke={this.props.axesColor}
          />
          <XAxis
            xAxisClassName="line x axis"
            strokeWidth="1"
            hideOrigin={true}
            xScale={scales.xScale}
            data={this.props.data}
            margins={this.props.margins}
            width={chartWidth}
            height={chartHeight}
            stroke={this.props.axesColor}
          />
        </g>
      </Chart>
    );
  },


});

exports.LineChart = LineChart;
