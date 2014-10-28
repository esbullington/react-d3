/** @jsx React.DOM */
var React = require('react');
window.React = React;
var pkg = require('../package.json');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Line = React.createClass({
  
  propTypes: {
    strokeWidth: React.PropTypes.number,
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      stroke: '#1f77b4',
      fill: 'none'
    }
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
    }
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
    interpolate: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      interpolate: 'linear'
    }
  },

  render: function() {
    var self = this;
    var interpolatePath = d3.svg.line()
        .x(function(d) { return self.props.xScale(d.x); })
        .y(function(d) { return self.props.yScale(d.y); })
        .interpolate(this.props.interpolate);

    return (
      <Line path={interpolatePath(this.props.data)} />
    )
  }

});

var LineChart = React.createClass({

  propTypes: {
    pointRadius: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      pointRadius: 2,
      width: 400,
      height: 200
    }
  },

  render: function() {

    var data = this.props.data;

    var size = { width: this.props.width, height: this.props.height };


    var maxY = d3.max(data, function(d) {
      return d.y;
    });
      
    var maxX = d3.max(data, function(d) {
      return d.x;
    });

    var xScale = d3.scale.linear()
      .domain([0, maxX])
      .range([0, this.props.width]);

    var yScale = d3.scale.linear()
      .domain([0, maxY])
      .range([this.props.height, 0]);

    var circles = [];
    this.props.data.forEach(function(point) {
      circles.push(<Circle cx={xScale(point.x)} cy={yScale(point.y)} r={this.props.pointRadius}  />);
    }.bind(this));

    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries 
          xScale={xScale}
          yScale={yScale}
          data={this.props.data}
          width={this.props.width}
          height={this.props.height}
        />
        {circles}
      </Chart>
    );
  }

});

exports.LineChart = LineChart;
