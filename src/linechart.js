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

var XAxis = React.createClass({


  componentWillReceiveProps: function(props) {

    var xAxis = d3.svg.axis()
      .scale(props.xScale)
      .orient("bottom");

    var node = this.refs.linexaxis.getDOMNode();

    d3.select(node)
      .attr("class", "linex axis")
      .call(xAxis);

    // Style each of the tick lines
    var lineXAxis = d3.select('.linex.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "#000");

    // Style the main axis line
    d3.select('.linex.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", "1")

    // Hides the x axis origin
    d3.selectAll(".linex.axis g:first-child").style("opacity","0");

  },

  render: function() {
    var t = "translate(0," + this.props.height + ")"
    return (
      <g
        ref='linexaxis'
        className="linex axis"
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

    var node = this.refs.lineyaxis.getDOMNode();

    d3.select(node)
      .attr("class", "liney axis")
      .call(yAxis);

    // Style each of the tick lines
    d3.selectAll('.liney.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "#000");

    // Style the main axis line
    d3.selectAll('.liney.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", "#000")

  },

  render: function() {
    return (
      <g
        ref='lineyaxis'
        className="liney axis"
      >
      </g>
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
    margins: React.PropTypes.object,
    pointRadius: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      pointRadius: 3,
      width: 400,
      height: 200
    }
  },

  render: function() {

    var data = this.props.data;

    var margins = this.props.margins;

    var sideMargins = margins.left + margins.right;

    var topBottomMargins = margins.top + margins.bottom;

    var maxY = d3.max(data, function(d) {
      return d.y;
    });
      
    var maxX = d3.max(data, function(d) {
      return d.x;
    });

    var xScale = d3.scale.linear()
      .domain([0, maxX])
      .range([0, this.props.width - sideMargins]);

    var yScale = d3.scale.linear()
      .domain([0, maxY])
      .range([this.props.height - topBottomMargins, 0]);

    var circles = [];

    this.props.data.forEach(function(point, i) {
      circles.push(<Circle cx={xScale(point.x)} cy={yScale(point.y)} r={this.props.pointRadius} key={i} />);
    }.bind(this));

    var trans = "translate(" + margins.left + "," + margins.top + ")"

    return (
      <Chart width={this.props.width} height={this.props.height}>
        <g transform={trans}>
          <DataSeries 
            xScale={xScale}
            yScale={yScale}
            data={this.props.data}
            width={this.props.width - sideMargins}
            height={this.props.height - topBottomMargins}
          />
          {circles}
          <YAxis 
            yScale={yScale}
            margins={margins}
            yAxisTickCount={this.props.yAxisTickCount}
            width={this.props.width - sideMargins}
            height={this.props.height - topBottomMargins}
          />
          <XAxis 
            xScale={xScale}
            data={this.props.data}
            margins={margins}
            width={this.props.width - sideMargins}
            height={this.props.height - topBottomMargins}
          />
        </g>
      </Chart>
    );
  }

});

exports.LineChart = LineChart;
