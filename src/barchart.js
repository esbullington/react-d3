/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Bar = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,  
    width: React.PropTypes.number,  
    height: React.PropTypes.number,  
    offset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      offset: 0
    }
  },

  render: function() {
    return (
      <rect 
        fill={this.props.fill}
        width={this.props.width}
        height={this.props.height} 
        x={this.props.offset}
        y={this.props.availableHeight - this.props.height} 
      />
    );
  }
});

var XAxis = React.createClass({


  componentWillReceiveProps: function(props) {

    var unit = props.xAxisTickInterval.unit;
    var interval = props.xAxisTickInterval.interval;

    var xAxis = d3.svg.axis()
      .ticks(props.xAxisTickCount)
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

    var node = this.refs.baryaxis.getDOMNode();

    d3.select(node)
      .attr("class", "bary axis")
      .call(yAxis);

    // Style each of the tick lines
    d3.selectAll('.bary.axis')
      .selectAll('line')
      .attr("stroke", "#000");

    // Style the main axis line
    d3.selectAll('.bary.axis')
      .select('path')
      .attr("fill", "none")
      .attr("stroke", "#000")

  },

  render: function() {
    return (
      <g
        ref='baryaxis'
        className="bary axis"
      >
      </g>
    );
  }

});

var DataSeries = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,  
    title: React.PropTypes.string,  
    padding: React.PropTypes.number,  
    width: React.PropTypes.number,  
    height: React.PropTypes.number,  
    offset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      padding: 0.1,
      data: []
    }
  },

  render: function() {
    var props = this.props;

    var yScale = d3.scale.linear()
      .domain([0, d3.max(this.props.data)])
      .range([0, this.props.height]);

    var xScale = d3.scale.ordinal()
      .domain(d3.range(this.props.data.length))
      .rangeRoundBands([0, this.props.width], this.props.padding);

    var bars = this.props.data.map(function(point, i) {
      return (
        <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} fill={props.fill} key={i} />
      )
    });

    return (
      <g>{bars}</g>
    );
  }
});

var BarChart = React.createClass({

  getDefaultProps: function() {
    return {
      data: [],
      yAxisTickCount: 4,
      width: 400,
      height: 200
    }
  },

  render: function() {

    var yScale = d3.scale.linear()
      .domain([d3.max(this.props.data), 0])
      .range([0, this.props.height]);

    var xScale = d3.scale.ordinal()
      .domain(d3.range(this.props.data.length))
      .rangeRoundBands([0, this.props.width], this.props.padding);

    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    var trans = "translate(" + margin.left + "," + margin.top + ")";

    return (
      <Chart width={this.props.width} height={this.props.height}>
        <g transform={trans} >
          <DataSeries data={this.props.data} width={this.props.width} height={this.props.height} fill="cornflowerblue" />
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

exports.BarChart = BarChart;
/** @jsx React.DOM */
var React = require('react');
var d3 = require('d3');


exports.Chart = React.createClass({
  render: function() {
    return (
      <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
    );
  }
});

