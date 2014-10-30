/** @jsx React.DOM */
var React = require('react');
window.React = React;
var pkg = require('../package.json');
var d3 = require('d3');
var Chart = require('./common').Chart;

var XAxis = React.createClass({

  componentDidMount: function() {
    var xAxis = d3.svg.axis()
      .scale(this.props.xScale)
      .orient("bottom"); 
    d3.select(".x.axis").apply(xAxis);
  },

  render: function() {
    var t = "translate(0," + this.props.height + ")";
    return (
      <g
        className="x axis"
        transform={t}
      >
      </g>
    );
  }

});


var YAxis = React.createClass({

  componentDidMount: function() {

    var yAxis = d3.svg.axis()
      .scale(this.props.yScale)
      .orient("left"); 

    d3.select(".y.axis").apply(yAxis);

  },

  render: function() {
    var t = "translate(0," + this.props.height + ")";
    return (
      <g
        className="y axis"
        transform={t}
      >
      </g>
    );
  }

});


var Area = React.createClass({
  
  propTypes: {
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    height: React.PropTypes.number,
    width: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      fill: 'steelblue'
    }
  },

  render: function() {

    return (
      <path 
        className="area"
        d={this.props.area} 
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

    var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(this.props.height)
      .y1(function(d) { return y(d.value0); });

    return (
      <Area path={area(this.props.data)} />
    )
  }

});

var AreaChart = React.createClass({

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

    var props = this.props;

    var xScale = d3.time.scale()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([0, props.width]);

    var yScale = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.value; })])
      .range([props.height, 0]);

    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries 
          xScale={xScale}
          yScale={yScale}
          data={this.props.data}
          width={this.props.width}
          height={this.props.height}
        />
      </Chart>
    );
  }

});

exports.AreaChart = AreaChart;
