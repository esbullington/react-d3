/** @jsx React.DOM */
var React = require('react');
var d3 = require('d3');
var Chart = require('./common').Chart;

var XAxis = React.createClass({

  componentWillReceiveProps: function(props) {

    var unit = props.xAxisTickInterval.unit;
    var interval = props.xAxisTickInterval.interval;

    var xAxis = d3.svg.axis()
      .ticks(d3.time[unit], interval)
      .scale(props.xScale)
      .orient("bottom"); 

    var node = this.refs.xaxis.getDOMNode();

    d3.select(node)
      .attr("class", "x axis")
      .call(xAxis);

    // Style each of the tick lines
    d3.select('.x.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "#000");

    // Style the main axis line
    d3.select('.x.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", "#000")

  },

  render: function() {
    var t = "translate(0," + this.props.height + ")";
    return (
      <g
        ref='xaxis'
        className="x axis"
        transform={t}
      >
      </g>
    );
  }

});


var YAxis = React.createClass({

  componentWillReceiveProps: function(props) {

    var yAxis = d3.svg.axis()
      .ticks(props.yAxisTickCount)
      .scale(props.yScale)
      .orient("left"); 

    var node = this.refs.yaxis.getDOMNode();

    d3.select(node)
      .attr("class", "y axis")
      .call(yAxis);

    // Style each of the tick lines
    d3.selectAll('.y.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "#000");

    // Style the main axis line
    d3.selectAll('.y.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", "#000")

  },

  render: function() {
    return (
      <g
        ref='yaxis'
        className="y axis"
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
        d={this.props.path} 
        fill={this.props.fill}
      />
    );
  }

});


var DataSeries = React.createClass({

  render: function() {

    var props = this.props;

    var area = d3.svg.area()
      .x(function(d) { return props.xScale(d.date); })
      .y0(this.props.height)
      .y1(function(d) { return props.yScale(d.value); });

    var path = area(this.props.data);

    return (
      <Area path={path} />
    )
  }

});

var AreaChart = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    yAxisTickCount: React.PropTypes.number,
    xAxisTickInterval: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      data: [],
      yAxisTickCount: 4,
      xAxisTickInterval: {unit: 'years', interval: 1},
      width: 400,
      height: 200
    }
  },

  render: function() {

    var props = this.props;

    var xScale = d3.time.scale()
      .range([0, props.width]);

    xScale.domain(d3.extent(props.data, function(d) { return d.date; }))

    var yScale = d3.scale.linear()
      .range([props.height, 0]);

    yScale.domain([0, d3.max(props.data, function(d) { return d.value; })])

    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    var trans = "translate(" + margin.left + "," + margin.top + ")";

    return (
      <Chart 
        ref='chart'
        width={this.props.width + margin.left + margin.right} 
        height={this.props.height + margin.top + margin.bottom}
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
            xScale={xScale}
            xAxisTickInterval={this.props.xAxisTickInterval}
            margin={margin}
            width={this.props.width}
            height={this.props.height}
          />
          <YAxis 
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

exports.AreaChart = AreaChart;
